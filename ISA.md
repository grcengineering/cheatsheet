---
task: Optimize the GRC Engineering Cheat Sheet for search and answer engines
slug: cheatsheet-seo-aeo
phase: climbing
progress: 6/10
principal_stated_goal: "https://cheatsheet.grc.engineering is totally and fully SEO and AEO optimized, based on research about the latest and greatest best practices on SEO and AEO optimization from highly credible authoritative sources on those topics, so that any traditional search engine searches or AI-native web searching related to GRC Engineering results in https://cheatsheet.grc.engineering being surfaced at the very top of the results list."
---

## Problem

The delivered HTML contains empty reference tables and definition cards. The substantive README content requires a JavaScript fetch. Canonical metadata, structured data, crawler discovery files, and search measurement evidence are absent.

## Vision

Readers and crawlers receive the complete, useful reference immediately. Search and answer systems can identify the canonical source, understand and cite its definitions, comparisons, timeline, terms, tools, and teaching resources. Search visibility improves on evidence from the engines themselves.

## Principles

Use verified primary-source guidance, preserve README as the canonical editorial source, and distinguish eligibility from observed rankings. Do not promise outcomes controlled by external ranking systems.

## Constraints

Preserve the existing design and interactive features. GitHub Pages publishes main at the repository root. Stage only intended files; preserve pre-existing local changes and artifacts.

Privacy is a hard constraint: no visitor analytics, tracking scripts, pixels, fingerprinting, identifiers, forms or personal-data collection. The principal explicitly accepts the current hosting providers. Search verification and discovery must work without visitor instrumentation. Do not add a privacy-policy page.

## Goal

The principal_stated_goal above remains the full objective. Technical implementation alone cannot prove universal first-place rankings.

## Claims

- [x] C1: Current official search and AI crawler guidance supports the implemented choices; falsifier: unsupported or contradicted recommendation in docs/SEARCH.md. Evidence: docs/SEARCH.md primary-source mapping and independent source review.
- [x] C2: Delivered HTML contains every canonical reference row, definition, and timeline narrative without JavaScript; falsifier: build parity or raw-response audit finds missing content. Evidence: static publication parity tests; 414px script-disabled browser frame confirms all reference rows.
- [x] C3: Canonical URL, useful metadata, truthful structured data, robots.txt and sitemap are correct and mutually consistent; falsifier: SEO validation fails. Evidence: check:seo and metadata regression tests.
- [x] C4: README changes reliably regenerate the published content with a deterministic drift check; falsifier: modified README can pass CI with stale generated HTML. Evidence: build:check; raw-README prose mutation regression rejects unrendered content.
- [x] C5: Desktop and mobile browser checks preserve navigation, themes, tables, term deep links and timeline access; falsifier: Interceptor evidence shows missing content or broken interactions. Evidence: Interceptor desktop light/dark, 414px script-disabled render, term-risk positioning, modal Shift-Tab/Escape focus restoration.
- [ ] C6: The intended revision is committed, CI is green, and the live site serves the same content and discovery signals over HTTPS; falsifier: revision, CI or live-response mismatch.
- [ ] C7: Search Console and Bing indexing/measurement are inspected and the relevant canonical URL is submitted where authorized access permits; falsifier: no authoritative indexing or submission evidence.
- [ ] C8: The requested broad first-place search and AI-search visibility is observed and maintained across relevant queries; falsifier: actual search results contradict it or measurement is missing.
- [x] C9: The application makes no tracking/analytics requests and collects no visitor personal data; falsifier: privacy gate or real-browser network/storage audit finds visitor instrumentation, third-party automatic resources, or collection code. Evidence: 52 privacy mutation tests, static source audit, Interceptor application network log empty; all automatic resources local and connect-src none. Production parity remains C6.
- [ ] C10: Official mobile and desktop laboratory audits are inspected and actionable accessibility findings are resolved; falsifier: current audit still reports the confirmed link-distinction defects. Field Core Web Vitals must remain explicitly unknown when reports have no data.

