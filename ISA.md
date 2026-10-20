---
task: Optimize the GRC Engineering Cheat Sheet for search and answer engines
slug: cheatsheet-seo-aeo
phase: climbing
progress: 9/10
principal_stated_goal: "https://cheatsheet.grc.engineering is totally and fully SEO and AEO optimized, based on research about the latest and greatest best practices on SEO and AEO optimization from highly credible authoritative sources on those topics, so that any traditional search engine searches or AI-native web searching related to GRC Engineering results in https://cheatsheet.grc.engineering being surfaced at the very top of the results list."
---

## Problem

Initially, the delivered HTML contained empty reference tables and definition cards, with substantive README content requiring a JavaScript fetch. Canonical metadata, structured data, crawler discovery files, and search measurement evidence were absent.

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
- [x] C6: The intended revision is committed, CI is green, and the live site serves the same content and discovery signals over HTTPS; falsifier: revision, CI or live-response mismatch. Evidence: latest content revision e1a1eb8 is signed; checks 39494662377 and Pages 39494662020 succeeded; live HTML exactly matches the built output and passes privacy validation.
- [x] C7: Search Console and Bing indexing/measurement are inspected and the relevant canonical URL is submitted where authorized access permits; falsifier: no authoritative indexing or submission evidence. Evidence: both properties verified and sitemaps processed with one discovered page; both now report October 20 indexed crawls. Google's stored HTML contains the static content and correct canonical; Bing recognizes JSON-LD and OpenGraph. IndexNow notification accepted. Earlier Bing direct-tool errors are recorded below as historical observations.
- [ ] C8: The requested broad first-place search and AI-search visibility is observed and maintained across relevant queries; falsifier: actual search results contradict it or measurement is missing.
- [x] C9: The application makes no tracking/analytics requests and collects no visitor personal data; falsifier: privacy gate or real-browser network/storage audit finds visitor instrumentation, third-party automatic resources, or collection code. Evidence: 52 privacy mutation tests, static source audit, Interceptor application network log empty; all automatic resources local and connect-src none. Production parity remains C6.
- [x] C10: Official mobile and desktop laboratory audits are inspected and actionable accessibility findings are resolved; falsifier: current audit still reports the confirmed link-distinction defects. Evidence: fresh official mobile and desktop audits score accessibility 100; scored link distinction defects are gone. Field Core Web Vitals remain unknown because both reports have no data.

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
- Privacy clarification: current hosting is accepted; no tracking scripts or pixels may be introduced for search optimization. Existing visitor-side GitHub statistics and external icon CDN are removed.
- Independent review: adopted unconsumed-prose rejection, accessible light link colors, modal focus containment/background inertness, source-template noindex, and moving build instructions out of the public hero.
- Design review: fixed light-theme text contrast; preserved established fusion gradients and definition-card glow with narrow template-scoped style-detector exceptions. No privacy/security checks suppressed.

## Not yet specified

- Broad first-place search and AI-search placement remains unmet. Both engines have ingested the update, but current broad-query results still exclude the canonical site from the first page. Fresh performance data is unavailable; field Core Web Vitals also have no data.

## Verification

