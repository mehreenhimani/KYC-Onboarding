# OnboardIQ — KYC Onboarding Intelligence

A prototype dashboard for risk-based KYC triage and onboarding funnel
analytics, built around the kind of problem a Customer Identity / Onboarding
Product Manager at a digital bank (e.g. N26) owns day to day.

## The problem

Digital banks operating under EU AML/KYC regulation (AMLD, GwG) need to
balance two competing goals: keep the onboarding funnel frictionless enough
to convert new customers, while applying enhanced due diligence wherever risk
signals warrant it. Today this often means either blunt rule-based gates
(too much friction for everyone) or large manual review queues (slow, costly,
inconsistent).

## What this prototype does

**Risk triage view** — every synthetic applicant is scored against a
simplified risk-based KYC framework (document confidence, biometric liveness,
jurisdiction tier, PEP/sanctions screening, address verification, behavioral
signals). Each applicant is routed to auto-approve, fast-track, or manual
review, with a full step-by-step reasoning trace explaining *why* — the kind
of explainability regulators and compliance teams require before trusting an
automated decision.

**Funnel analytics view** — shows where applicants drop off in the onboarding
journey, broken down by jurisdiction tier and verification channel, to surface
where friction reduction is possible without weakening controls.

## Why this matters for product strategy

This directly maps to the kind of KPIs a Senior PM in a Customer Identity /
Onboarding team would own: conversion of the onboarding funnel, KYC
compliance coverage, and reducing manual review load without increasing risk
exposure.

## Tech

React + Vite + Tailwind CSS v4. All data is synthetically generated with a
seeded random generator — no real applicant data is used or required. The
reasoning trace structure is designed to be drop-in compatible with the
Claude API for a live agentic mode.

## Disclaimer

This is an independent portfolio project for demonstration purposes only. It
is not affiliated with, endorsed by, or built using any data from N26 or any
other named institution.
