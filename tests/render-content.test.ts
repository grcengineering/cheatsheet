import { describe, expect, test } from 'bun:test';
import { escapeHtml, inlineMd, parseMarkdown, plainText, renderDocument, slugify, splitRow } from '../scripts/render-content';

const markdown = await Bun.file(new URL('../README.md', import.meta.url)).text();
const content = parseMarkdown(markdown);
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

async function elements(html: string, selector: string) {
  const matches: { text: string; id: string | null; href: string | null; scope: string | null }[] = [];
  const transformed = new HTMLRewriter().on(selector, {
    element(element) { matches.push({ text: '', id: element.getAttribute('id'), href: element.getAttribute('href'), scope: element.getAttribute('scope') }); },
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
    expect(content.practice.intro.length).toBeGreaterThan(0);
    expect(content.practice.subsections.length).toBeGreaterThan(0);
  });
  test('rejects missing canonical sections rather than silently dropping content', () => {
    for (const name of ['First Principles', 'Legacy GRC vs. GRC Engineering', 'GRC Engineering in practice', 'Timeline', 'Terms', 'Tools', 'Teachings']) {
      expect(() => parseMarkdown(markdown.replace('## ' + name, '## Renamed ' + name)))
        .toThrow(name === 'Timeline' ? 'must end at the Timeline section' : 'Missing required section');
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
  test('requires practice prose and explicitly parses H3 subsections instead of collapsing them', () => {
    const replacePractice = (body: string) => markdown.replace(/(## GRC Engineering in practice\n)[\s\S]*?(?=\n## Timeline)/, '$1\n' + body + '\n');
    const minimal = parseMarkdown(replacePractice('An **intro**.\n\n### Test the claim\n\nUse `synthetic` evidence.\n\nA second paragraph.'));
    expect(minimal.practice).toEqual({ intro: ['An **intro**.'], subsections: [{ heading: 'Test the claim', paragraphs: ['Use `synthetic` evidence.', 'A second paragraph.'] }] });
    for (const body of ['', 'Only an introduction.', '### No introduction\n\nBody.', 'Intro.\n\n### Empty subsection', '<em></em>\n\n### Topic\n\nBody.', 'Intro.\n\n### Topic\n\n<br>']) {
      expect(() => parseMarkdown(replacePractice(body))).toThrow('requires an introduction and nonempty H3 subsections');
    }
    for (const block of ['- Lost list item', '1. Lost ordered item', '```ts\ncode\n```', '#### Unsupported heading', '| hidden | table |', '> quote']) {
      expect(() => parseMarkdown(replacePractice('Intro.\n\n### Topic\n\n' + block))).toThrow('supports paragraphs and H3 subsections only');
    }
    expect(() => parseMarkdown(replacePractice('Intro.\n\n### Repeated\n\nFirst.\n\n### Repeated\n\nSecond.'))).toThrow('unique, nonempty subsection anchors');
    expect(() => parseMarkdown(replacePractice('Intro.\n\n### !!!\n\nBody.'))).toThrow('unique, nonempty subsection anchors');
  });
  test('outer section routing cannot silently discard practice headings or split off its example', () => {
    const firstHeading = '### ' + content.practice.subsections[0].heading;
    const exampleHeading = '### ' + content.practice.subsections[content.practice.subsections.length - 1].heading;
    const unexpectedTitle = markdown.replace(firstHeading, '# Accidentally lost heading\n\n' + firstHeading);
    expect(unexpectedTitle).not.toBe(markdown);
    expect(() => parseMarkdown(unexpectedTitle)).toThrow('supports paragraphs and H3 subsections only');
    const unexpectedSplit = markdown.replace(exampleHeading, '## Unexpected practice split\n\n' + exampleHeading);
    expect(unexpectedSplit).not.toBe(markdown);
    expect(() => parseMarkdown(unexpectedSplit)).toThrow('unexpected H2 would discard practice content');
    // A normal Timeline boundary, followed by the remaining tables and Contributing, remains supported.
    const normalTransition = markdown.replace('\n---\n\n## Timeline', '\n\n## Timeline');
    expect(normalTransition).not.toBe(markdown);
    expect(normalTransition).toContain('## Contributing');
    const parsed = parseMarkdown(normalTransition);
    expect(parsed.practice).toEqual(content.practice);
    expect(parsed.tables.Timeline).toEqual(content.tables.Timeline);
    expect(parsed.tables.Teachings).toEqual(content.tables.Teachings);
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
    for (const [nextSection, table] of Object.entries({ 'GRC Engineering in practice': 'Legacy GRC vs. GRC Engineering', Terms: 'Timeline', Teachings: 'Tools', Contributing: 'Teachings' })) {
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
  test('practice paragraphs and headings are complete, linked, safe HTML between comparison and timeline', async () => {
    const html = renderDocument(await fixture(), markdown);
    const practice = (await elements(html, '[data-awesome="practice"]'))[0];
    for (const paragraph of content.practice.intro) expect(practice.text).toContain(normalize(plainText(paragraph)));
    const topics = await elements(html, '.practice-topic');
    expect(topics).toHaveLength(content.practice.subsections.length);
    content.practice.subsections.forEach((section, index) => {
      expect(topics[index].text).toContain(normalize(plainText(section.heading)));
      for (const paragraph of section.paragraphs) expect(topics[index].text).toContain(normalize(plainText(paragraph)));
    });
    expect((await elements(html, '.practice-topic h3')).map(heading => heading.id))
      .toEqual(content.practice.subsections.map(section => 'practice-' + slugify(section.heading)));
    expect((await elements(html, 'nav a[href="#practice"]')).map(link => link.text)).toEqual(['Practice', 'Practice']);
    expect(await elements(html, '#practice a[href="#practice"]')).toHaveLength(1);
    expect(await elements(html, '#practice button[data-anchor="practice"]')).toHaveLength(1);
    expect(html.indexOf('class="practice-section"')).toBeGreaterThan(html.indexOf('class="comparison-section"'));
    expect(html.indexOf('class="practice-section"')).toBeLessThan(html.indexOf('class="timeline-section"'));
    expect(html).toContain("{ sel: '.practice-section', id: 'practice' }");
    const injected = markdown.replace(content.practice.intro[0], 'A **strong** `<script>` and [reference](https://example.com/).');
    const safeHtml = renderDocument(await fixture(), injected);
    expect(safeHtml).toContain('A <strong>strong</strong> <code>&lt;script&gt;</code> and <a href="https://example.com/" target="_blank" rel="noopener noreferrer">reference</a>.');
  });
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
  test('timeline narratives and citations are real HTML while modal datasets retain parity', async () => {
    const html = renderDocument(await fixture(), markdown);
    const events = await elements(html, '.tl-event');
    const narratives = await elements(html, '.timeline-narratives li');
    const citations = await elements(html, '.timeline-narratives a');
    expect(events).toHaveLength(content.tables.Timeline.rows.length);
    expect(narratives).toHaveLength(events.length);
    content.tables.Timeline.rows.forEach((row, i) => {
      for (const cell of row.slice(0, 6)) expect(narratives[i].text).toContain(normalize(plainText(cell)));
      expect(citations[i].href).toBe(row[6]);
      for (const [column, name] of ['year', 'date', 'title', 'actor', 'summary', 'relevance', 'source'].entries()) {
        expect(html).toContain('data-' + name + '="' + escapeHtml(plainText(row[column])) + '"');
      }
    });
    expect(await elements(html, 'details.timeline-narratives > summary')).toHaveLength(1);
    expect(() => renderDocument('', markdown.replace(content.tables.Timeline.rows[0][6], 'javascript:bad'))).toThrow('Timeline requires an HTTP(S) source URL');
  });
  test('stable term links, scoped column headers, captions and the full main landmark survive generation', async () => {
    const html = renderDocument(await fixture(), markdown);
    const terms = await elements(html, '[data-awesome="terms"] tr');
    expect(terms.map(row => row.id)).toEqual(content.tables.Terms.rows.map(row => 'term-' + slugify(row[0])));
    for (const section of ['.page-header', '.comparison-section', '.practice-section', '.timeline-section', '.ref-tables']) {
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
    expect(() => renderDocument(template.replace('{{PRACTICE}}', ''), markdown)).toThrow('exactly one {{PRACTICE}}');
    expect(() => renderDocument(template + '{{PRACTICE}}', markdown)).toThrow('exactly one {{PRACTICE}}');
    expect(() => renderDocument(template + '{{UNKNOWN}}', markdown)).toThrow('Unresolved template placeholder');
  });
});

