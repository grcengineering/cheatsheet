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

Google Search Console ownership is verified. Google processed the sitemap with one discovered page, passed a live smartphone crawl with the HTTPS canonical recognized, and accepted a new indexing request. The effective Search generative AI setting is Include, inherited from `grc.engineering`. Bing verified the imported property and sitemap; its indexed baseline predates this publication, and its fresh-crawl/live-test tools returned provider errors. IndexNow accepted the canonical URL notification with HTTP 202. None of these receipts establishes a ranking.

The [official mobile audit](https://pagespeed.web.dev/analysis/https-cheatsheet-grc-engineering/evbzmy7d1t?form_factor=mobile) and [desktop audit](https://pagespeed.web.dev/analysis/https-cheatsheet-grc-engineering/evbzmy7d1t?form_factor=desktop) measured performance 100, SEO 100 and best practices 100. Mobile laboratory LCP was 1.0 s and CLS 0.022; desktop LCP was 0.4 s and CLS 0.003. Both had zero total blocking time and **no field data**. The audit's definition-link accessibility findings were addressed by persistent underlines and distinct attribution labels. Lab scores do not establish real-user Core Web Vitals or search placement.
