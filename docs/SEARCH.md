# Search and AI-search publishing

The cheat sheet is an original community reference. Its definitions, comparison, timeline, glossary, tools, and teaching resources live in `README.md`. `bun run build` publishes that material into ordinary HTML for every visitor. `src/index.template.html` owns presentation and metadata. Do not edit generated `index.html` directly.

Run `bun run check` before publishing. CI rejects stale generated HTML, missing canonical content, invalid discovery signals, and broken local references. Preserve existing section and `term-*` URLs when editing.

## Privacy boundary

This site must not collect visitor personal data or use tracking scripts, pixels, analytics, fingerprinting, identifiers or forms. Hosting remains GitHub Pages, as explicitly accepted by the owner. Fonts and icons are self-hosted. Browser-side GitHub statistics requests and persistent theme/statistics storage are removed. A restrictive content security policy blocks application network connections and third-party automatic resources; outgoing navigation suppresses referrers.

Search Console verification, sitemap submission and IndexNow use public site metadata and page URLs. They do not install visitor instrumentation. Evaluate search visibility through the engines' webmaster reports without adding analytics or exporting visitor-level logs. The privacy gate and real-browser network inspection enforce this boundary. Do not add a privacy-policy page or introduce a service that requires visitor-data collection.

## Evidence behind the implementation

Sources checked October 20, 2026. Recommendations below describe eligibility and useful publishing practices. They do not establish guaranteed indexing, citations, or first-place rankings.