- Baseline: raw live-page extraction on 2026-10-20 contains table headers but no table rows or first-principles definitions.
- Initial hosting baseline: GitHub Pages API reported legacy build from main /, custom domain verified, HTTPS certificate approved, and HTTPS enforcement false.
- Hosting update: HTTPS enforcement enabled and confirmed true via GitHub Pages API on 2026-10-20.
- Local validation: 74 tests / 772 assertions; 100% lines and 99.31% functions; deterministic build, SEO and privacy checks pass.
- Deployment: signed commits d887103 and 983027b; GitHub Actions runs 39489675719 (checks) and 39489677393 (Pages) succeeded. The subsequent scoped design fix 08fc24e passed checks 39491947237 and Pages 39491946458. Live HTML exactly matched the built output and passed the privacy validator; real-browser read confirmed 95 table rows and an empty application network log. Final live pixel screenshot viewed: /private/tmp/interceptor-screenshot-1792527224955.webp.
- Google: ownership verified; sitemap processed successfully with one discovered page; live smartphone fetch/crawl/indexing allowed and HTTPS canonical recognized; indexing request accepted into priority crawl queue. AI-search setting effectively Include, inherited from grc.engineering.
- Bing: ownership verified via Search Console import; sitemap processed successfully on 2026-10-20 with one discovered URL, zero errors or warnings. Indexed baseline crawl is 2026-10-15. Fresh request-indexing and live-test tools returned provider errors; no fresh-crawl success claimed. AI Performance reported zero citations and zero average cited pages for 2026-07-19 through 2026-10-18 across Microsoft Copilots and Partners; Search Performance was preparing data with a 48-hour check-back notice.
- IndexNow: canonical URL notification accepted HTTP 202 with public subdomain key; receipt does not prove indexing.
- PageSpeed: final report 0xwizzp8tn, 2026-10-20 16:13:29 EDT. Mobile/desktop accessibility, SEO and best practices all 100; performance 97/100. Mobile LCP 1.5 s, CLS 0.111; desktop LCP 0.4 s, CLS 0; both TBT 0 and field No Data. Initial report had performance 100/100 and accessibility 96/96; the final audit confirms the scored link distinction findings are resolved. One unscored repeated-label advisory remains for book/newsletter links titled From Heatmaps to Histograms. Mobile layout shift is a measured lab limitation, chiefly the description paragraph; no real-user Core Web Vitals claim is made.
- Browser cleanup: closed only task-owned site/search-console groups; group-list reads confirmed absence. Bing and performance agents independently closed their own groups. Stopped the task's local verification server.
- Search outcome baseline, 2026-10-20 approximately 20:15–20:18 UTC: the canonical cheat sheet was absent from the displayed first organic results pages on both Google and Bing for GRC Engineering, what is GRC Engineering, and GRC Engineering tools. Google reported unpersonalized results; both engines were observed in a single browser/locale context, so the findings are not universally representative. Bing's tools query showed the GitHub cheat-sheet result first using its older repository path; an AI answer mentioned the domain but cited GitHub. These observations do not establish a canonical organic position or canonical citation. The search-baseline agent closed its own groups and verified absence.
- GitHub repository homepage metadata was blank despite a description mentioning the domain. Set its homepage to https://cheatsheet.grc.engineering/ and confirmed the API read-back, giving repository readers a direct canonical-site link without visitor instrumentation.
- Scoped design-hook follow-up: history comparison against 4cfa98e confirmed that sub-11px navigation, tooltip, version and responsive attribution text, plus navigation/toggle size transitions, predated this work. Raised the affected text to a 0.75rem minimum and removed width/height/max-height transitions while preserving opacity/transform reveals and the established visual identity. Regenerated HTML; all 74 tests, SEO, privacy and drift checks pass.
- Follow-up browser verification at 414×896, 844×390 and 1280×900 measured navigation, version and tooltip text at 12px; attribution text at 12px mobile and 12.95px desktop; no page overflow. Viewed portrait, sticky-navigation, timeline and dark-theme pixel captures. Task-owned browser group closed and absence confirmed. Artifacts: /private/tmp/interceptor-screenshot-1792527777163.webp (portrait), /private/tmp/interceptor-screenshot-1792527804314.webp (sticky), /private/tmp/interceptor-screenshot-1792527855092.webp (timeline light), /private/tmp/interceptor-screenshot-1792527880455.webp (timeline dark).
- Design-hook triage: both detector versions (4.6.0 and 4.3.1) now return zero findings for src/index.template.html. Added CLI-managed, template-scoped exceptions for cramped-padding (real table cells have positive padding; timeline text is at least 51px inside the top/bottom borders), all-caps-body (the match is semantic h2#comparison), and gpt-thin-border-wide-shadow (preserve the same established definition-card treatment already covered by the documented dark-glow exception). No broad rule/file ignores, privacy changes, or editorial rewrites were introduced.
- Indexed-crawl follow-up on 2026-10-20: Google reports a new indexed crawl on October 20 at 4:13:48 PM (displayed time), Googlebot smartphone, fetch successful, crawl/index allowed, and the declared/selected canonical matching the HTTPS homepage. View Crawled Page contains the delivered static comparison rows and JSON-LD. This confirms ingestion of the update, not first-place ranking. Bing remains at its October 15 indexed crawl; its AI citation and pending Search reports are unchanged. No submissions were repeated. Viewed evidence: /private/tmp/interceptor-screenshot-1792528266491.webp (Google), /private/tmp/interceptor-screenshot-1792528176336.webp (Bing).
- AI retrieval observation, 2026-10-20 approximately 20:29–20:30 UTC: an anonymous ChatGPT session with Web search selected answered “What is GRC Engineering, and what principles and tools define it? Cite your sources.” The canonical cheat-sheet URL was the second link under Sources and further reading; other sources included the parent domain and GitHub. This is one direct source-list inclusion, not an organic rank or universal citation outcome. Perplexity's submitted search rendered blank, leaving its answer/citations unknown. The dedicated browser group was closed and absence confirmed.
- Public work notes retain aggregate verification outcomes without machine-specific home-directory paths or browser testing-location details. No visitor data is collected to obtain these observations.
- Font-loading review found all three critical normal faces already self-hosted and correctly preloaded with WOFF2 type and crossorigin, approximately 102KiB total. The fourth face is italic-only; preloading it does not address the plain description paragraph. No causal trace establishes a correctable font defect behind the variable mobile CLS, so no speculative font changes or visitor measurement were introduced.
- Bounded external-reference audit covered the original fixed list of 93 resources: 92 checked, one skipped to respect a related rate limit. Initially 83 were reachable, one was a confirmed legacy Lab Builder 404, and eight were unknown. Updated the missing tool's name, description, homepage and source to its documented successor, The GRC Companion, retaining its former name in the description. A supplementary primary-site check resolved GRClanker's failed www alias to its verified apex canonical; changed only that URL. Seven other results remain unknown (access restrictions, unsupported probes, transient errors or login), and one HashiCorp resource was skipped. Kept NIST FIPS31/65 citations because browser GETs returned correct 200 pages despite misleading HEAD404s. No other confirmed 404/410 appeared. Reports: /private/tmp/cheatsheet-external-links-2026-10-20.md and /private/tmp/cheatsheet-external-links-2026-10-20.json. The audit does not establish availability of every external resource.
- Updated Companion row checked in a real browser at 414×896 and 1280×900: current text and both destinations correct, no page overflow. Pixel capture viewed: /private/tmp/interceptor-screenshot-1792528866151.webp. All 74 tests, deterministic build, SEO and privacy checks pass after both resource corrections; task-owned browser groups were closed and absence verified.
- Latest publication: signed content revision e1a1eb8 passed checks 39494662377 and Pages 39494662020; live response matched the built HTML with no privacy findings and both corrected resource links present. IndexNow accepted a new notification for these actual content changes with HTTP 200 at 2026-10-20T20:46:12Z. Receipt: /private/tmp/cheatsheet-indexnow-resource-update-e1a1eb8.json. Receipt acceptance alone does not prove a crawl or ranking.
- Bing follow-up: indexed report now shows October 20, Today at 16:46, fetch successful, crawling/indexing allowed and Indexed successfully. It recognizes JSON-LD and OpenGraph and reports no SEO/GEO issues; canonical field remains blank. Search Performance returned a momentary provider error, with no performance data available. Viewed evidence: /private/tmp/interceptor-screenshot-1792529336645.webp. No further submissions were made; the task-owned browser group was closed and absence verified.
- Ranking recheck, 2026-10-20 20:49 UTC: the canonical site remained absent from displayed first-page organic results on both Google and Bing for GRC Engineering, what is GRC Engineering, and GRC Engineering tools. For the exact-title query GRC Engineering Cheat Sheet, it was second behind GitHub on both engines. This is one browser/locale snapshot, not universal placement evidence. The browser group was closed and absence verified.
- Dependency audit: the same unmet C8 condition has persisted across at least three consecutive goal turns while the identified implementation defects were resolved. An independent current-source review found no further specific, evidence-backed site-owned SEO/AEO defect; passing build, schema, privacy and indexing checks does not satisfy C8. Completion remains contradicted by the broad-query observations. Further meaningful work needs changed engine ranking/performance evidence or a newly demonstrated site-owned issue; repeated notifications, speculative content changes and tracking would not resolve this dependency. The full stated objective is unchanged and must not be marked complete.
