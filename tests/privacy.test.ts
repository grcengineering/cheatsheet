import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import { validatePrivacy } from "../scripts/check-privacy";

const policy = "default-src 'self'; connect-src 'none'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'";
const page = (body = "", csp = policy) => `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="${csp}"><meta name="referrer" content="no-referrer"></head><body>${body}</body></html>`;
const rejects = async (body: string, message: string) => expect((await validatePrivacy(page(body))).some(error => error.includes(message))).toBe(true);

describe("privacy regression gate", () => {
  test("the shipped page has no collection or automatic third-party requests", async () => {
    expect(await validatePrivacy(await Bun.file(resolve(import.meta.dir, "../index.html")).text())).toEqual([]);
  });

  test("citations, metadata URLs and ordinary external navigation do not load resources", async () => {
    expect(await validatePrivacy(page(`<meta property="og:image" content="https://example.org/card.png"><script type="application/ld+json">{"citation":"https://example.org/fetch/localStorage"}</script><script type="application/json">{"api":"sendBeacon"}</script><a href="https://example.org/" rel="noreferrer">Reference</a>`))).toEqual([]);
  });

  test("local assets, in-page controls and local layout measurements remain valid", async () => {
    expect(await validatePrivacy(page(`<link rel="preload" href="fonts/local.woff2" as="font"><img src="/local.png" srcset="small.png 1x, large.png 2x"><svg><use href="#icon"></use></svg><style>@font-face { src: url('fonts/local.woff2'); } .a { background: url(/local.png) } .b { background: url("data:image/png;base64,AAAA") }</style><button onclick="document.body.classList.toggle('dark')">Theme</button><script>window.matchMedia('(prefers-color-scheme: dark)').matches; document.body.getBoundingClientRect();</script>`))).toEqual([]);
  });

  test.each([
    ['<img src="https://tracker.example/pixel.gif" width="1" height="1">', "img[src]"],
    ['<img src="//tracker.example/pixel.gif">', "img[src]"],
    ['<img src="local.png" srcset="local.png 1x, https://tracker.example/pixel.gif 2x">', "img[srcset]"],
    ['<link rel="stylesheet" href="https://tracker.example/style.css">', "link[href]"],
    ['<link rel="preconnect" href="https://tracker.example/">', "link[href]"],
    ['<link rel="prerender" href="https://tracker.example/">', "link[href]"],
    ['<svg><image xlink:href="https://tracker.example/pixel.svg"></image></svg>', "image[xlink:href]"],
    ['<svg><use href="https://tracker.example/icons.svg#icon"></use></svg>', "use[href]"],
    ['<video poster="https://tracker.example/pixel.jpg"></video>', "video[poster]"],
    ['<div style="background: url(https://tracker.example/pixel.gif)"></div>', "CSS url()"],
    ['<style>body { background: url("https://tracker.example/pixel.gif") }</style>', "CSS url()"],
    ["<style>body { background: url('https://tracker.example/pixel.gif') }</style>", "CSS url()"],
    ['<img src="data:image/svg+xml;base64,AAAA">', "img[src]"],
    ['<img src="http://[invalid">', "Invalid automatic-resource URL"],
  ])("rejects automatic resource mutation %s", async (body, message) => rejects(body, message));

  test.each([
    ["fetch('/metrics', {method: 'POST'})", "network API"],
    ["new XMLHttpRequest()", "network API"],
    ["navigator.sendBeacon('/collect', JSON.stringify({event: 'view'}))", "network API"],
    ["new WebSocket('wss://tracker.example')", "network API"],
    ["localStorage.setItem('visitor', crypto.randomUUID())", "visitor storage API"],
    ["document.cookie = 'visitor=123'", "visitor storage API"],
    ["indexedDB.open('visitors')", "visitor storage API"],
    ["const fingerprint = [navigator.userAgent, navigator.hardwareConcurrency]", "fingerprinting"],
    ["const fingerprint = screen.width + ':' + screen.height", "fingerprinting"],
    ["canvas.toDataURL()", "fingerprinting"],
    ["new Worker('/background.js')", "unreviewed worker"],
    ["import('/analytics.js')", "unreviewed worker"],
    ["eval(location.hash.slice(1))", "dynamic code execution"],
    ["document.createElement('script')", "dynamic automatic-resource creation"],
    ["new Image().src = '/metrics.gif'", "dynamic automatic-resource creation"],
  ])("rejects client collection mutation %s", async (code, message) => rejects(`<script>${code}</script>`, message));

  test.each([
    ['<button onclick="navigator.sendBeacon(\'/collect\', \'click\')">Click</button>', "network API"],
    ['<a href="https://example.org/" ping="/collect" rel="noreferrer">Reference</a>', "ping"],
    ['<a href="https://example.org/">Reference</a>', "rel=noreferrer"],
    ['<a href="http://[invalid">Reference</a>', "Invalid navigation URL"],
    ['<a href="javascript:fetch(\'/collect\')">Reference</a>', "JavaScript navigation"],
    ['<form action="/collect"><input name="email"></form>', "prohibited: form"],
    ['<iframe src="/embedded"></iframe>', "prohibited: iframe"],
    ['<object data="https://tracker.example/"></object>', "prohibited: object"],
    ['<embed src="/plugin">', "prohibited: embed"],
    ['<base href="https://tracker.example/">', "prohibited: base"],
    ['<script src="/analytics.js"></script>', "External script or stylesheet"],
    ['<link rel="stylesheet" href="/analytics.css">', "External script or stylesheet"],
    ['<script type="speculationrules">{"prefetch":[]}</script>', "Unknown script type"],
    ['<meta http-equiv="refresh" content="0;url=https://tracker.example/">', "meta refresh"],
    ['<style>@import "/uninspected.css";</style>', "CSS imports"],
    ['<style>body { background: image-set("https://tracker.example/pixel.png" 1x) }</style>', "CSS imports"],
    ['<style>body { background: u\\72l(https://tracker.example/pixel.png) }</style>', "CSS escapes"],
  ])("rejects collection surface mutation %s", async (body, message) => rejects(body, message));

  test("mandatory CSP and referrer protections cannot be removed or weakened", async () => {
    const errors = await validatePrivacy('<html><head></head><body></body></html>');
    for (const name of ["connect-src", "object-src", "form-action", "base-uri", "frame-src"]) expect(errors).toContain(`CSP ${name} must be 'none'`);
    expect(errors).toContain("CSP default-src must be 'self'");
    expect(errors).toContain("Expected one Content-Security-Policy meta tag");
    expect(errors).toContain("Expected one referrer meta tag with no-referrer");
    const unsafe = await validatePrivacy(page("", policy.replace("connect-src 'none'", "connect-src *").replace("script-src 'self'", "script-src https://tracker.example")));
    expect(unsafe).toContain("CSP connect-src must be 'none'");
    expect(unsafe).toContain("CSP script-src allows unreviewed sources");
  });

  test("duplicate policy directives and outbound CSP reporting fail explicitly", async () => {
    const errors = await validatePrivacy(page('<meta name="referrer" content="origin">', `${policy}; connect-src 'self'; report-to collector; report-uri https://tracker.example/report`));
    expect(errors).toContain("Duplicate CSP directive: connect-src");
    expect(errors).toContain("CSP reporting would transmit visitor data");
    expect(errors).toContain("Expected one referrer meta tag with no-referrer");
  });

  test("a CSP subdirective cannot quietly override the reviewed resource policy", async () => {
    expect(await validatePrivacy(page("", `${policy}; script-src-elem *`))).toContain("CSP directive requires privacy review: script-src-elem");
  });
});
