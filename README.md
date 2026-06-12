# OnboardIQ

> **AI-powered KYC onboarding risk triage with explainable agent reasoning — built for digital banking onboarding and customer identity teams.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-onboardiq--sigma.vercel.app-brightgreen)](https://kyc-onboarding-sigma.vercel.app)
[![EU AI Act](https://img.shields.io/badge/EU%20AI%20Act-Article%2013%20Compliant-blue)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)
[![Built with Claude](https://img.shields.io/badge/AI-Claude%20API-orange)](https://anthropic.com)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev)

## Screenshots

### Risk Triage — Case File View

![Risk Triage](src/Screenshots/Onboarding%20IQ%20-%20Risk%20Triage.png)

### Funnel Analytics

![Funnel Analytics](src/Screenshots/Onboarding%20IQ%20-%20Funnel%20Analytics%20.png)

---

## The Problem

Digital banks operating under EU AML/KYC regulation (AMLD, GwG) sit at the
intersection of two competing pressures:

1. **Compliance** — every new customer must pass identity verification and
   risk screening (document checks, biometric liveness, jurisdiction risk,
   PEP/sanctions screening) before activation.
2. **Conversion** — the onboarding funnel needs to stay frictionless enough
   that legitimate customers don't abandon signup.

Most onboarding systems resolve this with blunt rule-based gates — a
hardcoded "if risk score > X, send to manual review." This creates two
failure modes: borderline cases pile into manual review queues regardless
of whether a human reviewer actually needs to examine most signals, driving
up cost and delay; and when something is flagged, the reviewer has no
structured reasoning trail, just a score, making the decision slow to
resolve and hard to defend to a regulator.

**OnboardIQ solves both.**

---

## What It Does

OnboardIQ is a KYC onboarding intelligence dashboard that combines
multi-factor risk scoring with a full explainable agent reasoning trace for
every applicant, plus a funnel analytics view that surfaces where and why
applicants drop off — built to the standard of what Customer Identity and
Onboarding product teams at digital banks own.

---

## Live Demo

**[kyc-onboarding-sigma.vercel.app](https://kyc-onboarding-sigma.vercel.app)**

| Screen | Description |
| --- | --- |
| Risk Triage | Applicant ledger with filters, stamp-style routing decision, full agent reasoning trace, contributing factors breakdown |
| Funnel Analytics | Onboarding funnel by stage, completion by jurisdiction tier, completion by verification channel |

---

## Key Features

### Risk Triage — Case File View

- 240 synthetic applicants scored against a risk-based KYC framework
- Composite risk score (0–100) combining document confidence, biometric
  liveness, jurisdiction tier, PEP/sanctions screening, address mismatch,
  and behavioral signals (device velocity, VPN detection, document expiry)
- Routing decision — **Auto-Approved**, **Fast-Tracked**, or **Manual
  Review** — shown as a stamp-style badge
- Filterable ledger by routing outcome
- Full step-by-step **agent reasoning trace**: Intake → Document Check →
  Biometric Liveness → Jurisdiction & Screening → Behavioral Signals →
  Aggregate Risk Assessment → Recommendation
- Ranked **contributing factors** panel showing exactly which signals drove
  the score, and by how much

### Funnel Analytics

- Onboarding funnel across 7 stages: Registration → Personal Details →
  Document Upload → Liveness Check → Address Verification → Risk Screening
  → Account Activated
- Completion rate by jurisdiction tier (EEA vs. non-EEA)
- Completion rate by verification channel (Video Selfie + NFC, Photo ID
  Upload, Bank Redirect, In-Branch)
- Designed to surface where friction reduction is possible without
  weakening controls

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 — custom design tokens (case-file palette, serif + monospace type) |
| Data | Seeded synthetic applicant generator (240 reproducible records) |
| Reasoning engine | Structured trace generator, drop-in compatible with the Claude API for a live agentic mode |
| Deploy | Vercel |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       OnboardIQ                         │
├─────────────────────────────────────────────────────────┤
│  React Frontend (Vite + Tailwind)                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │ Applicant     │ │ Case File     │ │ Funnel        │    │
│  │ Ledger        │ │ (Reasoning    │ │ Analytics     │    │
│  │ (filterable)  │ │  Trace)       │ │ (drop-off)    │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
├─────────────────────────────────────────────────────────┤
│  Data Layer                                             │
│  ┌─────────────────────┐  ┌──────────────────────────┐ │
│  │ Synthetic Applicant │  │ Reasoning Engine          │ │
│  │ Generator (seeded,  │  │ (rule-based trace, Claude │ │
│  │ 240 records)        │  │ API-compatible structure) │ │
│  └─────────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js 18+

### Setup

```bash
# Clone
git clone https://github.com/mehreenhimani/KYC-Onboarding.git
cd KYC-Onboarding

# Install
npm install

# Run
npm run dev
```

Open `http://localhost:5173`

### Build for Production

```bash
npm run build
# Output in /dist
```

---

## Project Structure

```
onboardiq/
├── src/
│   ├── components/
│   │   ├── ApplicantLedger.jsx   # Filterable applicant list
│   │   ├── CaseFile.jsx          # Case file + reasoning trace + factors
│   │   └── FunnelAnalytics.jsx   # Funnel + jurisdiction/channel breakdown
│   ├── data/
│   │   └── generateApplicants.js # Seeded synthetic data + risk scoring
│   ├── lib/
│   │   └── reasoningEngine.js    # Step-by-step explainable trace builder
│   ├── screenshots/
│   └── App.jsx
└── README.md
```

---

## Risk Scoring & Explainability

OnboardIQ's risk model is designed around the kind of explainability EU AI
Act Article 13 expects from automated decisions in financial services:

| Signal | What it checks |
| --- | --- |
| Document confidence | OCR extraction confidence vs. 75% auto-pass threshold |
| Biometric liveness | Selfie-to-document match vs. 70% threshold |
| Jurisdiction tier | EEA vs. non-EEA — enhanced due diligence trigger |
| PEP / sanctions screening | Fuzzy match against PEP and EU consolidated sanctions lists |
| Address verification | Submitted address vs. document-issuing registry |
| Behavioral signals | Device velocity, VPN/proxy detection, document expiry |

Every routing decision (auto-approve / fast-track / manual review) is paired
with the full reasoning trace and a ranked list of contributing factors —
no black-box scores.

---

## Related Projects

| Project | Description | Live |
| --- | --- | --- |
| [PayGuard AI](https://github.com/mehreenhimani/payguard-ai) | Real-time payments fraud detection with AI-powered explainability | [Live](https://payguard-ai-sigma.vercel.app) |
| [ComplianceIQ](https://github.com/mehreenhimani/complianceiq-aml-triage) | AML alert triage platform | [Live](https://complianceiq-aml-triage.vercel.app/dashboard) |
| [RegCopilot](https://github.com/mehreenhimani/regcopilot) | EU regulatory document Q&A (EU AI Act, DORA, AMLD6, GDPR) | [Live](https://regcopilot.lovable.app) |

---

## About the Author

**Mehreen Himani** — Senior AI Product Manager with 13+ years in regulated
financial services (Credit Suisse, UBS, Standard Chartered,
Capgemini/CARIAD).

Specialist in AML/compliance AI, KYC/onboarding, EU AI Act, and sprint-level
AI product delivery.

[LinkedIn](https://linkedin.com/in/mehreenhimani) · [Portfolio](https://mehreens-ai-story.lovable.app) · [GitHub](https://github.com/mehreenhimani)

---

## Disclaimer

This is an independent portfolio project for demonstration purposes only.
All data is synthetically generated; no real applicant or customer data is
used.

## License

MIT