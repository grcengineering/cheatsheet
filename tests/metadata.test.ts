import { expect, test } from 'bun:test';
import { canonical, description, structuredData, title } from '../scripts/metadata';
import { parseMarkdown, plainText, slugify } from '../scripts/render-content';

const readme = await Bun.file(new URL('../README.md', import.meta.url)).text();

test('structured metadata identifies the published source and describes every visible definition', () => {
  const content = parseMarkdown(readme);
  const { '@graph': graph } = JSON.parse(structuredData(readme));
  const page = graph.find((node: any) => node['@type'] === 'WebPage');
  expect(page.url).toBe(canonical);
  expect(page.name).toBe(title);
  expect(page.description).toBe(description);
  expect(page.about.description).toBe(plainText(content.cards[2].paragraphs[0]));
  const terms = graph.find((node: any) => node['@type'] === 'DefinedTermSet');
  expect(terms.hasDefinedTerm).toHaveLength(content.tables.Terms.rows.length);
  for (const [term, meaning] of content.tables.Terms.rows) {
    expect(terms.hasDefinedTerm).toContainEqual({
      '@type': 'DefinedTerm', '@id': canonical + '#term-' + slugify(term),
      name: plainText(term), description: plainText(meaning),
      url: canonical + '#term-' + slugify(term), inDefinedTermSet: { '@id': canonical + '#terms' },
    });
  }
  const serialized = JSON.stringify(graph);
  for (const unsupported of ['aggregateRating', 'dateModified', 'datePublished', 'reviewedBy', 'FAQPage']) {
    expect(serialized).not.toContain(unsupported);
  }
});

test('editorial text cannot terminate the JSON-LD script element', () => {
  const revised = readme.replace('Exercising controls to confirm', 'An unexpected </script> boundary. Exercising controls to confirm');
  const output = structuredData(revised);
  expect(output).not.toContain('</script>');
  expect(JSON.parse(output)['@graph'].find((node: any) => node['@type'] === 'DefinedTermSet').hasDefinedTerm[0].description).toContain('An unexpected </script> boundary.');
});
