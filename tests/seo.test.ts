import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import { CANONICAL, validateSite, type SiteFiles } from "../scripts/check-seo";

const root = resolve(import.meta.dir, "..");
async function publishedFiles(): Promise<SiteFiles> {
  return {
    html: await Bun.file(resolve(root, "index.html")).text(),
    robots: await Bun.file(resolve(root, "robots.txt")).text(),
    sitemap: await Bun.file(resolve(root, "sitemap.xml")).text(),
    cname: await Bun.file(resolve(root, "CNAME")).text(),
    nojekyll: await Bun.file(resolve(root, ".nojekyll")).exists(),
    assetExists: path => Bun.file(resolve(root, path)).exists(),
  };
}

function rewrite(html: string, selector: string, mutate: (el: HTMLRewriterTypes.Element) => void): string {
  return new HTMLRewriter().on(selector, { element: mutate }).transform(html);
}

describe("published search eligibility regressions", () => {
  test("the actual shipped files pass the search checks", async () => {
    expect(await validateSite(await publishedFiles())).toEqual([]);
  });

  test("empty content cannot pass because JavaScript might populate it later", async () => {
    const files = await publishedFiles();
    files.html = rewrite(files.html, '[data-awesome="comparison"], [data-awesome="terms"], [data-fp-card] p', el => el.setInnerContent(""));
    const errors = await validateSite(files);
    expect(errors).toContain("Essential comparison table has no source HTML rows");
    expect(errors).toContain("Essential terms table has no source HTML rows");
    expect(errors).toContain("All three first-principles definitions must be present in source HTML");
  });

  test("practice headings alone cannot stand in for useful source HTML guidance", async () => {
    const files = await publishedFiles();
    files.html = rewrite(files.html, '[data-awesome="practice"] p', el => el.setInnerContent(""));
    expect(await validateSite(files)).toContain("Practice guidance requires a visible introduction and nonempty titled subsections in source HTML");
    files.html = rewrite(files.html, '[data-awesome="practice"]', el => el.setInnerContent(""));
    expect(await validateSite(files)).toContain("Essential practice content is empty in source HTML");
  });

  test("structured page parts must identify the visible practice section", async () => {
    const files = await publishedFiles();
    files.html = files.html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/, (_, open, source, close) => {
      const graph = JSON.parse(source);
      const page = graph["@graph"].find((entity: Record<string, unknown>) => entity["@type"] === "WebPage");
      page.hasPart = page.hasPart.filter((part: Record<string, unknown>) => part["@id"] !== `${CANONICAL}#practice`);
      return open + JSON.stringify(graph) + close;
    });
    expect(await validateSite(files)).toContain("WebPage must identify the visible practice section");
  });

  test("an accidental index or snippet opt-out is rejected", async () => {
    const files = await publishedFiles();
    files.html = rewrite(files.html, "head", el => el.append('<meta name="googlebot" content="noindex, nosnippet">', { html: true }));
    files.robots = "User-agent: *\nDisallow: /\n";
    const errors = await validateSite(files);
    expect(errors).toContain("googlebot restricts indexing or snippet eligibility");
    expect(errors).toContain("robots.txt must not disallow public content");
    expect(errors).toContain("robots.txt must declare the canonical sitemap");
  });

  test("copied metadata cannot send canonical signals to a different site", async () => {
    const files = await publishedFiles();
    files.html = rewrite(files.html, 'link[rel="canonical"]', el => el.setAttribute("href", "https://example.com/"));
    files.html = rewrite(files.html, 'meta[property="og:url"]', el => el.setAttribute("content", "https://example.com/"));
    files.sitemap = files.sitemap.replace(CANONICAL, `${CANONICAL}#terms`);
    files.cname = "example.com\n";
    const errors = await validateSite(files);
    expect(errors).toContain("Canonical must be the single preferred HTTPS homepage");
    expect(errors).toContain("Open Graph URL must match canonical");
    expect(errors).toContain("sitemap.xml must contain the single preferred canonical page URL");
    expect(errors).toContain("CNAME must match canonical hostname");
  });

  test("a broken term deep link or missing locally hosted asset is rejected", async () => {
    const files = await publishedFiles();
    files.html = rewrite(files.html, "main", el => el.append('<a href="#nonexistent-definition">Definition</a><img src="missing-card.png" alt="Reference">', { html: true }));
    const errors = await validateSite(files);
    expect(errors).toContain("Broken local anchor: #nonexistent-definition");
    expect(errors).toContain("Missing local file in img[src]: missing-card.png");
  });

  test("structured definitions cannot contradict the visible source", async () => {
    const files = await publishedFiles();
    files.html = files.html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/, (_, open, source, close) => {
      const graph = JSON.parse(source);
      const set = graph["@graph"].find((entity: Record<string, unknown>) => entity["@type"] === "DefinedTermSet");
      set.hasDefinedTerm[0].description = "This claim does not appear in the source material.";
      return open + JSON.stringify(graph) + close;
    });
    expect((await validateSite(files)).some(error => error.startsWith("Structured term description differs from visible content:"))).toBe(true);
  });

  test("malformed structured data fails explicitly", async () => {
    const files = await publishedFiles();
    files.html = rewrite(files.html, 'script[type="application/ld+json"]', el => el.setInnerContent("{broken JSON"));
    expect(await validateSite(files)).toContain("JSON-LD is not valid JSON");
  });
});
