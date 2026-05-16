# The GRC Engineering Cheat Sheet

> For decades, auditors and governments defined and molded Legacy GRC in their image. Today, engineers and analysts are transforming it into something new: GRC Engineering. This cheat sheet outlines what makes GRC Engineering different.

This README is the canonical content source for the live cheat sheet at **[cheatsheet.grc.engineering](https://cheatsheet.grc.engineering)** — the site fetches and renders this file at runtime, so any change merged here goes live within minutes. To contribute a tool, term, teaching, or timeline event, edit the relevant section below and open a pull request (see [Contributing](https://github.com/grcengineering/cheatsheet#contributing)).

---

## First Principles

### GRC

*"Governance, risk, and compliance (GRC) are three related facets that aim to <span class="text-highlight text-highlight-orange">assure an organization reliably achieves objectives, addresses uncertainty and acts with integrity</span>."*

— [Wikipedia](https://en.wikipedia.org/wiki/Governance,_risk,_and_compliance)

### Engineering

*"Engineering is the practice of using natural <span class="text-highlight text-highlight-blue">science</span>, <span class="text-highlight text-highlight-blue">mathematics</span>, and the <span class="text-highlight text-highlight-blue">engineering design process</span> to <span class="text-highlight text-highlight-blue">solve problems within technology, increase efficiency and productivity, and improve systems</span>."*

— [Wikipedia](https://en.wikipedia.org/wiki/Engineering)

### GRC Engineering

GRC Engineering is the practice of using <span class="text-highlight text-highlight-blue">science</span>, <span class="text-highlight text-highlight-blue">math</span>, <span class="text-highlight text-highlight-blue">[user-centered design](https://en.wikipedia.org/wiki/User-centered_design), and [modern software development](https://en.wikipedia.org/wiki/Software_development)</span> to <span class="text-highlight text-highlight-orange">assure an organization reliably achieves objectives, addresses uncertainty, and acts with integrity</span>, all while <span class="text-highlight text-highlight-blue">continuously improving its efficiency, productivity, and systems</span>.

— [The GRC Engineering Cheat Sheet](https://cheatsheet.grc.engineering)

---

## Legacy GRC vs. GRC Engineering

A side-by-side comparison of the legacy GRC mindset and the GRC Engineering approach across the five program areas. Inside each cell, multiple bullets are separated with `<br>•`.

| Program | Legacy GRC | GRC Engineering |
|---|---|---|
| All | • Framework-centric approaches<br>• Shallow & narrow problem solving mindset<br>• Cumbersome user experience (UX) across GRC processes, tools, etc.<br>• Work products = static documents, manual workflows, disjointed processes, and theatrical controls<br>• Processes are excessively, if not exclusively, manual<br>• Trivial outputs conflated with meaningful outcomes<br>• GRC treated as a program that serves GRC teams' needs and preferences | • Objectives-centric, risk-focused, and threat-informed approaches<br>• Systems thinking applied broadly (organizational governance, risk analysis, control modeling, etc.)<br>• Design thinking harnessed to make the right thing to do the easy thing to do<br>• Work products = dynamic systems, automated workflows, embedded processes, and enforced guardrails<br>• Processes are automated, early on and often<br>• Measurable, meaningful outcomes (or bust)<br>• GRC treated as a product that serves internal and external customers' needs and preferences |
| Governance | • Mainly consists of static policies, standards, and procedures that everyone "acknowledges" but never remembers<br>• Static governance documentation rarely reflects reality of controls<br>• Committees exist to check boxes but rarely, if ever, drive strategic decisions that effect change<br>• Awareness training checks boxes but is too infrequent, delayed, unengaging, and ill designed to durably change behaviors | • Mainly consists of strong guardrails (e.g. policy-as-code) that enforce risk tolerance & paved paths that make it easy to do the right thing the right way<br>• Dynamic governance documentation is enforced via policy-as-code, expressed via policy-to-code, and reconciled via policy-from-code<br>• Committees exist to define/refine decision making frameworks & to facilitate strategic decisions<br>• Real-time behavioral interventions prevent improper behaviors, while awareness training leverages science-based pedagogy to durably change behaviors |
| Risk | • Risk program is built on qualitative risk analyses that are heavily, if not entirely, based on unvalidated assumptions, uncalibrated intuition, and generic heatmap frameworks<br>• "Risks" are ambiguous hypotheticals or "control gap findings" that are detached from a real-world understanding of relevant threats, threat vectors, weaknesses, assets, and/or impacts<br>• Numerical risk scores conflated with "risk quantification"<br>• Risk tolerance/appetite are imaginary concepts that exist in policy documents with no real-world grounding<br>• Fear, uncertainty, & doubt (FUD) dominates risk register entries and risk conversations<br>• Risk team operates as "accountability police" that attempts to pressure, shame, or strong arm fellow teams into taking action<br>• Third-party risk management (TPRM) is really just third-party **compliance** management (TPCM) in disguise, focused entirely on third-party controls/mitigations while overlooking first-party risk mitigation opportunities | • Risk program is built on quantitative risk analyses that are based in scientifically-sound forecasting methods, statistical modeling, real-world evidence, and proven frameworks (e.g. FAIR)<br>• "Risks" are holistic scenarios that account for threats, threat vectors, weaknesses, assets, controls, and impacts<br>• True risk quantification is in place, with quantitative inputs producing quantitative outputs<br>• Risk tolerance/appetite is derived from real-world and measurable constraints, such as insurance limits, cash reserves, organizational goals, and executive leaderships' values and principles<br>• Evidence, logic, math, & reason (ELMR) dominates risk register entries and risk conversations<br>• Risk team operates as "decision support partners" that enable their organization to make smart risk decisions<br>• TPRM is actually managing **risk**, focused on holistic scenarios, quantitative risk analyses, and both first-party and third-party controls/mitigations |
| Compliance | • Control monitoring is done periodically, infrequently, and manually<br>• Control design evaluations and testing methods are ignorant of real-world threat models<br>• Control evidence assessments are sampling-based and are partially or totally unscientific, ignorant of effect size, statistical power, etc. | • Control monitoring is event-driven (i.e. real-time) whenever possible, highly automated, and frequent<br>• Control design evaluations and testing methods are rooted in evidence-based real-world threat models<br>• Control evidence assessments are full population-based. When sampling is unavoidable, sampling methods are scientific and account for effect size, statistical power, etc. |
| Trust & Assurance | • Trust signals are predominantly in the form of questionnaires and static documents<br>• Customers gather trust & assurance artifacts via cumbersome RFP/RFI processes that are largely mediated over email or support tickets | • Trust signals in the form of historical control monitoring metrics are transparently and programmatically provided, and are consumable in human-readable and machine-readable formats<br>• Customers can easily self-serve their way through gathering trust & assurance artifacts, getting questionnaires automatically completed, etc. |

---

## Timeline

A history of governance, risk, and compliance milestones — from the first federal IT security standards to the emergence of GRC Engineering as a discipline.

| Year | Date | Event | Actor | Summary | Relevance | Source |
|---|---|---|---|---|---|---|
| Jun 1974 | June 1, 1974 | FIPS 31 | Governments · NIST | Federal Information Processing Standard 31 — the first US government guideline on automatic data processing physical security and risk management. | Established the foundational pattern of government-issued standards driving organizational security practice. | https://csrc.nist.gov/pubs/fips/31/final |
| 1977 | 1977 | Control Objectives | Auditors · IIA | The Institute of Internal Auditors' Systems Auditability and Control study formalized the concept of "control objectives" for IT. | Created the auditor-centric vocabulary that still dominates traditional GRC. | https://www.theiia.org/en/standards/ |
| Aug 1979 | August 1, 1979 | FIPS 65 | Governments · NIST | First federal risk analysis methodology — a quantitative annualized loss expectancy (ALE) approach to IT risk. | Predecessor to all modern quantitative cyber risk methods (FAIR, ALE, Monte Carlo simulations). | https://csrc.nist.gov/pubs/fips/65/final |
| Aug 1983 | August 15, 1983 | The Orange Book | Governments · DoD | The NCSC's Trusted Computer System Evaluation Criteria (originally CSC-STD-001-83) — defined assurance levels (C1, C2, B1, B2, A1) for trusted systems; reissued as DoD 5200.28-STD on December 26, 1985. | First formal criteria-based certification regime; precursor to Common Criteria and FedRAMP. | https://en.wikipedia.org/wiki/Trusted_Computer_System_Evaluation_Criteria |
| Apr 1988 | April 1988 | NIST SP 500-153 | Governments · NIST | NIST (formerly NBS) publishes SP 500-153 "Guide to Auditing for Controls and Security: A System Development Life Cycle Approach". | Well-defined guidelines and standards for IT auditing in the context of system development lifecycles. | https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nbsspecialpublication500-153.pdf |
| Apr 1992 | April 1992 | SAS 70 | Auditors · AICPA | AICPA's Statement on Auditing Standards No. 70 enabled independent audits of a service organization's controls. | Introduced third-party assurance reporting — the direct ancestor of SOC 2. | https://en.wikipedia.org/wiki/SAS_70 |
| Sep 1992 | September 1992 | COSO Internal Control Framework | Auditors · COSO | COSO published its Internal Control — Integrated Framework, the model that still underpins SOX control testing. | Became the reference internal-control model auditors evaluate financial and IT controls against. | https://www.coso.org/internal-control |
| Feb 1995 | February 1995 | BS 7799 | Governments · BSI | British Standards Institution code of practice for information security management. | Direct ancestor of ISO 27001, the global ISMS standard. | https://en.wikipedia.org/wiki/BS_7799 |
| Apr 1996 | April 1996 | COBIT | Auditors · ISACA | ISACA (then ISACF) released the first edition of Control Objectives for Information and Related Technologies (COBIT). | Established the IT governance framework still widely audited against. | https://www.isaca.org/resources/cobit |
| Aug 1996 | August 21, 1996 | HIPAA | Governments · HHS | US healthcare privacy and security law (Public Law 104-191) signed by President Clinton. | Established sector-specific compliance regulation enforced by HHS. | https://www.hhs.gov/hipaa/for-professionals/index.html |
| Jul 2002 | July 30, 2002 | SOX | Governments · US Congress | Sarbanes-Oxley (Pub. L. 107-204) imposed financial-reporting internal-control requirements on US public companies. | Birth of the modern compliance industry — created enormous demand for control documentation and audit work. | https://www.govinfo.gov/app/details/PLAW-107publ204 |
| Dec 2002 | December 17, 2002 | FISMA | Governments · US Congress | The Federal Information Security Management Act, enacted as Title III of the E-Government Act of 2002 (Pub. L. 107-347). | Standardized federal agency security programs and seeded the NIST Risk Management Framework lineage. | https://www.govinfo.gov/app/details/PLAW-107publ347 |
| Dec 2002 | December 2002 | OCEG founded | Analysts · OCEG | The Open Compliance and Ethics Group was officially launched to integrate governance, risk, and compliance into one discipline. | Formalized and popularized "GRC" as an integrated practice — the term itself was coined by Michael Rasmussen at Forrester in February 2002. | https://www.oceg.org/ideas/what-is-grc/ |
| 2003 | 2003 | OCEG Red Book published | Analysts · OCEG | OCEG published the first GRC Capability Model — the "Red Book." | Established the first formal GRC capability model, the reference architecture later GRC tooling was built around. | https://www.oceg.org/20-years/ |
| Oct 2005 | October 14, 2005 | ISO 27001 | Governments · ISO/IEC | International standard for information security management systems, evolving from BS 7799. | Became the de facto global ISMS certification. | https://www.iso.org/standard/42103.html |
| Jun 2011 | June 15, 2011 | SSAE 16 & SOC | Auditors · AICPA | AICPA replaced SAS 70 with SSAE 16, introducing SOC 1, SOC 2, and SOC 3 reports. | SOC 2 became the dominant trust signal for SaaS vendors. | https://en.wikipedia.org/wiki/SSAE_16 |
| Feb 2014 | February 12, 2014 | NIST CSF | Governments · NIST | Cybersecurity Framework v1.0 — voluntary risk-based framework with Identify / Protect / Detect / Respond / Recover functions. | Most widely adopted cybersecurity framework outside of regulated sectors. | https://www.nist.gov/news-events/news/2014/02/nist-releases-cybersecurity-framework-version-10 |
| May 2018 | May 25, 2018 | GDPR | Governments · EU | General Data Protection Regulation — comprehensive EU privacy law with global extraterritorial reach. | Reset the bar for privacy controls and triggered a wave of similar legislation worldwide. | https://eur-lex.europa.eu/eli/reg/2016/679/oj |
| 2021 | June 1, 2021 | Netflix hires first GRC Engineer | Engineers · Netflix | Netflix posted some of the first job descriptions explicitly titled "GRC Engineer," applying engineering practices to compliance. | Marked the emergence of GRC as an engineering discipline rather than a purely auditor-driven function. | https://www.linkedin.com/in/mosi-k-platt/ |
| Dec 2022 | December 14, 2022 | EU goes absolutely *ham* | Government · EU | NIS2, DORA, the AI Act, the Cyber Resilience Act, and more — a sustained legislative push across cybersecurity, resilience, and AI. | Multiplied compliance scope and accelerated the case for engineering-grade automation. | https://eur-lex.europa.eu/eli/dir/2022/2555/oj |
| Nov 2023 | November 23, 2023 | GRC Engineering Podcast launches | Engineer · Community | Ayoub Fandi launches the first podcast dedicated to GRC Engineering with episode S1E1 — "The Who, the Why and the What." | First sustained public conversation series for the discipline; grew the community beyond conference talks. | https://www.youtube.com/watch?v=vupO7TxBWpM |
| Jul 2024 | July 15, 2024 | GRC Engineering Manifesto published | Engineer · Community | A community-authored manifesto codifying the principles of GRC Engineering at grc.engineering. | Crystallized the discipline's values — engineering practices, automation, design thinking — into a shared artifact. | https://grc.engineering/ |

---

## Terms

Vocabulary that distinguishes GRC Engineering thinking from legacy GRC.

| Term | Description |
|---|---|
| **Active Testing** | Exercising controls to confirm they function—not just checking they exist. Analogous to software automated tests. |
| **Control Monitoring** | Observing whether controls operate as intended. GRC Engineering automates this continuously and holistically. |
| **Decision Support** | Providing data, analysis, and options so stakeholders make informed risk decisions. Replaces the "accountability police" model. |
| **Design Thinking** | Human-centered problem-solving methodology. Harnessed to make the right thing to do the easy thing to do. |
| **ELMR** | Evidence, Logic, Math, Reason. The GRC Engineering alternative to FUD—grounded in verifiable data and sound reasoning. |
| **Evidence Populations** | Complete control records collected automatically over a period. Eliminates sampling risk with full coverage. |
| **Evidence Samples** | Legacy subset of records selected to demonstrate control operation. Incomplete and vulnerable to selection bias. |
| **FUD** | Fear, Uncertainty, and Doubt. Legacy fear-based risk communication used to justify budget without rigorous analysis. |
| **GRC as a Product** | Treating GRC programs as products serving internal and external customers, with user research, feedback loops, and measurable outcomes. |
| **Heatmaps** | Legacy likelihood × impact matrices on ordinal scales. Obscure actual risk magnitude behind coarse, subjective categories. |
| **Histograms** | Frequency-distribution charts conveying risk shape, range, and confidence intervals in objective, data-driven terms. |
| **Monte Carlo Simulations** | Probabilistic simulations producing distributions and histograms instead of single-point estimates and heatmaps. |
| **Policy-as-Code (PaC)** | Policies written as executable code; the code *is* the source of truth, enabling version control, testing, and deterministic enforcement. |
| **Policy-from-Code** | Deriving policy documentation from code, configurations, or runtime behavior. Closes the gap between docs and control reality. |
| **Policy-to-Code** | Translating human-readable policy documents into executable code, bridging policy authors and enforcement systems. |
| **Qualitative Risk Analysis** | Subjective High/Medium/Low scales based on expert judgment. Manual, inconsistent, and difficult to aggregate. |
| **Quantitative Risk Analysis** | Numerical models, probability distributions, and measurable data. Automated, reproducible, and comparable across scenarios. |
| **Risk Scenarios** | Holistic descriptions combining threat + attack vector + affected asset + impact into a single analyzable unit. |
| **Scientific Pedagogy** | Evidence-based learning science—spaced repetition, scenario-based exercises, measurable retention—applied to security training. |
| **Systems Thinking** | Examining how components interrelate and work together over time within larger systems. Applied across governance, risk analysis, and control modeling. |
| **Threat-Informed** | Grounding policies, controls, and trainings in real-world threat intelligence rather than abstract framework checklists. |
| **TPCM** | Third-party compliance management. Legacy questionnaire-focused approach that conflates compliance with risk. |
| **TPRM** | Third-party risk management. Balanced third + first-party focus, evaluating real-world threat scenarios and value-at-risk. |

---

## Tools

Open-source and commercial tools that enable GRC Engineering practices — policy-as-code, continuous compliance, evidence automation, quantitative risk, and compliance-as-code.

| Tool | Description |
|---|---|
| [**Ansible**](https://www.ansible.com/) | Policy-as-code via playbooks and roles; continuous compliance through idempotent automated configuration enforcement. |
| [**Checkov**](https://www.checkov.io/) | Static IaC scanner (Terraform, CloudFormation, Kubernetes, ARM…); policy-as-code and continuous compliance in CI/CD. |
| [**Chef**](https://docs.chef.io/inspec/7.0/) | Continuous compliance via [InSpec](https://docs.chef.io/inspec/7.0/)'s human-readable audit DSL; [Policyfiles](https://www.chef.io/blog/policy-as-code-with-chef-mastering-policyfiles) express policy-as-code for environment configuration. |
| [**claude-grc-engineering**](https://github.com/GRCEngClub/claude-grc-engineering) | Claude Code plugin suite for evidence collection, SCF crosswalks, multi-framework gap reports, and OSCAL workflows. |
| [**Cloud Custodian**](https://cloudcustodian.io/) | YAML-based rules engine for cloud governance, security, and continuous compliance with serverless auto-remediation. |
| [**CloudQuery**](https://www.cloudquery.io/) | Infrastructure-as-data platform syncing cloud and SaaS configurations into queryable databases for evidence pipelines. |
| [**Compliance to Policy (C2P)**](https://github.com/oscal-compass/compliance-to-policy) | Bridges OSCAL compliance-as-code with policy-as-code engines (Kyverno, OCM, Auditree); generates policies and ingests assessment results. |
| [**Compliance Trestle**](https://github.com/oscal-compass/compliance-trestle) | OSCAL-native compliance-as-code platform for CI/CD authoring, validation, and governance of compliance artifacts in git. |
| [**Corsair**](https://grcorsair.com/) | Signs compliance findings as W3C Verifiable Credentials (Ed25519 / JWT) so any party can verify integrity without trusted intermediaries. |
| [**FAIR**](https://www.fairinstitute.org/what-is-fair) | Open standard decomposing risk into measurable factors (threat event frequency, vulnerability, loss magnitude). |
| [**Gemara**](https://gemara.openssf.org/) | OpenSSF seven-layer logical model for automated GRC engineering — standardised, machine-readable schemas (CUE) for compliance interoperability. |
| [**GigaChad GRC**](https://github.com/grcengineering/gigachad-grc) | Open-source modular GRC platform for compliance (SOC 2, ISO 27001, HIPAA), risk registers, vendor assessments, and audits. AI-powered, containerized, self-hostable. |
| [**GRC Engineering Lab Builder**](https://grc.engineering/grc_engineering_lab_builder/) | Static-site generator for hyper-personalized GRC engineering lab prompts (Claude, ChatGPT, Gemini-compatible) — [source](https://github.com/grcengineering/grc_engineering_lab_builder). |
| [**GRClanker**](https://www.grclanker.com/) | Spec-driven open-source AI GRC CLI — bring your own AI agent (Claude, Codex, Gemini…) to generate Go CLIs for FedRAMP, KEV, EPSS, SCF crosswalks. |
| [**HashiCorp Sentinel**](https://www.hashicorp.com/en/sentinel) | Embedded policy-as-code framework for Terraform, Vault, Consul, and Nomad — gates infrastructure changes pre-apply. |
| [**How to Harden**](https://github.com/grcengineering/how-to-harden) | Community-developed open-source hardening guides focused on cloud services and integration / supply-chain attack prevention. |
| [**Kubewarden**](https://www.kubewarden.io/) | CNCF Kubernetes policy engine; policies as WebAssembly modules in Rust, Go, Rego, CEL, and others. |
| [**Kyverno**](https://kyverno.io/) | Kubernetes-native policy engine that validates, mutates, and generates resource configurations at admission time. |
| [**myctrl.tools**](https://www.myctrl.tools/) | Fast, searchable reference site for security compliance controls across frameworks (FedRAMP Rev5, DoD SRG, and more). |
| [**OPA Gatekeeper**](https://open-policy-agent.github.io/gatekeeper/website/) | Kubernetes admission controller built on OPA. Enforces Rego policies on cluster resources at admission time. |
| [**Open Policy Agent (OPA)**](https://www.openpolicyagent.org/) | General-purpose policy engine for unified policy decisions across the cloud-native stack. |
| [**Open Source Cybersecurity Training**](https://github.com/emreugurlu/open-security-training) | Free SCORM-compatible interactive security & privacy training modules — phishing, CEO fraud, secure coding, and more ([live demo](https://emreugurlu.github.io/open-security-training/)). |
| [**Prowler**](https://prowler.com/) | Open-source cloud security platform. Continuous compliance across AWS, Azure, GCP, Kubernetes, M365, and more. |
| [**Pulumi Policies**](https://www.pulumi.com/docs/insights/policy/) | CrossGuard policy-as-code for Pulumi infrastructure-as-code, written in TypeScript, Python, or Go. |
| [**Puppet**](https://www.puppet.com/blog/policy-as-code#puppet-01) | Policy-as-code via Puppet manifests; continuous compliance through automated drift detection and remediation. |
| [**Rego**](https://www.openpolicyagent.org/docs/policy-language) | OPA's declarative policy language. Enables Policy-as-Code evaluation in CI/CD pipelines. |
| [**riskquant**](https://github.com/Netflix-Skunkworks/riskquant/) | Netflix's open-source library for quantifying risk via FAIR-based Monte Carlo simulations. |
| [**Salt Stack**](https://saltproject.io/) | Event-driven configuration management with policy-as-code in SLS files; continuous compliance via reactor and beacon engines. |
| [**SCF API**](https://hackidle.github.io/scf-api/) | API for the Secure Controls Framework (1,400+ controls mapped to 200+ laws, regulations, and frameworks). |
| [**ScoutSuite**](https://github.com/nccgroup/ScoutSuite) | Multi-cloud security auditing tool. Active testing against CIS, PCI DSS, and HIPAA benchmarks. |
| [**Steampipe**](https://steampipe.io/) | Cloud APIs as SQL tables. Full-state infrastructure queries for evidence populations across 100+ services. |
| [**Terraform**](https://developer.hashicorp.com/terraform/docs) | Declarative infrastructure-as-code for provisioning cloud and SaaS resources. In GRC Engineering, the version-controlled, peer-reviewed source of truth for infrastructure — plan/state output serves as audit evidence, policy-as-code (Sentinel, OPA) gates changes pre-apply, and drift detection surfaces unauthorized configuration changes. |

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
| Courses | [**CGE-P Certification**](https://cert.grcengclub.com/) | GRC Engineering Club |
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
