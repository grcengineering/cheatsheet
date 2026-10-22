import { describe, expect, test } from 'bun:test';
import { escapeHtml, inlineMd, parseMarkdown, plainText, renderDocument, slugify, splitRow } from '../scripts/render-content';

const markdown = await Bun.file(new URL('../README.md', import.meta.url)).text();
const content = parseMarkdown(markdown);
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

async function elements(html: string, selector: string) {
  const matches: { text: string; id: string | null; href: string | null; scope: string | null; attributes: Record<string, string> }[] = [];
  const transformed = new HTMLRewriter().on(selector, {
    element(element) { matches.push({ text: '', id: element.getAttribute('id'), href: element.getAttribute('href'), scope: element.getAttribute('scope'), attributes: Object.fromEntries(element.attributes) }); },
    text(chunk) { matches[matches.length - 1].text += chunk.text; },
  }).transform(new Response(html.replace(/<br\s*\/?\s*>/g, ' ')));
  await transformed.text();
  return matches.map(element => ({ ...element, text: normalize(element.text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')) }));
}

async function fixture() {
  const template = await Bun.file(new URL('../src/index.template.html', import.meta.url)).text();
  return template.replace('{{STRUCTURED_DATA}}', '{}');
}

describe('documented inline Markdown', () => {
  test('preserves emphasis, approved HTML, nested link labels, and parenthesized URLs', () => {
    expect(inlineMd('**Bold** *emphasis* <u>underlined</u><br><em>raw</em> <span class="text-highlight text-highlight-blue">blue</span>'))
      .toBe('<strong>Bold</strong> <em>emphasis</em> <u>underlined</u><br><em>raw</em> <span class="text-highlight text-highlight-blue">blue</span>');
    expect(inlineMd('[**Label**](https://example.com/a_(b)?a=1&b=2)'))
      .toBe('<a href="https://example.com/a_(b)?a=1&amp;b=2" target="_blank" rel="noopener noreferrer"><strong>Label</strong></a>');
    expect(inlineMd('[Risk](#term-risk)')).toBe('<a href="#term-risk" class="term-link">Risk</a>');
  });
  test('escapes unsupported HTML and literal code; malformed markup stays readable', () => {
    expect(inlineMd('`<br>•` <script>alert("x")</script>')).toBe('<code>&lt;br&gt;•</code> &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
    expect(inlineMd('` * ** [label](unclosed [other')).toBe('` * ** [label](unclosed [other');
    expect(inlineMd('[] [no-link] **')).toBe('[] [no-link] **');
    expect(escapeHtml('<>&"\'')).toBe('&lt;&gt;&amp;&quot;&#39;');
  });
  test('rejects executable or malformed URL destinations', () => {
    for (const url of ['javascript:alert(1)', 'data:text/html,evil', 'https://example.com/"x', 'https://example.com/a b']) {
      expect(() => inlineMd('[unsafe](' + url + ')')).toThrow('Unsupported Markdown link');
    }
  });
  test('keeps existing term slugs and plain-text modal values', () => {
    expect(slugify('**Policy-as-Code (PaC)**')).toBe('policy-as-code-pac');
    expect(plainText('**Bold** & <em>em</em> "< >"')).toBe('Bold & em "< >"');
    expect(plainText('[link](https://example.com)')).toBe('link');
    expect(splitRow('| left \\| center | right |')).toEqual(['left | center', 'right']);
    expect(splitRow('left | right')).toEqual(['left', 'right']);
  });
});

describe('canonical README validation', () => {
  test('reads all canonical data with CRLF or LF input', () => {
    expect(parseMarkdown(markdown.replace(/\n/g, '\r\n'))).toEqual(content);
    expect(content.cards.map(card => card.term)).toEqual(['GRC', 'Engineering', 'GRC Engineering']);
    expect(content.tables['Legacy GRC vs. GRC Engineering'].rows).toHaveLength(5);
    expect(content.tables.Timeline.rows.length).toBeGreaterThan(20);
    expect(content.tables.Terms.rows.length).toBeGreaterThan(20);
  });
  test('rejects missing canonical sections rather than silently dropping content', () => {
    for (const name of ['First Principles', 'Legacy GRC vs. GRC Engineering', 'Timeline', 'Terms', 'Tools', 'Teachings']) {
      expect(() => parseMarkdown(markdown.replace('## ' + name, '## Renamed ' + name))).toThrow('Missing required section');
    }
    expect(() => parseMarkdown(markdown + '\n## Terms\n')).toThrow('Duplicate section');
    expect(() => parseMarkdown(markdown.replace(/^# .+\n/, ''))).toThrow('README requires a title');
    expect(() => parseMarkdown(markdown.replace(/^>.*\n/m, ''))).toThrow('introductory blockquote');
  });
  test('requires all three nonempty definition cards in the original order', () => {
    expect(() => parseMarkdown(markdown.replace('### Engineering', '### Renamed'))).toThrow('First Principles');
    expect(() => parseMarkdown(markdown.replace(/### GRC\n[\s\S]*?(?=### Engineering)/, '### GRC\n\n'))).toThrow('First Principles');
    expect(() => parseMarkdown(markdown.replace(/### GRC\n[\s\S]*?(?=---\n\n## Legacy)/, ''))).toThrow('First Principles');
  });
  test('rejects absent tables, bad dimensions/separators, blank cells, and ambiguous term anchors', () => {
    expect(() => parseMarkdown(markdown.replace(/\| Term \| Description \|[\s\S]*?(?=\n---\n\n## Tools)/, ''))).toThrow('Terms requires a table');
    expect(() => parseMarkdown(markdown.replace('| Term | Description |', '| Term | Description | Extra |'))).toThrow('Terms table requires 2 columns');
    expect(() => parseMarkdown(markdown.replace('| Term | Description |\n|---|---|', '| Term | Description |\n|bad|separator|'))).toThrow('valid separator');
    expect(() => parseMarkdown(markdown.replace('| **Active Testing** |', '| |'))).toThrow('empty cell');
    expect(() => parseMarkdown(markdown.replace('| **Compliance** |', '| **Active Testing** |'))).toThrow('unique, nonempty anchors');
    expect(() => parseMarkdown(markdown.replace('| **Active Testing** |', '| **!!!** |'))).toThrow('unique, nonempty anchors');
  });
  test('fails publication when canonical prose or another table would otherwise be dropped', async () => {
    const template = await fixture();
    const note = 'This glossary note is canonical content that must reach the published page.';
    const edited = markdown.replace('\n---\n\n## Tools', '\n' + note + '\n\n---\n\n## Tools');
    expect(edited).not.toBe(markdown);
    expect(() => parseMarkdown(edited)).toThrow('Unrendered content after Terms table');
    expect(() => renderDocument(template, edited)).toThrow('put section prose before the table');
    for (const [nextSection, table] of Object.entries({ Timeline: 'Legacy GRC vs. GRC Engineering', Terms: 'Timeline', Teachings: 'Tools', Contributing: 'Teachings' })) {
      const changed = markdown.replace('\n---\n\n## ' + nextSection, '\n\n' + note + '\n\n---\n\n## ' + nextSection);
      expect(changed).not.toBe(markdown);
      expect(() => renderDocument(template, changed)).toThrow('Unrendered content after ' + table + ' table');
    }
    const secondTable = markdown.replace('\n---\n\n## Tools', '\n| Additional | Description |\n|---|---|\n| Entry | Must not disappear |\n\n---\n\n## Tools');
    expect(() => renderDocument(template, secondTable)).toThrow('Unrendered content after Terms table');
    // Moving the same prose to the supported introduction is reflected in the output.
    const supported = markdown.replace('Vocabulary that distinguishes', note + '\n\nVocabulary that distinguishes');
    expect(renderDocument(template, supported)).toContain(note);
  });
});

describe('static publication parity', () => {
  test('renders every definition, intro, comparison bullet, term, tool and teaching without a script', async () => {
    const html = renderDocument(await fixture(), markdown);
    for (let i = 0; i < content.cards.length; i++) {
      const card = content.cards[i];
      const rendered = await elements(html, '[data-fp-card="' + i + '"]');
      expect(rendered).toHaveLength(1);
      expect(rendered[0].text).toContain(card.term);
      for (const paragraph of card.paragraphs) expect(rendered[0].text).toContain(normalize(plainText(paragraph)));
    }
    const introText = (await elements(html, '.page-header')).map(element => element.text).join(' ');
    expect(introText).toContain(normalize(plainText(content.description)));
    for (const paragraph of content.intro) expect(introText).toContain(normalize(plainText(paragraph)));
    for (const [name, selector] of Object.entries({ 'Legacy GRC vs. GRC Engineering': 'comparison', Terms: 'terms', Tools: 'tools', Teachings: 'teachings' })) {
      const rows = await elements(html, 'tbody[data-awesome="' + selector + '"] tr');
      expect(rows).toHaveLength(content.tables[name].rows.length);
      content.tables[name].rows.forEach((row, i) => {
        row.forEach((cell, column) => {
          // Type labels intentionally span adjacent teaching rows, as in the existing UI.
          if (name === 'Teachings' && column === 0 && i > 0 && row[0] === content.tables[name].rows[i - 1][0]) return;
          for (const part of cell.replace(/^•\s*/, '').split(/<br>\s*•\s*/)) {
            expect(rows[i].text).toContain(normalize(plainText(part)));
          }
        });
      });
    }
    for (const [name, section] of Object.entries({ 'Legacy GRC vs. GRC Engineering': '.comparison-section', Timeline: '.timeline-section', Terms: '#terms-table', Tools: '#tools-table', Teachings: '#teachings-table' })) {
      const sectionText = (await elements(html, section))[0].text;
      for (const paragraph of content.intros[name]) expect(sectionText).toContain(normalize(plainText(paragraph)));
    }
    expect(html).not.toContain('README_URL');
    expect(html).not.toContain('{{');
  });
  test('the interactive timeline retains every label, modal field and citation without a duplicate expander', async () => {
    const html = renderDocument(await fixture(), markdown);
    const events = await elements(html, '.tl-event');
    const years = await elements(html, '.tl-event .tl-year');
    const labels = await elements(html, '.tl-event .tl-label');
    expect(events).toHaveLength(content.tables.Timeline.rows.length);
    expect(years).toHaveLength(events.length);
    expect(labels).toHaveLength(events.length);
    content.tables.Timeline.rows.forEach((row, i) => {
      expect(years[i].text).toBe(normalize(plainText(row[0])));
      expect(labels[i].text).toBe(normalize(plainText(row[2])));
      expect(events[i].attributes['aria-label']).toBe(escapeHtml(plainText(row[0] + ': ' + row[2])));
      expect(events[i].attributes.role).toBe('button');
      expect(events[i].attributes.tabindex).toBe('0');
      for (const [column, name] of ['year', 'date', 'title', 'actor', 'summary', 'relevance', 'source'].entries()) {
        expect(events[i].attributes['data-' + name]).toBe(escapeHtml(plainText(row[column])));
      }
    });
    expect(await elements(html, '.timeline-narratives')).toHaveLength(0);
    expect(html).not.toContain('Read the complete timeline');
    expect(() => renderDocument('', markdown.replace(content.tables.Timeline.rows[0][6], 'javascript:bad'))).toThrow('Timeline requires an HTTP(S) source URL');
  });
  test('stable term links, scoped column headers, captions and the full main landmark survive generation', async () => {
    const html = renderDocument(await fixture(), markdown);
    const terms = await elements(html, '[data-awesome="terms"] tr');
    expect(terms.map(row => row.id)).toEqual(content.tables.Terms.rows.map(row => 'term-' + slugify(row[0])));
    for (const section of ['.page-header', '.comparison-section', '.timeline-section', '.ref-tables']) {
      expect(await elements(html, 'main ' + section)).toHaveLength(1);
    }
    expect(await elements(html, 'main')).toHaveLength(1);
    const captions = await elements(html, 'table caption');
    expect(captions).toHaveLength(4);
    expect(captions.every(caption => caption.text.length > 0)).toBe(true);
    expect((await elements(html, 'table thead th')).every(header => header.scope === 'col')).toBe(true);
    const listener = html.indexOf("document.addEventListener('cheatsheet:rendered'");
    const dispatch = html.indexOf("document.dispatchEvent(new CustomEvent('cheatsheet:rendered'))");
    expect(listener).toBeGreaterThan(0);
    expect(dispatch).toBeGreaterThan(listener);
  });
  test('template drift and ambiguous placeholders fail clearly; output is deterministic', async () => {
    const template = await fixture();
    const first = renderDocument(template, markdown);
    expect(renderDocument(template, markdown)).toBe(first);
    expect(renderDocument(template, markdown.replace('Exercising controls', 'Actively exercising controls'))).not.toBe(first);
    expect(() => renderDocument(template.replace('{{TERMS}}', ''), markdown)).toThrow('exactly one {{TERMS}}');
    expect(() => renderDocument(template + '{{TERMS}}', markdown)).toThrow('exactly one {{TERMS}}');
    expect(() => renderDocument(template + '{{UNKNOWN}}', markdown)).toThrow('Unresolved template placeholder');
  });
});

