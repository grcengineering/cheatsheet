const ORIGIN = "https://cheatsheet.grc.engineering/";

const clientRules: [RegExp, string][] = [
  [/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|WebTransport|RTCPeerConnection)\b/, "network API"],
  [/\b(?:localStorage|sessionStorage|indexedDB|cookieStore)\b|\b(?:document|navigator)\s*(?:\.\s*cookie\b|\[\s*['"]cookie['"]\s*\])/, "visitor storage API"],
  [/\b(?:serviceWorker|SharedWorker|Worker|importScripts)\b|\bimport\s*(?:\(|["'{*])/, "unreviewed worker or script import"],
  [/\b(?:eval|Function)\s*\(/, "dynamic code execution"],
  [/\bnavigator\s*(?:\.\s*(?:userAgent(?:Data)?|platform|languages?|hardwareConcurrency|deviceMemory|maxTouchPoints|plugins|mimeTypes|geolocation|mediaDevices|connection)\b|\[\s*['"](?:userAgent|platform|languages|hardwareConcurrency|deviceMemory)['"]\s*\])|\bscreen\s*\.\s*(?:width|height|availWidth|availHeight|colorDepth|pixelDepth)\b|\b(?:toDataURL|getImageData|readPixels|AudioContext|OfflineAudioContext)\b/, "fingerprinting or visitor-characteristic API"],
  [/\bcreateElement\s*\(\s*['"](?:script|link|img|iframe|object|embed|form|source|video|audio)['"]|\bnew\s+Image\s*\(/i, "dynamic automatic-resource creation"],
];

/**
 * Static regression gate for this single-file site's inline client code.
 * This checks shipped HTML, not runtime behavior or hosting-provider logs.
 * Local external scripts/styles require review rather than silently escaping inspection.
 */
export async function validatePrivacy(html: string): Promise<string[]> {
  const errors = new Set<string>();
  const scripts: string[] = [], styles: string[] = [];
  const policies: string[] = [], referrers: string[] = [];
  const add = (message: string) => errors.add(message);
  const checkScript = (script: string) => {
    for (const [pattern, reason] of clientRules) {
      if (pattern.test(script)) add(`Client code contains a prohibited ${reason}`);
    }
  };
  const resource = (value: string, source: string) => {
    // Raster data URLs contain no requests and cannot embed executable SVG content.
    if (/^data:image\/(?:png|gif|jpe?g|webp|avif);base64,/i.test(value)) return;
    try {
      const url = new URL(value, ORIGIN);
      if (url.origin !== new URL(ORIGIN).origin || !["https:"].includes(url.protocol)) {
        add(`Automatic resource must use this site's HTTPS origin: ${source}`);
      }
    } catch { add(`Invalid automatic-resource URL: ${source}`); }
  };
  const checkCss = (css: string) => {
    if (/@import\b|(?:-webkit-)?image-set\s*\(/i.test(css)) add("CSS imports and image-set require privacy review");
    for (const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi)) {
      resource(match[1] ?? match[2] ?? match[3], "CSS url()");
    }
    if (/\\(?:[\da-f]{1,6}\s?|[^\r\n])/i.test(css)) add("CSS escapes require privacy review of resource URLs");
  };
  const rewriter = new HTMLRewriter()
    .on("*", { element(el) {
      const tag = el.tagName.toLowerCase();
      for (const [name, value] of el.attributes) {
        if (/^on/i.test(name)) checkScript(value);
        if (name === "style") checkCss(value);
        if (["src", "poster", "background"].includes(name) || name === "xlink:href" || (name === "href" && ["image", "use", "feimage"].includes(tag))) resource(value, `${tag}[${name}]`);
        if (name === "srcset" || name === "imagesrcset") {
          for (const candidate of value.split(",")) resource(candidate.trim().split(/\s+/)[0], `${tag}[${name}]`);
        }
        if (name === "ping") add("Link auditing ping is prohibited");
        if (name === "href" && /^\s*javascript:/i.test(value)) add("JavaScript navigation URLs require privacy review");
      }
      if (["form", "iframe", "frame", "object", "embed", "base"].includes(tag)) add(`Collection, embedded content, or base URL changes are prohibited: ${tag}`);
      if (["a", "area"].includes(tag)) {
        const href = el.getAttribute("href") ?? "";
        try {
          const url = new URL(href, ORIGIN);
          if (["http:", "https:"].includes(url.protocol) && url.origin !== new URL(ORIGIN).origin && !el.getAttribute("rel")?.toLowerCase().split(/\s+/).includes("noreferrer")) {
            add("External navigation must include rel=noreferrer");
          }
        } catch { add("Invalid navigation URL"); }
      }
      if (tag === "link") {
        const rel = (el.getAttribute("rel") ?? "").toLowerCase().split(/\s+/);
        if (rel.some(value => ["stylesheet", "modulepreload"].includes(value))) add("External script or stylesheet files require privacy review");
        if (rel.some(value => ["stylesheet", "icon", "preload", "modulepreload", "prefetch", "prerender", "preconnect", "dns-prefetch", "manifest"].includes(value))) resource(el.getAttribute("href") ?? "", "link[href]");
      }
      if (tag === "meta") {
        const httpEquiv = (el.getAttribute("http-equiv") ?? "").toLowerCase();
        if (httpEquiv === "content-security-policy") policies.push(el.getAttribute("content") ?? "");
        if (httpEquiv === "refresh") add("Automatic navigation via meta refresh is prohibited");
        if (el.getAttribute("name")?.toLowerCase() === "referrer") referrers.push((el.getAttribute("content") ?? "").toLowerCase());
      }
    } })
    .on("script", {
      element(el) {
        const type = (el.getAttribute("type") ?? "").trim().toLowerCase();
        if (el.hasAttribute("src")) add("External script or stylesheet files require privacy review");
        const executable = ["", "module", "text/javascript", "application/javascript"].includes(type);
        if (!executable && !["application/ld+json", "application/json"].includes(type)) add("Unknown script type requires privacy review");
        scripts.push("");
        if (!executable) el.onEndTag(() => { scripts[scripts.length - 1] = ""; });
      },
      text(chunk) { scripts[scripts.length - 1] += chunk.text; },
    })
    .on("style", {
      element() { styles.push(""); },
      text(chunk) { styles[styles.length - 1] += chunk.text; },
    });
  await rewriter.transform(new Response(html)).text();
  for (const script of scripts) checkScript(script);
  for (const style of styles) checkCss(style);

  if (policies.length !== 1) add("Expected one Content-Security-Policy meta tag");
  const directives = new Map<string, string>();
  for (const segment of (policies[0] ?? "").toLowerCase().split(";")) {
    const [name, ...values] = segment.trim().split(/\s+/);
    if (name) {
      if (directives.has(name)) add(`Duplicate CSP directive: ${name}`);
      directives.set(name, values.join(" "));
    }
  }
  for (const name of ["connect-src", "object-src", "form-action", "base-uri", "frame-src"]) {
    if (directives.get(name) !== "'none'") add(`CSP ${name} must be 'none'`);
  }
  if (directives.get("default-src") !== "'self'") add("CSP default-src must be 'self'");
  const allowed: Record<string, string[]> = {
    "script-src": ["'self'", "'unsafe-inline'"], "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:"], "font-src": ["'self'"],
  };
  for (const [name, sources] of Object.entries(allowed)) {
    if ((directives.get(name) ?? "'self'").split(/\s+/).some(value => !sources.includes(value))) add(`CSP ${name} allows unreviewed sources`);
  }
  const reviewed = new Set(["default-src", "connect-src", "object-src", "form-action", "base-uri", "frame-src", ...Object.keys(allowed)]);
  for (const name of directives.keys()) {
    // Overrides such as script-src-elem or style-src-attr must not bypass the inspected policy.
    if (!reviewed.has(name)) add(`CSP directive requires privacy review: ${name}`);
  }
  if (directives.has("report-uri") || directives.has("report-to")) add("CSP reporting would transmit visitor data");
  if (referrers.length !== 1 || referrers[0] !== "no-referrer") add("Expected one referrer meta tag with no-referrer");
  return [...errors];
}