## Anti-claims

- No hidden keyword stuffing, fabricated authorship/review dates, false rich-result claims, or bot-specific content. Evidence: source review and output checks.
- No regression of existing editorial content or existing term URLs. Evidence: README-to-HTML parity and anchor checks.

## Test Strategy

| isc | type | check | threshold | tool | anchors_to |
|---|---|---|---|---|---|
| C1 | manual | Verify official sources and implementation mapping | Every recommendation supported | Web sources and docs/SEARCH.md | literal |
| C2 | bun-test | README content parity and build output | No missing rows or definitions | bun test | literal |
| C3 | bash | SEO files and structured data | Zero validation failures | bun run check | literal |
| C4 | bash | Deterministic generated-output check | Stale output rejected | bun run build:check | derived: maintainability |
| C5 | screenshot | Desktop/mobile interactions | No identified regression | Interceptor | derived: usability |
| C6 | curl | Production parity | Current output, canonical and HTTPS | GitHub Actions and live probes | literal |
| C7 | manual | Engine property and indexing checks | Authoritative evidence | Search Console / Bing Webmaster Tools | literal |
| C8 | manual | Search and AI-search outcomes | Requested visibility verified | Engine reports and query observations | literal |
| C9 | bun-test | No visitor instrumentation or third-party automatic resources | Zero findings plus browser network verification | Privacy gate and Interceptor | literal |
| C10 | manual | Official mobile and desktop audit | Confirmed defects resolved; lab/field distinguished | PageSpeed Insights | derived: page experience |

## Decisions

- Generate ordinary HTML for all visitors from README at build time. Avoid relying on a client fetch for essential content.
- Rankings remain an open outcome claim; passing a technical audit does not close C8.
- Privacy clarification: current hosting is accepted; no tracking scripts or pixels may be introduced for search optimization. Existing visitor-side GitHub statistics and external icon CDN are being removed.
- Independent review: adopted unconsumed-prose rejection, accessible light link colors, modal focus containment/background inertness, source-template noindex, and moving build instructions out of the public hero.
- Design review: fixed light-theme text contrast; preserved established fusion gradients and definition-card glow with narrow template-scoped style-detector exceptions. No privacy/security checks suppressed.

## Not yet specified

- Search visibility and new-crawl outcomes after engine processing; field Core Web Vitals currently have no data. Bing's fresh-crawl tools returned provider errors on 2026-10-20.

## Verification

- Baseline: raw live-page extraction on 2026-10-20 contains table headers but no table rows or first-principles definitions.
- Hosting: GitHub Pages API reports legacy build from main /, custom domain verified, HTTPS certificate approved; HTTPS enforcement is currently false.
- Hosting update: HTTPS enforcement enabled and confirmed true via GitHub Pages API on 2026-10-20.
- Local validation: 74 tests / 772 assertions; 100% lines and 99.31% functions; deterministic build, SEO and privacy checks pass.
- Deployment: signed commit d887103; GitHub Actions runs 39488209994 (checks) and 39488209091 (Pages) succeeded; three live responses matched the built HTML and passed the privacy validator.
- Google: ownership verified; sitemap processed successfully with one discovered page; live smartphone fetch/crawl/indexing allowed and HTTPS canonical recognized; indexing request accepted into priority crawl queue. AI-search setting effectively Include, inherited from grc.engineering.
- Bing: ownership verified via Search Console import and sitemap imported; indexed baseline crawl is 2026-10-15. Fresh request-indexing and live-test tools returned provider errors; no fresh-crawl success claimed.
- IndexNow: canonical URL notification accepted HTTP 202 with public subdomain key; receipt does not prove indexing.
- PageSpeed: mobile/desktop performance 100, SEO 100, best practices 100; field No Data. Initial accessibility 96 identified color-only links and ambiguous Wikipedia labels; fixes now included for follow-up audit.
