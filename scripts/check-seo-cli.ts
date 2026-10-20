import { resolve } from "node:path";
import { validateSite } from "./check-seo";

const root = resolve(import.meta.dir, "..");
const [html, robots, sitemap, cname, nojekyll] = await Promise.all([
  Bun.file(resolve(root, "index.html")).text(), Bun.file(resolve(root, "robots.txt")).text(),
  Bun.file(resolve(root, "sitemap.xml")).text(), Bun.file(resolve(root, "CNAME")).text(),
  Bun.file(resolve(root, ".nojekyll")).exists(),
]);
const errors = await validateSite({ html, robots, sitemap, cname, nojekyll, assetExists: path => Bun.file(resolve(root, path)).exists() });
if (errors.length) {
  console.error(errors.map(error => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else console.log("SEO checks passed: static content, metadata, structured data, local links/assets and crawler discovery.");
