import { parseMarkdown, plainText, slugify } from './render-content';

export const canonical = 'https://cheatsheet.grc.engineering/';
export const title = 'GRC Engineering Cheat Sheet: Principles, Tools & Terms';
export const description = 'Explore GRC Engineering: first principles, a comparison with legacy GRC, key terms, tools, learning resources, and a history of governance, risk, and compliance.';

/** Describe the published reference using the same editorial source as its HTML. */
export function structuredData(readme: string): string {
  const content = parseMarkdown(readme);
  const publisher = { '@id': 'https://grc.engineering/#organization' };
  const website = { '@id': canonical + '#website' };
  const page = { '@id': canonical + '#webpage' };
  const termSet = { '@id': canonical + '#terms' };
  const definition = content.cards.find(card => card.term === 'GRC Engineering')!;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization', ...publisher,
        name: 'GRC Engineering', url: 'https://grc.engineering/',
        sameAs: ['https://github.com/grcengineering'],
      },
      {
        '@type': 'WebSite', ...website, url: canonical,
        name: 'The GRC Engineering Cheat Sheet', inLanguage: 'en', publisher,
      },
      {
        '@type': 'WebPage', ...page, url: canonical, name: title, description,
        inLanguage: 'en', isPartOf: website, publisher,
        about: {
          '@type': 'DefinedTerm', name: definition.term,
          description: plainText(definition.paragraphs[0]),
          url: canonical + '#first-principles',
        },
        mainEntity: termSet,
        hasPart: ['first-principles', 'comparison', 'practice', 'timeline', 'terms', 'tools', 'teachings'].map(id => ({
          '@type': 'WebPageElement', '@id': canonical + '#' + id, url: canonical + '#' + id,
          name: ({ 'first-principles': 'First Principles', comparison: 'Legacy GRC vs. GRC Engineering', practice: 'GRC Engineering in practice', timeline: 'Timeline', terms: 'Terms', tools: 'Tools', teachings: 'Teachings' } as Record<string, string>)[id],
        })),
      },
      {
        '@type': 'DefinedTermSet', ...termSet, url: canonical + '#terms',
        name: 'GRC Engineering Terms', inLanguage: 'en', isPartOf: page,
        hasDefinedTerm: content.tables.Terms.rows.map(([term, meaning]) => ({
          '@type': 'DefinedTerm', '@id': canonical + '#term-' + slugify(term),
          name: plainText(term), description: plainText(meaning),
          url: canonical + '#term-' + slugify(term), inDefinedTermSet: termSet,
        })),
      },
    ],
  };
  // JSON in an HTML script element must never be able to terminate that element.
  return JSON.stringify(graph, null, 2).replace(/</g, '\\u003c');
}
