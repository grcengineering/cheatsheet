# The GRC Engineering Cheat Sheet

> For decades, auditors and governments defined and molded Legacy GRC in their image. Today, engineers and analysts are transforming it into something new: GRC Engineering. This cheat sheet outlines what makes GRC Engineering different.

This README is the canonical content source for the live cheat sheet at **[cheatsheet.grc.engineering](https://cheatsheet.grc.engineering)** — the site fetches and renders this file at runtime, so any change merged here goes live within minutes. To contribute a tool, term, teaching, or timeline event, edit the relevant section below and open a pull request (see [Contributing](#contributing)).

---

## First Principles

### GRC

*"Governance, risk, and compliance (GRC) are three related facets that aim to <span class="text-highlight text-highlight-orange">assure an organization reliably achieves objectives, addresses uncertainty and acts with integrity</span>."*

— [Wikipedia](https://en.wikipedia.org/wiki/Governance,_risk,_and_compliance)

### Engineering

*"Engineering is the practice of using natural <span class="text-highlight text-highlight-blue">science</span>, <span class="text-highlight text-highlight-blue">mathematics</span>, and the <span class="text-highlight text-highlight-blue">engineering design process</span> to <span class="text-highlight text-highlight-blue">solve problems within technology, increase efficiency and productivity, and improve systems</span>."*

— [Wikipedia](https://en.wikipedia.org/wiki/Engineering)

### GRC Engineering

GRC Engineering is the practice of using <span class="text-highlight text-highlight-blue">science</span>, <span class="text-highlight text-highlight-blue">math</span>, <span class="text-highlight text-highlight-blue">user-centered design, and modern software development</span> to <span class="text-highlight text-highlight-orange">assure an organization reliably achieves objectives, addresses uncertainty, and acts with integrity</span>, all while <span class="text-highlight text-highlight-blue">continuously improving its efficiency, productivity, and systems</span>.

---

## Legacy GRC vs. GRC Engineering

A side-by-side comparison of the legacy GRC mindset and the GRC Engineering approach across the five program areas. Inside each cell, multiple bullets are separated with `<br>•`.

| Program | Legacy GRC | GRC Engineering |
|---|---|---|
| All | • Framework-first focus<br>• Documentation-heavy work products<br>• Outputs conflated with outcomes<br>• GRC treated as internal programs that serve the GRC team's needs | • Realistic risk-centered focus<br>• Threat-informed everything: policies, controls, trainings, etc.<br>• Systems thinking applied across the board: organizational governance, risk analysis, control modeling, etc.<br>• Design thinking harnessed to make the right thing to do the easy thing to do<br>• GRC treated as a product that serves internal and external customers' needs |
| Governance | • Policies, standards, procedures<br>• Docs =/= control reality<br>• Metric-less committees & decisions<br>• Annual/semi-annual training (boring) | • PaC enforces "risk tolerance" (pre-deploy/change)<br>• "Autocorrect/reconcile" docs ↔ controls<br>• Metrics-focused committees & decisions<br>• Real-time behavioral interventions & scientific pedagogy<br>• Policy-[as\|to\|from]-Code |
| Risk | • Qualitative risk analysis (manual)<br>• Subjective data & heatmaps<br>• Fragmented weaknesses & issues<br>• Accountability police<br>• Fear, Uncertainty, & Doubt (FUD)<br>• TP<u>C</u>M, heavily third-party focused | • Quantitative risk analysis (automated)<br>• Objective data & histograms<br>• Holistic risk scenarios (threat + vector + asset + impact)<br>• Decision support partners<br>• Evidence, Logic, Math, Reason (ELMR >>> FUD)<br>• TP<u>R</u>M, balanced third + first-party focus |
| Compliance | • Periodic, isolated control monitoring<br>• Evidence samples | • Automated, holistic control monitoring & active testing<br>• Evidence populations (full) |
| Trust & Assurance | • Opaque, abstracted annual artifacts<br>• RFIs handled via email | • Transparent, real-time, historical visibility into controls<br>• Self-service RFIs & questionnaire completion |

---

## Timeline

A history of governance, risk, and compliance milestones — from the first federal IT security standards to the emergence of GRC Engineering as a discipline.

| Year | Event | Actor | Summary | Relevance |
|---|---|---|---|---|
| 1972 | FIPS 31 | Government · NIST | Federal Information Processing Standard 31 — the first US government guideline on automatic data processing physical security and risk management. | Established the foundational pattern of government-issued standards driving organizational security practice. |
| 1977 | Control Objectives | Auditor · IIA | The Institute of Internal Auditors' Systems Auditability and Control study formalized the concept of "control objectives" for IT. | Created the auditor-centric vocabulary that still dominates traditional GRC. |
| 1979 | FIPS 65 | Government · NIST | First federal risk analysis methodology — a quantitative annualized loss expectancy (ALE) approach to IT risk. | Predecessor to all modern quantitative cyber risk methods (FAIR, ALE, Monte Carlo simulations). |
| 1985 | The Orange Book | Government · DoD | DoD's Trusted Computer System Evaluation Criteria — defined assurance levels (C1, C2, B1, B2, A1) for trusted systems. | First formal criteria-based certification regime; precursor to Common Criteria and FedRAMP. |
| 1992 | SAS 70 & COSO | Auditor · AICPA + COSO | AICPA's Statement on Auditing Standards 70 enabled service-organization audits; COSO published its Internal Control Integrated Framework. | Introduced third-party assurance reporting — the direct ancestor of SOC 2. |
| 1995 | BS 7799 | Government · BSI | British Standards Institution code of practice for information security management. | Direct ancestor of ISO 27001, the global ISMS standard. |
| 1996 | HIPAA & COBIT | Government + Auditor · HHS / ISACA | US healthcare privacy and security law (HIPAA); ISACA's Control Objectives for Information and Related Technologies (COBIT) framework. | Established sector-specific compliance regulation and an IT governance framework still widely audited against. |
| 2002 | SOX & FISMA | Government · US Congress | Sarbanes-Oxley imposed financial reporting controls on public companies; FISMA mandated security programs across federal agencies. | Birth of the modern compliance industry — created enormous demand for control documentation and audit work. |
| 2003 | OCEG & The Red Book | Analyst · OCEG | The Open Compliance and Ethics Group was founded and published its Red Book GRC Capability Model. | Coined the umbrella term "GRC" itself. |
| 2005 | ISO 27001 | Government · ISO/IEC | International standard for information security management systems, evolving from BS 7799. | Became the de facto global ISMS certification. |
| 2011 | SSAE 16 & SOC | Auditor · AICPA | AICPA replaced SAS 70 with SSAE 16, introducing SOC 1, SOC 2, and SOC 3 reports. | SOC 2 became the dominant trust signal for SaaS vendors. |
| 2014 | NIST CSF | Government · NIST | Cybersecurity Framework v1.0 — voluntary risk-based framework with Identify / Protect / Detect / Respond / Recover functions. | Most widely adopted cybersecurity framework outside of regulated sectors. |
| 2018 | GDPR | Government · EU | General Data Protection Regulation — comprehensive EU privacy law with global extraterritorial reach. | Reset the bar for privacy controls and triggered a wave of similar legislation worldwide. |
| 2021 | Netflix hires GRC Engineers | Engineer · Netflix | Netflix posted some of the first job descriptions explicitly titled "GRC Engineer," applying engineering practices to compliance. | Marked the emergence of GRC as an engineering discipline rather than a purely auditor-driven function. |
| 2022–Now | EU goes absolutely *ham* | Government · EU | NIS2, DORA, the AI Act, the Cyber Resilience Act, and more — a sustained legislative push across cybersecurity, resilience, and AI. | Multiplied compliance scope and accelerated the case for engineering-grade automation. |
| 2024 | GRC Engineering Manifesto published | Engineer · Community | A community-authored manifesto codifying the principles of GRC Engineering at grc.engineering. | Crystallized the discipline's values — engineering practices, automation, design thinking — into a shared artifact. |

---

## Terms

Vocabulary that distinguishes GRC Engineering thinking from legacy GRC.

| Term | Description |
|---|---|
| **Systems Thinking** | Examining how components interrelate and work together over time within larger systems. Applied across governance, risk analysis, and control modeling. |
| **Design Thinking** | Human-centered problem-solving methodology. Harnessed to make the right thing to do the easy thing to do. |
| **Threat-Informed** | Grounding policies, controls, and trainings in real-world threat intelligence rather than abstract framework checklists. |
| **GRC as a Product** | Treating GRC programs as products serving internal and external customers, with user research, feedback loops, and measurable outcomes. |
| **Policy-as-Code (PaC)** | Policies written as executable code; the code *is* the source of truth, enabling version control, testing, and deterministic enforcement. |
| **Policy-to-Code** | Translating human-readable policy documents into executable code, bridging policy authors and enforcement systems. |
| **Policy-from-Code** | Deriving policy documentation from code, configurations, or runtime behavior. Closes the gap between docs and control reality. |
| **Scientific Pedagogy** | Evidence-based learning science—spaced repetition, scenario-based exercises, measurable retention—applied to security training. |
| **TPCM** | Third-party compliance management. Legacy questionnaire-focused approach that conflates compliance with risk. |
| **TPRM** | Third-party risk management. Balanced third + first-party focus, evaluating real-world threat scenarios and value-at-risk. |
| **Qualitative Risk Analysis** | Subjective High/Medium/Low scales based on expert judgment. Manual, inconsistent, and difficult to aggregate. |
| **Quantitative Risk Analysis** | Numerical models, probability distributions, and measurable data. Automated, reproducible, and comparable across scenarios. |
| **Heatmaps** | Legacy likelihood × impact matrices on ordinal scales. Obscure actual risk magnitude behind coarse, subjective categories. |
| **Histograms** | Frequency-distribution charts conveying risk shape, range, and confidence intervals in objective, data-driven terms. |
| **Monte Carlo Simulations** | Probabilistic simulations producing distributions and histograms instead of single-point estimates and heatmaps. |
| **Risk Scenarios** | Holistic descriptions combining threat + attack vector + affected asset + impact into a single analyzable unit. |
| **FUD** | Fear, Uncertainty, and Doubt. Legacy fear-based risk communication used to justify budget without rigorous analysis. |
| **ELMR** | Evidence, Logic, Math, Reason. The GRC Engineering alternative to FUD—grounded in verifiable data and sound reasoning. |
| **Decision Support** | Providing data, analysis, and options so stakeholders make informed risk decisions. Replaces the "accountability police" model. |
| **Control Monitoring** | Observing whether controls operate as intended. GRC Engineering automates this continuously and holistically. |
| **Active Testing** | Exercising controls to confirm they function—not just checking they exist. Analogous to software automated tests. |
| **Evidence Samples** | Legacy subset of records selected to demonstrate control operation. Incomplete and vulnerable to selection bias. |
| **Evidence Populations** | Complete control records collected automatically over a period. Eliminates sampling risk with full coverage. |

---

## Tools

Open-source and commercial tools that enable GRC Engineering practices — policy-as-code, continuous compliance, evidence automation, quantitative risk, and compliance-as-code.

| Tool | Description |
|---|---|
| [**Open Policy Agent (OPA)**](https://www.openpolicyagent.org/) | General-purpose policy engine for unified policy decisions across the cloud-native stack. |
| [**Rego**](https://www.openpolicyagent.org/docs/policy-language) | OPA's declarative policy language. Enables Policy-as-Code evaluation in CI/CD pipelines. |
| [**OPA Gatekeeper**](https://open-policy-agent.github.io/gatekeeper/website/) | Kubernetes admission controller built on OPA. Enforces Rego policies on cluster resources at admission time. |
| [**Kyverno**](https://kyverno.io/) | Kubernetes-native policy engine that validates, mutates, and generates resource configurations at admission time. |
| [**Kubewarden**](https://www.kubewarden.io/) | CNCF Kubernetes policy engine; policies as WebAssembly modules in Rust, Go, Rego, CEL, and others. |
| [**HashiCorp Sentinel**](https://www.hashicorp.com/en/sentinel) | Embedded policy-as-code framework for Terraform, Vault, Consul, and Nomad — gates infrastructure changes pre-apply. |
| [**Pulumi Policies**](https://www.pulumi.com/docs/insights/policy/) | CrossGuard policy-as-code for Pulumi infrastructure-as-code, written in TypeScript, Python, or Go. |
| [**Chef**](https://docs.chef.io/inspec/7.0/) | Continuous compliance via [InSpec](https://docs.chef.io/inspec/7.0/)'s human-readable audit DSL; [Policyfiles](https://www.chef.io/blog/policy-as-code-with-chef-mastering-policyfiles) express policy-as-code for environment configuration. |
| [**Puppet**](https://www.puppet.com/blog/policy-as-code#puppet-01) | Policy-as-code via Puppet manifests; continuous compliance through automated drift detection and remediation. |
| [**Ansible**](https://www.ansible.com/) | Policy-as-code via playbooks and roles; continuous compliance through idempotent automated configuration enforcement. |
| [**Salt Stack**](https://saltproject.io/) | Event-driven configuration management with policy-as-code in SLS files; continuous compliance via reactor and beacon engines. |
| [**Checkov**](https://www.checkov.io/) | Static IaC scanner (Terraform, CloudFormation, Kubernetes, ARM…); policy-as-code and continuous compliance in CI/CD. |
| [**Cloud Custodian**](https://cloudcustodian.io/) | YAML-based rules engine for cloud governance, security, and continuous compliance with serverless auto-remediation. |
| [**ScoutSuite**](https://github.com/nccgroup/ScoutSuite) | Multi-cloud security auditing tool. Active testing against CIS, PCI DSS, and HIPAA benchmarks. |
| [**Prowler**](https://prowler.com/) | Open-source cloud security platform. Continuous compliance across AWS, Azure, GCP, Kubernetes, M365, and more. |
| [**Steampipe**](https://steampipe.io/) | Cloud APIs as SQL tables. Full-state infrastructure queries for evidence populations across 100+ services. |
| [**CloudQuery**](https://www.cloudquery.io/) | Infrastructure-as-data platform syncing cloud and SaaS configurations into queryable databases for evidence pipelines. |
| [**FAIR**](https://www.fairinstitute.org/what-is-fair) | Open standard decomposing risk into measurable factors (threat event frequency, vulnerability, loss magnitude). |
| [**riskquant**](https://github.com/Netflix-Skunkworks/riskquant/) | Netflix's open-source library for quantifying risk via FAIR-based Monte Carlo simulations. |
| [**GigaChad GRC**](https://github.com/grcengineering/gigachad-grc) | Open-source modular GRC platform for compliance (SOC 2, ISO 27001, HIPAA), risk registers, vendor assessments, and audits. AI-powered, containerized, self-hostable. |
| [**Corsair**](https://grcorsair.com/) | Signs compliance findings as W3C Verifiable Credentials (Ed25519 / JWT) so any party can verify integrity without trusted intermediaries. |
| [**Gemara**](https://gemara.openssf.org/) | OpenSSF seven-layer logical model for automated GRC engineering — standardised, machine-readable schemas (CUE) for compliance interoperability. |
| [**GRClanker**](https://www.grclanker.com/) | Spec-driven open-source AI GRC CLI — bring your own AI agent (Claude, Codex, Gemini…) to generate Go CLIs for FedRAMP, KEV, EPSS, SCF crosswalks. |
| [**myctrl.tools**](https://www.myctrl.tools/) | Fast, searchable reference site for security compliance controls across frameworks (FedRAMP Rev5, DoD SRG, and more). |
| [**SCF API**](https://hackidle.github.io/scf-api/) | API for the Secure Controls Framework (1,400+ controls mapped to 200+ laws, regulations, and frameworks). |
| [**Compliance Trestle**](https://github.com/oscal-compass/compliance-trestle) | OSCAL-native compliance-as-code platform for CI/CD authoring, validation, and governance of compliance artifacts in git. |
| [**claude-grc-engineering**](https://github.com/GRCEngClub/claude-grc-engineering) | Claude Code plugin suite for evidence collection, SCF crosswalks, multi-framework gap reports, and OSCAL workflows. |
| [**Compliance to Policy (C2P)**](https://github.com/oscal-compass/compliance-to-policy) | Bridges OSCAL compliance-as-code with policy-as-code engines (Kyverno, OCM, Auditree); generates policies and ingests assessment results. |
| [**How to Harden**](https://github.com/grcengineering/how-to-harden) | Community-developed open-source hardening guides focused on cloud services and integration / supply-chain attack prevention. |
| [**Open Source Cybersecurity Training**](https://github.com/emreugurlu/open-security-training) | Free SCORM-compatible interactive security & privacy training modules — phishing, CEO fraud, secure coding, and more ([live demo](https://emreugurlu.github.io/open-security-training/)). |
| [**GRC Engineering Lab Builder**](https://grc.engineering/grc_engineering_lab_builder/) | Static-site generator for hyper-personalized GRC engineering lab prompts (Claude, ChatGPT, Gemini-compatible) — [source](https://github.com/grcengineering/grc_engineering_lab_builder). |

---

## Teachings

Books, courses, labs, podcasts, talks, blogs, and communities for learning and practicing GRC Engineering.

| Type | Resource | Author |
|---|---|---|
| Books | [**GRC Engineering for AWS**](https://www.amazon.com/GRC-ENGINEERING-AWS-Hands-Engineering/dp/B0FDLZX4BP) | AJ Yawn |
| Books | [**How to Measure Anything in Cybersecurity Risk**](https://www.wiley.com/en-us/How+to+Measure+Anything+in+Cybersecurity+Risk,+2nd+Edition-p-9781119892304) | Richard Seiersen, Doug Hubbard |
| Books | [**Measuring and Managing Information Risk: A FAIR Approach**](https://www.fairinstitute.org/fair-book) | Jack Jones, Jack Freund |
| Books | [**From Heatmaps to Histograms**](https://www.amazon.com/Heatmaps-Histograms-Practical-Guide-Quantification) | Tony Martin-Vegue |
| Books | [**The Metrics Manifesto**](https://www.amazon.com/Prove-Confronting-Security-Data) | Richard Seiersen |
| Courses | [**GRC for the Cloud-Native Revolution**](https://www.linkedin.com/learning/governance-risk-and-compliance-grc-for-the-cloud-native-revolution) | Ayoub Fandi |
| Courses | [**Cybersecurity Foundations: GRC**](https://www.linkedin.com/learning/cybersecurity-foundations-governance-risk-and-compliance-grc) | AJ Yawn |
| Courses | [**Leveraging AI for GRC**](https://www.linkedin.com/learning/leveraging-ai-for-governance-risk-and-compliance) | Terra Cooke |
| Courses | [**Threat Modeling Learning Path**](https://www.linkedin.com/learning/paths/improve-your-threat-modeling-skills) | LinkedIn Learning |
| Labs | [**GRC Playground**](https://www.grcplayground.com) | Ashley Pearce · [original GitHub repo](https://github.com/ashpearce/GRC-Playground) |
| Labs | [**GRC Portfolio Labs**](https://github.com/ajy0127/grc_portfolio) | AJ Yawn |
| Podcasts | [**GRC Engineer Podcast**](https://grcengineer.com/) | Ayoub Fandi |
| Podcasts | [**Cyber Stories — GRC Engineering**](https://www.cyberstoriespodcast.com/p/governance-risk-and-compliance-grc-3bd) | Day Johnson (feat. Ayoub Fandi) |
| Podcasts | [**Resilient Cyber — Transforming Compliance**](https://www.resilientcyber.io/p/resilient-cyber-w-aj-yawn-transforming) | Chris Hughes (feat. AJ Yawn) |
| Podcasts | [**MYGRCPOV — Rise of GRC Engineering**](https://www.mygrcpov.com/the-rise-of-grc-engineering-with-aj-yawn/) | Monica Reagor (feat. AJ Yawn) |
| Talks & Interviews | [**BSidesSF 2024 — GRC Engineering in Repository**](https://www.youtube.com/watch?v=gtnP68wosHo) | Varun Gurnaney |
| Talks & Interviews | [**BSidesSF 2025 — Compliance in DevOps Pipeline**](https://securityboulevard.com/2025/07/bsidessf-2025-compliance-without-the-chaos-building-it-right-into-your-devops-pipeline/) | Varun Gurnaney |
| Talks & Interviews | [**Netflix Security — Risk-based Decision Making**](https://www.youtube.com/watch?v=wgQkqPmDIAQ) | Prashanthi Koutha, Shannon Morrison |
| Talks & Interviews | [**fwd:cloudsec 2025 — GRC Engineering for AWS**](https://pretalx.com/fwd-cloudsec-2025/talk/GRRE3N/) | AJ Yawn |
| Talks & Interviews | [**What is GRC Engineering?**](https://www.youtube.com/watch?v=cR3x4YBTPdQ) | Lloyd Evans |
| Talks & Interviews | [**Automating Compliance Processes**](https://www.youtube.com/watch?v=eQGz8USfn8s) | Lloyd Evans |
| Talks & Interviews | [**CPA to Cybersecurity Pivot**](https://www.cpatocybersecurity.com/p/study-grc-engineering) | Steve McMichael (feat. Ayoub Fandi) |
| Talks & Interviews | [**FAIRCon 2022 — Five Objections to FAIR**](https://www.fairinstitute.org/faircon22-agenda) | Tony Martin-Vegue, Prashanthi Koutha |
| Talks & Interviews | [**GRC Deep Dive on Cyber Risk Quantification**](https://www.youtube.com/watch?v=8ZvBfKiCMD8) | Steve McMichael (with Richard Seiersen) |
| Blogs & Newsletters | [**The GRC Engineer Newsletter**](https://grcengineer.com/) | Ayoub Fandi |
| Blogs & Newsletters | [**From Heatmaps to Histograms**](https://newsletter.heatmapstohistograms.com/) | Tony Martin-Vegue |
| Blogs & Newsletters | [**Varun Gurnaney's Medium**](https://medium.com/@varungurnaney) | Varun Gurnaney |
| Blogs & Newsletters | [**Netflix TechBlog — Open-Sourcing riskquant**](https://medium.com/@NetflixTechBlog/open-sourcing-riskquant-a-library-for-quantifying-risk-6720cc1e4968) | Markus De Shon, Shannon Morrison |
| Community | [**GRC Engineering Discord**](https://discord.gg/CG6EDDbG4B) | Community Discord server |
| Community | [**GRC Engineering LinkedIn Group**](https://www.linkedin.com/groups/12997229/) | Community LinkedIn group |
| Community | [**GRC Engineering Club**](https://www.patreon.com/cw/GRCEngineeringClub) | Patreon community |

---

## Contributing

Contributions are welcome. To add or update an entry:

1. **Fork** this repository.
2. **Edit `README.md`** — add a row to the relevant table, keeping the existing order (chronological for Timeline, grouped-by-Type for Teachings, alphabetical or thematic otherwise).
3. **Open a pull request** with a brief explanation of why the resource belongs in this list.

### Guidelines

- **Tools**: Should be actively maintained, documented, and align with GRC Engineering principles (automation, code-as-source-of-truth, measurable outcomes).
- **Teachings**: Books, courses, talks, podcasts, blogs, labs, and communities — credible authors and accessible content preferred.
- **Terms**: Vocabulary that meaningfully distinguishes GRC Engineering from legacy GRC. Keep definitions concise (1–2 sentences).
- **Timeline**: Verifiable historical milestones with a clear connection to the GRC field.
- **Comparison table**: Keep bullet items short, parallel in structure between Legacy and GRC Engineering columns, and grouped under one of the five program areas.

### Markdown conventions

The cheatsheet renders this README at runtime, so syntax matters:

- All section tables use standard markdown tables.
- Inside the **Comparison** table, bullet items within a single cell are separated with `<br>•` (literal HTML line break + bullet).
- Inline links use `[text](url)`; **bold** is `**text**`; *italic* is `*text*`.
- Raw HTML (`<u>`, `<em>`, `<span class="...">`, `<br>`) is preserved through to the rendered cheatsheet.
