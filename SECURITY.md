# Security Policy

## Scope

This repository publishes <https://cheatsheet.grc.engineering> — a static,
client-side GRC Engineering cheatsheet. It is a single `index.html` plus the
`README.md` it renders at runtime. There is no server, no database, no user
account, and no data collected from visitors.

The security-relevant surface is therefore small and specific:

- **`index.html`** — the page and its inline JavaScript. The script fetches
  `README.md` from this repository over HTTPS at page load and renders it into
  the DOM. Anything that could turn that content into executed script in a
  visitor's browser is in scope.
- **`README.md`** — the content source rendered by the above. It is the
  untrusted-ish input to the renderer, even though it lives in this repo.
- **`.github/workflows/`** — the CI supply chain (see below).
- **The published site** — anything served from `cheatsheet.grc.engineering`.

## Supported versions

There are no released versions. The deployed site is always the current `main`;
a push to `main` goes live within minutes. Only `main` is supported, and fixes
land there.

## Reporting a vulnerability

**Please report privately first — do not open a public issue for a security
problem.**

Use GitHub's private vulnerability reporting on this repository:

> **Security** tab → **Report a vulnerability**
> <https://github.com/grcengineering/cheatsheet/security/advisories/new>

That routes the report to the maintainers through a private advisory, lets us
collaborate on a fix in a private fork, and lets us credit you on publication.

If private reporting is unavailable to you for any reason, open a public issue
that says only that you have a security report and asks for a private channel —
**no details in the issue** — and a maintainer will follow up.

### What to include

Whatever you have. The most useful reports carry:

- what the issue is and why it matters;
- the exact file/line or the URL and browser where it reproduces;
- reproduction steps or a proof-of-concept;
- any suggested fix.

### What to expect

| Stage | Target |
|---|---|
| Acknowledgement of your report | within 3 business days |
| Initial assessment (valid / not / need more) | within 7 business days |
| Fix or documented decision for an accepted report | within 30 days |

These are good-faith targets for a small maintainer team, not a contractual SLA.
If you have not heard back within the acknowledgement window, please ping the
advisory thread — it means the notification was missed, not ignored.

We will credit reporters by name or handle when the advisory is published,
unless you ask us not to.

## Safe harbour

We will not pursue or support legal action against anyone who, in good faith:

- reports a vulnerability through the private channel above;
- limits testing to this repository and the site it publishes;
- avoids privacy violations, data destruction, and service degradation;
- gives us reasonable time to remediate before public disclosure.

Testing against third-party services this site links to is **not** covered — that
is between you and them.

## Out of scope

The following are known, accepted properties of a static site and are not
vulnerabilities in this project. Reports consisting only of these will be closed
with thanks:

- Absence of server-side security headers (HSTS, CSP, `X-Frame-Options`) — the
  site is served by GitHub Pages and this repository does not control response
  headers.
- Missing SPF/DKIM/DMARC on the domain — no mail is sent from it.
- Rate limiting, brute force, or account enumeration — there are no accounts.
- Automated scanner output with no demonstrated impact on this site.
- Vulnerabilities in third-party sites that this cheatsheet merely links to.
- Clickjacking on a page with no state-changing action.

## Supply-chain security

This repository is bootstrapped with
[sscs-bootstrapper](https://github.com/p4gs/sscs-bootstrapper) (`sscsb`). The
enforced controls are declared in `.sscsb/config.toml` and implemented by the
workflows in `.github/workflows/`. Notably:

- **Secret detection is TruffleHog only**, deliberately. TruffleHog verifies a
  candidate credential against its issuing provider, so a finding means the key
  is real and live. Regex-only scanners are not run alongside it, because
  unverifiable findings are noise, not defence in depth.
- **SAST is CodeQL plus OpenGrep**, and CodeQL carries the application code:
  CodeQL's `javascript-typescript` extractor reads inline `<script>` blocks out
  of `index.html`, and Semgrep/OpenGrep do not (both were measured reporting
  "0 files" against that file). Both are kept — they cover different surfaces.
- **All GitHub Actions are pinned to full commit SHAs**, never mutable tags, and
  every job runs under `step-security/harden-runner` with `persist-credentials:
  false` on checkout.
- **Commits to `main` must be signed**, force-pushes and branch deletion are
  blocked by a repository ruleset, and approved signers are committed to
  `.sscsb/policy/signers.toml`.
- SBOM generation, vulnerability scanning (Trivy + OSV-Scanner), OpenSSF
  Scorecard, and Renovate run in CI.

If you find a gap in any of the above, that is in scope and we want to hear
about it.