| Decision | Primary-source support |
|---|---|
| Deliver essential content as HTML, use readable sections and real links, preserve mobile usability, and publish original useful material. | [Google's July 2026 generative AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) |
| Use one absolute HTTPS canonical URL, aligned with the sitemap. | [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) |
| List the single canonical page in the sitemap. Fragment links are sections of that page. Omit invented modification dates, priority and frequency claims. | [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) |
| Describe the actual reference, publisher and glossary in JSON-LD generated from visible content. Do not fabricate authors, reviews, ratings or publication dates. | [Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [Schema.org DefinedTermSet](https://schema.org/DefinedTermSet) |
| Allow crawling and snippets. The wildcard robots policy permits search and user-retrieval bots, including the bots below. Hosting must permit their requests too. | [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical) |
| Keep OpenAI search access available. Training controls are separate. | [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots) |
| Keep Claude search and user-directed retrieval available. | [Anthropic crawler guidance](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| Keep Perplexity search access available; authenticate any future WAF exceptions using published IP ranges as well as user agents. | [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) |
| Use accurate titles and descriptions. Social previews identify shared links; they are not a ranking guarantee. | [Google title links](https://developers.google.com/search/docs/appearance/title-link), [Google snippets](https://developers.google.com/search/docs/appearance/snippet) |

No special AI text file, artificial content chunking, keyword-variation page factory, paid mention campaign, or special AI schema is part of this implementation. Google's current guide explicitly rejects those as requirements or ranking shortcuts. README remains available as the editorial source. FAQ rich results were retired in May 2026; this reference does not claim a FAQ rich-result benefit. See [Google's documentation updates](https://developers.google.com/search/updates).

## Indexing and measurement

1. Verify the HTTPS URL-prefix property in Google Search Console. Inspect the canonical URL and the fetched HTML; confirm Google can see the definitions and reference rows. Submit `https://cheatsheet.grc.engineering/sitemap.xml` and request indexing after a significant publication.
2. Check the [Search generative AI setting](https://support.google.com/webmasters/answer/16908024?hl=en-EN). Inclusion is the default, but a parent property's setting can be inherited. Verify the actual setting rather than inferring it from robots.txt.
3. Inspect the [Generative AI performance report](https://support.google.com/webmasters/answer/16984139) and the ordinary Search performance report. Record impressions, clicks, queries and page selection over comparable periods. A missing report may mean insufficient impressions.
4. Verify the site in Bing Webmaster Tools, submit its sitemap, inspect indexing and use [AI Performance](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/) to track citations and grounding queries. Citations do not establish ranking position.
5. Use [IndexNow](https://www.indexnow.org/documentation) after meaningful page changes. The public key is hosted at `/c22d3c58928e4ccb8551f00b1aa3772e.txt`. Send only this site's canonical page URL. A submission receipt proves notification, not indexing. Avoid repetitive notifications of unchanged content.

Keep a dated baseline for queries such as `GRC Engineering`, `what is GRC Engineering`, `GRC Engineering vs traditional GRC`, `GRC Engineering tools`, and `GRC Engineering terms`. Record the engine, location/account context, canonical URL, and observed result or citation. Search results vary; a single query observation cannot prove universal first place. Let engine reports guide improvements to actual coverage and evidence.

## Maintaining trust

Contributors should provide primary sources for historical and technical claims, useful descriptions for tools, and attributable learning resources. Review external links and substantive claims when those entries change. Keep the source repository and contribution path visible so readers can inspect provenance and propose corrections. Add examples or deeper explanations when they help readers; preserve the reference's purpose and avoid repetitive material written only to target keywords.

## Verification on October 20, 2026

Google Search Console ownership is verified. Google processed the sitemap with one discovered page, passed a live smartphone crawl with the HTTPS canonical recognized, and accepted a new indexing request. The effective Search generative AI setting is Include, inherited from `grc.engineering`. Bing verified the imported property and successfully processed its sitemap with one discovered URL and zero errors or warnings. Its indexed baseline predates this publication, and its fresh-crawl/live-test tools returned provider errors. IndexNow accepted the canonical URL notification with HTTP 202. None of these receipts establishes a ranking.

The final [official mobile audit](https://pagespeed.web.dev/analysis/https-cheatsheet-grc-engineering/0xwizzp8tn?form_factor=mobile) and [desktop audit](https://pagespeed.web.dev/analysis/https-cheatsheet-grc-engineering/0xwizzp8tn?form_factor=desktop), run at 16:13:29 EDT, measured accessibility, SEO and best practices at 100 for both devices. Performance was 97 mobile and 100 desktop. Mobile laboratory LCP was 1.5 s and CLS 0.111; desktop LCP was 0.4 s and CLS 0. Both had zero total blocking time and **no field data**. The initial audit's scored definition-link findings were resolved with persistent underlines and distinct attribution labels. One unscored repeated-label advisory remains for the book and newsletter titled From Heatmaps to Histograms. The mobile lab run measured a description-paragraph layout shift; the earlier run scored performance 100 with CLS 0.022, demonstrating run-to-run variation. These lab scores do not establish real-user Core Web Vitals or search placement.

Bing AI Performance provides the initial citation baseline: zero citations and zero average cited pages for July 19 through October 18, 2026, across Microsoft Copilots and Partners. Search Performance was still preparing data and requested checking back in 48 hours. Broad first-place search or AI-search visibility remains unverified. Evaluate subsequent comparable engine reports before attributing any visibility change to this publication.

Rendered Google and Bing result pages were inspected at approximately 20:15–20:18 UTC for `GRC Engineering`, `what is GRC Engineering`, and `GRC Engineering tools`. The canonical cheat-sheet URL was absent from the displayed first organic results page in all six observations. Google reported unpersonalized results; both engines were observed in a single browser/locale context, so the findings are not universally representative. Bing's tools query ranked the GitHub cheat-sheet result first using its older repository path. Its AI answer mentioned this site's domain while citing GitHub, so that is not counted as a canonical-site citation. Only first pages were inspected. The repository's previously blank homepage field now links directly to the canonical HTTPS site.

A later indexed-page inspection confirmed that Google crawled the updated site on October 20 at 4:13:48 PM (displayed report time), using Googlebot smartphone. Fetching succeeded, crawling/indexing were allowed, and Google's selected canonical matched the declared HTTPS homepage. Google's stored crawled HTML includes the static comparison rows and structured data. Bing's indexed crawl remained October 15; its reports were unchanged. This confirms Google's ingestion, not a ranking outcome.

At approximately 20:29–20:30 UTC, an anonymous ChatGPT session with Web search selected answered `What is GRC Engineering, and what principles and tools define it? Cite your sources.` and linked directly to the canonical cheat sheet as the second entry in Sources and further reading. Parent-domain and GitHub links also appeared. This establishes one source-list inclusion, not search position or consistent citation across queries. Perplexity's attempted search rendered blank, so its citations remain unknown. These observations use public queries and engine interfaces, with no site analytics or visitor instrumentation.

The font-loading review confirmed that the three critical normal faces are already self-hosted and preloaded with matching WOFF2 type and `crossorigin`. Their combined size is approximately 102KiB; the fourth face is italic-only. No missed critical preload was found. The mobile layout-shift variation alone does not establish its cause. Preserve this loading strategy until a synthetic trace justifies a specific change; do not add visitor measurement. See [Google's font-loading guidance](https://web.dev/learn/performance/optimize-web-fonts) on selective preloading and its bandwidth tradeoffs.
