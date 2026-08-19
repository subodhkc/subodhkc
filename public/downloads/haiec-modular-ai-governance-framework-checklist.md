# HAIEC Modular AI Governance Checklist

HAIEC is a modular governance platform designed for organizations that need to demonstrate compliance with the EU AI Act, NIST AI RMF, and ISO 42001 without building a custom framework from scratch. This checklist covers the four core modules: Compliance Engine, Red Audit Kit, Precision Drift Detection, and LegacyShift. Each section includes the specific configuration and verification steps I run during implementation.

## Inventory Before Implementation

- [ ] List every AI system in production and development. For each, record: model type, data sources, deployment environment, risk classification under the EU AI Act, and responsible owner.
- [ ] Identify which systems fall under high-risk classification (EU AI Act Annex III) and which are limited-risk or minimal-risk. The compliance burden differs by category.
- [ ] Document the current state of compliance evidence. What do you already have that an auditor would accept? What is missing?
- [ ] Assign a module lead for each HAIEC component. One person owns Compliance Engine, another owns Red Audit Kit. Diffuse ownership means nothing ships.

## Compliance Engine

The Compliance Engine maps your AI systems to regulatory requirements and generates evidence automatically.

- [ ] Deploy the Compliance Engine module to your governance environment.
- [ ] Configure regulatory mapping for your jurisdiction and industry. Start with the EU AI Act and GDPR if you operate in the EU. Add HIPAA if you process PHI. Add TRAIGA if you operate in Texas.
- [ ] Set up automated compliance checks to run on a schedule, not on demand. Weekly is the minimum. Daily is better for high-risk systems.
- [ ] Configure the audit trail generator to write to an append-only store. If the audit trail can be edited, it is not an audit trail.
- [ ] Verify that compliance reports are generated without manual intervention. A process that requires a human to compile evidence is a process that will fail during an audit.

## Red Audit Kit

The Red Audit Kit performs multi-layer audits of AI systems, scoring risk across model, data, infrastructure, and operational dimensions.

- [ ] Run the Red Audit Kit against every AI system identified in your inventory.
- [ ] Review the risk score for each layer. A low overall score can mask a critical failure in one layer. Read the layer-level scores, not just the aggregate.
- [ ] Generate remediation roadmaps for any system scoring above your risk threshold. I use a threshold of 7 out of 10 for high-risk systems and 5 for limited-risk systems. Adjust based on your risk appetite.
- [ ] Document the gap analysis findings in a format that maps directly to the regulatory requirements. Auditors do not want to interpret your risk scores. They want to see "Requirement X: Met / Partially Met / Not Met."

## Precision Drift Detection

Drift detection catches the problem that kills production AI systems: the model was accurate at deployment and is now wrong, but nobody noticed.

- [ ] Integrate Precision Drift Detection into your inference pipeline. It should run on model outputs, not just inputs.
- [ ] Configure statistical drift detection using Population Stability Index for input features and output distribution monitoring for model predictions. PSI > 0.2 is a warning. PSI > 0.4 is an alert.
- [ ] Set up alerting that pages a human when drift exceeds the alert threshold. An email that sits in an inbox is not an alert.
- [ ] Establish a baseline period of at least 30 days of production data before enabling automated alerts. Without a baseline, every alert is a false positive.
- [ ] Configure the historical analysis to compare current performance against the deployment-time baseline, not just the previous month. Month-over-month comparison can hide gradual degradation.

## LegacyShift

LegacyShift handles the migration of existing AI systems into the HAIEC governance framework.

- [ ] Assess each legacy system for compliance gaps. Most legacy systems were built before the EU AI Act existed and will have significant gaps.
- [ ] Prioritize migration by risk: high-risk systems first, then systems processing personal data, then everything else.
- [ ] Create a migration plan that includes a cutover period where both the old system and the HAIEC-governed system run in parallel. Verify outputs match before decommissioning the old system.
- [ ] Document the migration decision. If you choose not to migrate a legacy system, record why and what the compliance risk is.

## CSM Alignment

Cognitive Systems Management (CSM) provides the operational framework that HAIEC runs inside.

- [ ] Map HAIEC modules to CSM execution functions: Compliance Engine to EF6-COMPLIANCE, Red Audit Kit to EF3-RISK, Precision Drift Detection to EF5-OVERSIGHT, LegacyShift to EF4-DELIVERY.
- [ ] Verify that governance decisions made through HAIEC are recorded in the CSM governance contracts, not just in HAIEC reports.

## Verification

- [ ] Run a mock audit using the Red Audit Kit against a production system. Compare the results to what a real auditor would ask for.
- [ ] Trigger a drift alert in staging and confirm the alert reaches the on-call engineer within 5 minutes.
- [ ] Verify that the Compliance Engine generates a complete evidence package for one system end-to-end: regulatory mapping, audit trail, risk score, remediation status.
- [ ] Confirm that a legacy system migration can be rolled back if the HAIEC-governed version produces different outputs.

## Evidence to Collect

- AI system inventory with risk classifications
- Compliance Engine regulatory mapping configuration
- Red Audit Kit risk scores (layer-level, not just aggregate)
- Drift detection baseline and alert history
- LegacyShift migration plans with cutover verification results
- Mock audit report
- CSM-to-HAIEC mapping document

---
Subodh KC
AI Advisor & AI Systems Architect
subodhkc.com
