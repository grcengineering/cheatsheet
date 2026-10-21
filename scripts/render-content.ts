/** Build the published reference from README; no content fetch is needed in the browser. */
export type Table = { headers: string[]; rows: string[][] };
export type Card = { term: string; paragraphs: string[] };
export type Practice = { intro: string[]; subsections: { heading: string; paragraphs: string[] }[] };
export type Content = {
  description: string;
  intro: string[];
  cards: Card[];
  practice: Practice;
  intros: Record<string, string[]>;
  tables: Record<string, Table>;
};

const TABLES: Record<string, number> = {
  'Legacy GRC vs. GRC Engineering': 3,
  Timeline: 7,
  Terms: 2,
  Tools: 2,
  Teachings: 3,
};

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** The small, explicit inline dialect documented in README. Unknown HTML is text. */
export function inlineMd(value: string): string {
  let html = '';
  for (let i = 0; i < value.length;) {
    const rest = value.slice(i);
    const tag = rest.match(/^(?:<\/?(?:u|em|strong|code)>|<br\s*\/?\s*>|<span class="[a-zA-Z0-9 _-]+">|<\/span>)/);
    if (tag) { html += tag[0]; i += tag[0].length; continue; }
    if (value[i] === '`') {
      const end = value.indexOf('`', i + 1);
      if (end > i + 1) { html += '<code>' + escapeHtml(value.slice(i + 1, end)) + '</code>'; i = end + 1; continue; }
    }
    if (value[i] === '[') {
      const labelEnd = value.indexOf('](', i + 1);
      if (labelEnd !== -1) {
        let end = labelEnd + 2, depth = 1;
        while (end < value.length && depth) {
          if (value[end] === '(') depth++;
          if (value[end] === ')') depth--;
          if (depth) end++;
        }
        if (!depth) {
          const url = value.slice(labelEnd + 2, end);
          if (!/^(?:https?:\/\/[^\s<>"']+|#[a-zA-Z0-9_-]+)$/.test(url)) throw new Error('Unsupported Markdown link: ' + url);
          const attrs = url[0] === '#' ? ' class="term-link"' : ' target="_blank" rel="noopener noreferrer"';
          html += '<a href="' + escapeHtml(url) + '"' + attrs + '>' + inlineMd(value.slice(i + 1, labelEnd)) + '</a>';
          i = end + 1; continue;
        }
      }
    }
    if (value[i] === '*') {
      const marker = rest.startsWith('**') ? '**' : '*';
      const end = value.indexOf(marker, i + marker.length);
      if (end > i + marker.length && value.slice(i + marker.length, end).trim() === value.slice(i + marker.length, end)) {
        const tagName = marker === '**' ? 'strong' : 'em';
        html += '<' + tagName + '>' + inlineMd(value.slice(i + marker.length, end)) + '</' + tagName + '>';
        i = end + marker.length; continue;
      }
    }
    html += escapeHtml(value[i]); i++;
  }
  return html;
}

export function plainText(value: string): string {
  return inlineMd(value).replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

export function slugify(value: string): string {
  return plainText(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function splitRow(line: string): string[] {
  const source = line.replace(/^\s*\|/, '').replace(/\|\s*$/, '');
  const cells: string[] = [];
  let cell = '';
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '\\' && source[i + 1] === '|') { cell += '|'; i++; }
    else if (source[i] === '|') { cells.push(cell.trim()); cell = ''; }
    else cell += source[i];
  }
  cells.push(cell.trim());
  return cells;
}

function paragraphs(lines: string[]): string[] {
  return lines.join('\n').split(/\n\s*\n|\n?^\s*(?:-{3,}|\*{3,}|_{3,})\s*$\n?/m)
    .map(paragraph => paragraph.trim().replace(/\s*\n\s*/g, ' ')).filter(Boolean);
}

/** Practice deliberately supports prose and H3s, so unsupported blocks cannot disappear. */
function parsePractice(lines: string[]): Practice {
  const practice: Practice = { intro: [], subsections: [] };
  let block: string[] = [];
  const finish = () => {
    const text = paragraphs(block);
    if (practice.subsections.length) practice.subsections[practice.subsections.length - 1].paragraphs = text;
    else practice.intro = text;
    block = [];
  };
  for (const line of lines) {
    const heading = line.match(/^###\s+(.+)$/);
    if (heading) {
      finish();
      practice.subsections.push({ heading: heading[1].trim(), paragraphs: [] });
    } else {
      if (/^\s*(?:#{1,6}\s|`{3,}|~{3,}|(?:[-+*]|\d+[.)])\s+|\||>)/.test(line)) {
        throw new Error('GRC Engineering in practice supports paragraphs and H3 subsections only');
      }
      block.push(line);
    }
  }
  finish();
  const hasProse = (values: string[]) => values.length > 0 && values.every(value => plainText(value).trim());
  if (!hasProse(practice.intro) || !practice.subsections.length || practice.subsections.some(section => !hasProse(section.paragraphs))) {
    throw new Error('GRC Engineering in practice requires an introduction and nonempty H3 subsections');
  }
  const anchors = practice.subsections.map(section => slugify(section.heading));
  if (anchors.includes('') || new Set(anchors).size !== anchors.length) {
    throw new Error('GRC Engineering in practice requires unique, nonempty subsection anchors');
  }
  return practice;
}

export function parseMarkdown(markdown: string): Content {
  const sections: Record<string, string[]> = { __intro: [] };
  let current = '__intro', hasTitle = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^#\s+/.test(line)) {
      if (current === 'GRC Engineering in practice') {
        throw new Error('GRC Engineering in practice supports paragraphs and H3 subsections only');
      }
      hasTitle = true; continue;
    }
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      if (current === 'GRC Engineering in practice' && h2[1].trim() !== 'Timeline') {
        throw new Error('GRC Engineering in practice must end at the Timeline section; unexpected H2 would discard practice content');
      }
      current = h2[1].trim();
      if (sections[current]) throw new Error('Duplicate section: ' + current);
      sections[current] = [];
    } else sections[current].push(line);
  }
  if (!hasTitle) throw new Error('README requires a title');
  for (const name of ['First Principles', 'GRC Engineering in practice', ...Object.keys(TABLES)]) {
    if (!sections[name]) throw new Error('Missing required section: ' + name);
  }
  const description = sections.__intro.filter(line => /^>/.test(line)).map(line => line.replace(/^>\s?/, '')).join(' ').trim();
  if (!description) throw new Error('README requires an introductory blockquote');
  const intro = paragraphs(sections.__intro.filter(line => !/^>/.test(line)));
  const cards: Card[] = [];
  let cardLines: string[] = [];
  for (const line of sections['First Principles']) {
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      if (cards.length) cards[cards.length - 1].paragraphs = paragraphs(cardLines);
      cards.push({ term: h3[1].trim(), paragraphs: [] }); cardLines = [];
    } else cardLines.push(line);
  }
  if (cards.length) cards[cards.length - 1].paragraphs = paragraphs(cardLines);
  if (cards.length !== 3 || cards.some((card, i) => card.term !== ['GRC', 'Engineering', 'GRC Engineering'][i] || !card.paragraphs.length)) {
    throw new Error('First Principles requires nonempty GRC, Engineering, and GRC Engineering cards in order');
  }
  const tables: Record<string, Table> = {}, intros: Record<string, string[]> = {};
  for (const [name, columns] of Object.entries(TABLES)) {
    const lines = sections[name];
    const start = lines.findIndex(line => /^\s*\|/.test(line));
    const tableLines: string[] = [];
    for (let i = start; i >= 0 && i < lines.length && /^\s*\|/.test(lines[i]); i++) tableLines.push(lines[i]);
    if (tableLines.length < 3) throw new Error(name + ' requires a table with data rows');
    if (paragraphs(lines.slice(start + tableLines.length)).length) {
      throw new Error('Unrendered content after ' + name + ' table; put section prose before the table');
    }
    const allRows = tableLines.map(splitRow);
    if (allRows.some(row => row.length !== columns) || !allRows[1].every(cell => /^:?-{3,}:?$/.test(cell))) {
      throw new Error(name + ' table requires ' + columns + ' columns and a valid separator');
    }
    if (allRows.slice(2).some(row => row.some(cell => !cell))) throw new Error(name + ' table contains an empty cell');
    tables[name] = { headers: allRows[0], rows: allRows.slice(2) };
    intros[name] = paragraphs(lines.slice(0, start));
  }
  const ids = tables.Terms.rows.map(row => slugify(row[0]));
  if (new Set(ids).size !== ids.length || ids.includes('')) throw new Error('Terms require unique, nonempty anchors');
  const practice = parsePractice(sections['GRC Engineering in practice']);
  return { description, intro, cards, practice, intros, tables };
}

function renderParagraphs(content: string[]): string {
  return content.map(paragraph => '<p>' + inlineMd(paragraph) + '</p>').join('\n');
}

function renderPractice(practice: Practice): string {
  return '<div class="practice-intro">' + renderParagraphs(practice.intro) + '</div>\n'
    + practice.subsections.map(section => '<article class="practice-topic"><h3 id="practice-' + slugify(section.heading) + '">'
      + inlineMd(section.heading) + '</h3>\n' + renderParagraphs(section.paragraphs) + '</article>').join('\n');
}

function renderComparison(table: Table): string {
  return table.rows.map(row => {
    const label = inlineMd(row[0]).replace(/Trust\s*&amp;\s*Assurance/i, 'Trust &amp;<br>Assurance');
    const bullets = row.slice(1).map(cell => '<td><ul>' + cell.replace(/^•\s*/, '').split(/<br>\s*•\s*/)
      .map(item => '<li>' + inlineMd(item.trim()) + '</li>').join('') + '</ul></td>').join('');
    return '<tr><td><span class="program-label">' + label + '</span></td>' + bullets + '</tr>';
  }).join('\n');
}

function renderTimeline(table: Table): { visual: string; narratives: string } {
  const visual = table.rows.map(row => {
    const [year, date, title, actor, summary, relevance, source] = row;
    const attrs = Object.entries({ year, date, title, actor, summary, relevance, source })
      .map(([name, value]) => ' data-' + name + '="' + escapeHtml(plainText(value)) + '"').join('');
    return '<div class="tl-event" tabindex="0" role="button" aria-label="' + escapeHtml(plainText(year + ': ' + title)) + '"' + attrs + '>'
      + '<div class="tl-content"><span class="tl-year">' + inlineMd(year) + '</span><span class="tl-label">' + inlineMd(title) + '</span></div>'
      + '<div class="tl-stem"></div><div class="tl-marker"></div></div>';
  }).join('\n');
  const narratives = '<details class="timeline-narratives"><summary>Read the complete timeline (' + table.rows.length + ' milestones)</summary>\n<ol>'
    + table.rows.map((row, i) => {
      const [year, date, title, actor, summary, relevance, source] = row;
      if (!/^https?:\/\/[^\s<>"']+$/.test(source)) throw new Error('Timeline requires an HTTP(S) source URL');
      return '<li id="timeline-event-' + (i + 1) + '"><article><h3>' + inlineMd(year + ' — ' + title) + '</h3>'
        + '<p class="timeline-event-meta">' + inlineMd(date + ' · ' + actor) + '</p><p>' + inlineMd(summary) + '</p>'
        + '<p><strong>GRC relevance:</strong> ' + inlineMd(relevance) + '</p><p><strong>Source:</strong> <a href="' + escapeHtml(source)
        + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(source) + '</a></p></article></li>';
    }).join('\n') + '</ol></details>';
  return { visual, narratives };
}

function renderTwoColumn(table: Table, termAnchors = false): string {
  return table.rows.map(row => '<tr' + (termAnchors ? ' id="term-' + slugify(row[0]) + '"' : '') + '><td>'
    + inlineMd(row[0]) + '</td><td>' + inlineMd(row[1]) + '</td></tr>').join('\n');
}

function renderTeachings(table: Table): string {
  let html = '';
  for (let i = 0; i < table.rows.length;) {
    const type = table.rows[i][0];
    let span = 1;
    while (i + span < table.rows.length && table.rows[i + span][0] === type) span++;
    for (let j = 0; j < span; j++) {
      const row = table.rows[i + j];
      html += '<tr>' + (j === 0 ? '<td rowspan="' + span + '" class="teaching-type">' + inlineMd(type) + '</td>' : '')
        + '<td>' + inlineMd(row[1]) + '<span class="teaching-author">' + inlineMd(row[2]) + '</span></td></tr>\n';
    }
    i += span;
  }
  return html.trimEnd();
}

/** Placeholders have exactly one occurrence, so a template edit cannot silently drop content. */
export function renderDocument(template: string, markdown: string): string {
  const content = parseMarkdown(markdown);
  const timeline = renderTimeline(content.tables.Timeline);
  const slots: Record<string, string> = {
    PAGE_DESCRIPTION: inlineMd(content.description),
    INTRO: renderParagraphs(content.intro),
    COMPARISON: renderComparison(content.tables['Legacy GRC vs. GRC Engineering']),
    PRACTICE: renderPractice(content.practice),
    TIMELINE: timeline.visual,
    TIMELINE_NARRATIVES: timeline.narratives,
    TERMS: renderTwoColumn(content.tables.Terms, true),
    TOOLS: renderTwoColumn(content.tables.Tools),
    TEACHINGS: renderTeachings(content.tables.Teachings),
  };
  content.cards.forEach((card, i) => {
    slots['FP_' + i + '_TERM'] = escapeHtml(card.term);
    slots['FP_' + i + '_BODY'] = card.paragraphs.map(inlineMd).join('<br>');
  });
  for (const [name, section] of Object.entries({ COMPARISON: 'Legacy GRC vs. GRC Engineering', TIMELINE: 'Timeline', TERMS: 'Terms', TOOLS: 'Tools', TEACHINGS: 'Teachings' })) {
    slots[name + '_INTRO'] = renderParagraphs(content.intros[section]);
  }
  for (const [name, html] of Object.entries(slots)) {
    const marker = '{{' + name + '}}';
    if (template.split(marker).length !== 2) throw new Error('Template requires exactly one ' + marker);
    template = template.replace(marker, () => html);
  }
  if (/\{\{[A-Z0-9_]+\}\}/.test(template)) throw new Error('Unresolved template placeholder');
  return template;
}
