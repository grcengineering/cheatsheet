export const CANONICAL = "https://cheatsheet.grc.engineering/";

type Json = Record<string, any>;
type Reference = { value: string; source: string };
export type SiteFiles = {
  html: string;
  robots: string;
  sitemap: string;
  cname: string;
  nojekyll: boolean;
  assetExists: (path: string) => boolean | Promise<boolean>;
};

// Normalize text for content comparisons, without depending on markup or typography.
function textContent(value: string): string {
  const named: Record<string, string> = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
    ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
  };
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, name: string) => {
    if (name.startsWith("#")) {
      const code = name[1].toLowerCase() === "x"
        ? Number.parseInt(name.slice(2), 16) : Number.parseInt(name.slice(1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
    }
    return named[name.toLowerCase()] ?? entity;
  }).replace(/\s+/g, " ").trim();
}

function allObjects(value: unknown): Json[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(allObjects);
  return [value as Json, ...Object.values(value).flatMap(allObjects)];
}

function hasType(value: Json, type: string): boolean {
  return [value["@type"]].flat().includes(type);
}

/** Validate shipped files, not browser-mutated DOM. No external requests are made. */
export async function validateSite(files: SiteFiles): Promise<string[]> {
  const errors: string[] = [];
  const require = (condition: unknown, message: string) => { if (!condition) errors.push(message); };
  const meta = new Map<string, string[]>();
  const canonicals: string[] = [];
  const references: Reference[] = [];
  const ids = new Map<string, string>();
  const activeIds: string[] = [];
  const jsonBlocks: string[] = [];
  const sections = ["page-desc", "comparison", "practice", "timeline", "terms", "tools", "teachings"];
  const sectionText = new Map<string, string>();
  const rowCount = new Map<string, number>();
  let title = "", titleCount = 0, h1 = "", h1Count = 0, mainCount = 0, language = "", css = "";
  const rewriter = new HTMLRewriter()
    .on("html", { element(el) { language = el.getAttribute("lang") ?? ""; } })
    .on("title", { element() { titleCount++; }, text(chunk) { title += chunk.text; } })
    .on("h1", { element() { h1Count++; }, text(chunk) { h1 += chunk.text; } })
    .on("main", { element() { mainCount++; } })
    .on("meta", { element(el) {
      const key = (el.getAttribute("name") ?? el.getAttribute("property") ?? "").toLowerCase();
      if (key) meta.set(key, [...(meta.get(key) ?? []), textContent(el.getAttribute("content") ?? "")]);
    } })
    .on("link[rel]", { element(el) {
      if (el.getAttribute("rel")?.split(/\s+/).includes("canonical")) canonicals.push(el.getAttribute("href") ?? "");
    } })
    .on("[id]", {
      element(el) {
        const id = el.getAttribute("id")!;
        require(!ids.has(id), `Duplicate HTML id: ${id}`);
        ids.set(id, "");
        if (el.canHaveContent) {
          activeIds.push(id);
          el.onEndTag(() => { activeIds.pop(); });
        }
      },
      text(chunk) { for (const id of activeIds) ids.set(id, ids.get(id)! + chunk.text); },
    })
    .on("[href], [src]", { element(el) {
      for (const attr of ["href", "src"]) {
        const value = el.getAttribute(attr);
        if (value !== null) references.push({ value: textContent(value), source: `${el.tagName}[${attr}]` });
      }
    } })
    .on("style", { text(chunk) { css += chunk.text; } })
    .on('script[type="application/ld+json"]', {
      element() { jsonBlocks.push(""); },
      text(chunk) { jsonBlocks[jsonBlocks.length - 1] += chunk.text; },
    })
    .on('main[data-nosnippet], main [data-nosnippet], main[hidden], main [data-awesome][hidden], main [data-awesome][aria-hidden="true"]', {
      element() { errors.push("Core content must remain visible and available for search snippets"); },
    });
  for (const section of sections) {
    sectionText.set(section, "");
    rewriter.on(`[data-awesome="${section}"]`, { text(chunk) {
      sectionText.set(section, sectionText.get(section)! + chunk.text);
    } });
  }
  for (const section of ["comparison", "terms", "tools", "teachings"]) {
    rowCount.set(section, 0);
    rewriter.on(`[data-awesome="${section}"] tr`, { element() {
      rowCount.set(section, rowCount.get(section)! + 1);
    } });
  }
  const definitions: string[] = [];
  rewriter.on("[data-fp-card] p", {
    element() { definitions.push(""); },
    text(chunk) { definitions[definitions.length - 1] += chunk.text; },
  });
  let practiceIntro = "";
  const practiceTopics: { heading: string; paragraphs: string[] }[] = [];
  rewriter.on('[data-awesome="practice"] .practice-intro', { text(chunk) { practiceIntro += chunk.text; } });
  rewriter.on('[data-awesome="practice"] .practice-topic', {
    element() { practiceTopics.push({ heading: "", paragraphs: [] }); },
  });
  rewriter.on('[data-awesome="practice"] .practice-topic h3', {
    text(chunk) { practiceTopics[practiceTopics.length - 1].heading += chunk.text; },
  });
  rewriter.on('[data-awesome="practice"] .practice-topic p', {
    element() { practiceTopics[practiceTopics.length - 1].paragraphs.push(""); },
    text(chunk) {
      const topic = practiceTopics[practiceTopics.length - 1];
      topic.paragraphs[topic.paragraphs.length - 1] += chunk.text;
    },
  });
  await rewriter.transform(new Response(files.html)).text();

  const oneMeta = (key: string) => {
    const values = meta.get(key) ?? [];
    require(values.length === 1 && !!values[0], `Expected one populated ${key} meta tag`);
    return values[0] ?? "";
  };
  require(language === "en", "Document language must be en");
  require(titleCount === 1 && /GRC Engineering/i.test(textContent(title)), "Expected one descriptive GRC Engineering title");
  require(h1Count === 1 && /GRC Engineering/i.test(textContent(h1)), "Expected one visible GRC Engineering h1");
  require(mainCount === 1, "Expected one main landmark");
  require(canonicals.length === 1 && canonicals[0] === CANONICAL, "Canonical must be the single preferred HTTPS homepage");
  const description = oneMeta("description");
  require(oneMeta("og:title") === textContent(title), "Open Graph title must match title");
  require(oneMeta("og:description") === description, "Open Graph description must match description");
  require(oneMeta("og:url") === CANONICAL, "Open Graph URL must match canonical");
  require(oneMeta("og:type") === "website", "Open Graph type must be website");
  oneMeta("og:site_name");
  const image = oneMeta("og:image");
  require(image.startsWith(CANONICAL) && /\.(png|jpe?g|webp|gif)$/i.test(image), "Open Graph image must be a local absolute HTTPS raster image");
  oneMeta("og:image:alt");
  require(oneMeta("twitter:card") === "summary_large_image", "Expected a large-image Twitter card");
  require(oneMeta("twitter:title") === textContent(title), "Twitter title must match title");
  require(oneMeta("twitter:description") === description, "Twitter description must match description");
  require(oneMeta("twitter:image") === image, "Twitter and Open Graph images must match");
  oneMeta("twitter:image:alt");
  references.push({ value: image, source: "og:image" });
  for (const key of ["robots", "googlebot", "bingbot"]) {
    for (const value of meta.get(key) ?? []) {
      require(!/(?:^|[,\s])(?:noindex|nofollow|none|nosnippet)(?:$|[,\s])|max-snippet\s*:\s*0(?:$|[,\s])|max-image-preview\s*:\s*none/i.test(value), `${key} restricts indexing or snippet eligibility`);
    }
  }
  for (const section of sections) require(textContent(sectionText.get(section)!).length > 0, `Essential ${section} content is empty in source HTML`);
  for (const [section, count] of rowCount) require(count > 0, `Essential ${section} table has no source HTML rows`);
  require(definitions.length === 3 && definitions.every(value => textContent(value)), "All three first-principles definitions must be present in source HTML");
  require(!!textContent(practiceIntro) && practiceTopics.length > 0 && practiceTopics.every(topic =>
    textContent(topic.heading) && topic.paragraphs.length > 0 && topic.paragraphs.every(paragraph => textContent(paragraph))),
  "Practice guidance requires a visible introduction and nonempty titled subsections in source HTML");

  const objects: Json[] = [];
  require(jsonBlocks.length > 0, "Missing JSON-LD structured data");
  for (const block of jsonBlocks) {
    try { objects.push(...allObjects(JSON.parse(block))); }
    catch { errors.push("JSON-LD is not valid JSON"); }
  }
  for (const object of objects) {
    if (typeof object.url === "string") references.push({ value: object.url, source: "structured-data url" });
  }
  const singleType = (type: string) => {
    const matches = objects.filter(object => hasType(object, type));
    require(matches.length === 1, `Expected exactly one ${type} structured-data entity`);
    return matches[0] ?? {};
  };
  const organization = singleType("Organization"), website = singleType("WebSite"), webpage = singleType("WebPage"), terms = singleType("DefinedTermSet");
  require(organization["@id"] === "https://grc.engineering/#organization" && /^https:\/\/grc\.engineering\/?$/.test(organization.url) && organization.name === "GRC Engineering", "Organization identity must match the public GRC Engineering publisher");
  require(website.url === CANONICAL && website["@id"] === `${CANONICAL}#website`, "WebSite identity must match canonical");
  require(webpage.url === CANONICAL && webpage["@id"] === `${CANONICAL}#webpage`, "WebPage identity must match canonical");
  require(webpage.name === textContent(title) && webpage.description === description, "WebPage name and description must match visible page metadata");
  require(webpage.isPartOf?.["@id"] === website["@id"], "WebPage must reference its WebSite");
  const practicePart = Array.isArray(webpage.hasPart) ? webpage.hasPart.find((part: Json) => part["@id"] === `${CANONICAL}#practice`) : undefined;
  require(practicePart && hasType(practicePart, "WebPageElement") && practicePart.url === `${CANONICAL}#practice`
    && practicePart.name === "GRC Engineering in practice" && ids.has("practice"), "WebPage must identify the visible practice section");
  require(webpage.publisher?.["@id"] === organization["@id"] || website.publisher?.["@id"] === organization["@id"], "Site or page must identify the GRC Engineering publisher");
  require(terms["@id"] === `${CANONICAL}#terms`, "DefinedTermSet identity must match this reference");
  const definedTerms: Json[] = Array.isArray(terms.hasDefinedTerm) ? terms.hasDefinedTerm : [];
  require(definedTerms.length > 0 && definedTerms.length === rowCount.get("terms"), "Structured terms must cover every visible terms-table row");
  const termUrls = new Set<string>();
  for (const term of definedTerms) {
    const termUrl = term.url ?? term["@id"] ?? "";
    const anchor = typeof termUrl === "string" && termUrl.startsWith(`${CANONICAL}#`) ? termUrl.slice(CANONICAL.length + 1) : "";
    const visible = textContent(ids.get(anchor) ?? "");
    require(hasType(term, "DefinedTerm") && !!anchor && ids.has(anchor), `Structured term has no visible local anchor: ${term.name ?? "unnamed"}`);
    require(typeof term.name === "string" && !!textContent(term.name) && visible.includes(textContent(term.name)), `Structured term name differs from visible content: ${term.name ?? "unnamed"}`);
    require(typeof term.description === "string" && !!textContent(term.description) && visible.includes(textContent(term.description)), `Structured term description differs from visible content: ${term.name ?? "unnamed"}`);
    require(!termUrls.has(termUrl), `Duplicate structured term URL: ${termUrl}`);
    termUrls.add(termUrl);
  }

  for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) references.push({ value: match[1], source: "CSS url()" });
  for (const reference of references) {
    if (!reference.value || reference.value === "#") continue; // Inert modal placeholder, populated on interaction.
    let url: URL;
    try { url = new URL(reference.value, CANONICAL); }
    catch { errors.push(`Invalid URL in ${reference.source}: ${reference.value}`); continue; }
    require(["https:", "http:", "mailto:", "tel:", "data:"].includes(url.protocol), `Unsupported URL scheme in ${reference.source}: ${reference.value}`);
    if (url.hostname !== new URL(CANONICAL).hostname) continue;
    require(url.origin === new URL(CANONICAL).origin, `Local reference must use the canonical HTTPS origin: ${reference.value}`);
    if (url.pathname === "/" || url.pathname === "/index.html") {
      if (url.hash) {
        let anchor = "";
        try { anchor = decodeURIComponent(url.hash.slice(1)); } catch { /* The missing-anchor error below includes the original URL. */ }
        require(ids.has(anchor), `Broken local anchor: ${reference.value}`);
      }
    } else {
      let path = "";
      try { path = decodeURIComponent(url.pathname).replace(/^\/+/, ""); } catch { /* Existence check reports invalid paths. */ }
      require(!!path && !path.split("/").includes("..") && await files.assetExists(path), `Missing local file in ${reference.source}: ${reference.value}`);
    }
  }

  const robotLines = files.robots.split(/\r?\n/).map(line => line.split("#")[0].trim()).filter(Boolean);
  require(robotLines.some(line => /^User-agent:\s*\*$/i.test(line)), "robots.txt must cover all crawlers");
  require(!robotLines.some(line => /^Disallow:\s*\S/i.test(line)), "robots.txt must not disallow public content");
  require(robotLines.some(line => line.toLowerCase() === `sitemap: ${CANONICAL}sitemap.xml`), "robots.txt must declare the canonical sitemap");
  const locations = [...files.sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(match => match[1].trim());
  require(/<urlset\s[^>]*xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(files.sitemap) && [...files.sitemap.matchAll(/<url>/g)].length === 1 && locations.length === 1 && locations[0] === CANONICAL, "sitemap.xml must contain the single preferred canonical page URL");
  require(!/<(?:lastmod|changefreq|priority)>/.test(files.sitemap), "Keep the single-page sitemap free of invented freshness or ranking hints");
  require(files.cname.trim() === new URL(CANONICAL).hostname, "CNAME must match canonical hostname");
  require(files.nojekyll, "Missing .nojekyll for root-level static publishing");
  return errors;
}

