import { renderDocument } from './render-content';
import { structuredData } from './metadata';

const root = new URL('../', import.meta.url);
let template = await Bun.file(new URL('src/index.template.html', root)).text();
const markdown = await Bun.file(new URL('README.md', root)).text();
if (template.split('{{STRUCTURED_DATA}}').length !== 2) throw new Error('Template requires exactly one {{STRUCTURED_DATA}}');
template = template.replace('{{STRUCTURED_DATA}}', () => structuredData(markdown));
const templateRobots = '<meta name="robots" content="noindex, follow">';
if (template.split(templateRobots).length !== 2) throw new Error('Source template must remain noindex');
template = template.replace(templateRobots, '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">');
const output = renderDocument(template, markdown);
const target = Bun.file(new URL('index.html', root));
if (process.argv.includes('--check')) {
  if (await target.text() !== output) {
    console.error('index.html is stale. Run bun run build and commit the generated output.');
    process.exit(1);
  }
  console.log('Generated index.html matches README.md and its template.');
} else {
  await Bun.write(target, output);
  console.log('Built index.html from README.md and src/index.template.html.');
}
