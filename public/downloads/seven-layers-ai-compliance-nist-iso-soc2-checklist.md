# Seven Layers of AI Compliance Checklist

AI compliance is not one framework. It is seven layers that must each be addressed independently and then verified together. The layers are: legal and regulatory, frameworks and standards, security testing, architecture and infrastructure, operations and monitoring, evidence and audit, and governance and culture. Skipping a layer because "we already did SOC 2" is how organizations get caught short during a regulatory inquiry. This checklist covers each layer with the specific actions I take during AI compliance implementations.

## Layer 1: Legal and Regulatory

- [ ] Identify every jurisdiction where your AI system operates or has users. EU AI Act applies if EU residents are affected. TRAIGA (Texas HB 149) applies if Texas residents are affected. NYC Local Law 144 applies if New York City residents are subject to automated employment decisions.
- [ ] Classify each AI system under the EU AI Act: prohibited, high-risk (Annex III), limited-risk, or minimal-risk. Document the classification rationale. If you classified as "limited-risk," state explicitly why the system is not high-risk.
- [ ] Create a compliance matrix mapping each regulation to each AI system. Include: regulation, requirement, system, status (met / partially met / not met), evidence location, owner.
- [ ] Review the compliance matrix with legal counsel. Compliance is a legal determination, not an engineering one. Engineering implements. Legal decides.

## Layer 2: Frameworks and Standards

- [ ] Implement the NIST AI RMF governance structure: define the GOVERN, MAP, MEASURE, and MANAGE functions. Assign owners for each function.
- [ ] Set up ISO 42001 AI management system controls. If you are already ISO 27001 certified, the 42001 controls extend your existing ISMS to cover AI-specific risks.
- [ ] Establish SOC 2 controls for AI systems: the five trust service criteria (security, availability, processing integrity, confidentiality, privacy) apply to AI systems the same way they apply to any other system. The difference is that AI introduces new risks within each criterion.
- [ ] Map the three frameworks to each other. NIST AI RMF, ISO 42001, and SOC 2 overlap significantly. A single control can satisfy requirements across all three. Document the mapping to avoid duplicate work.

## Layer 3: Security Testing

- [ ] Run an OWASP LLM Top 10 assessment: prompt injection (LLM01), insecure output handling (LLM02), training data poisoning (LLM03), model DoS (LLM04), supply chain (LLM05), sensitive information disclosure (LLM06), insecure plugin design (LLM07), excessive agency (LLM08), overreliance (LLM09), model theft (LLM10).
- [ ] Perform adversarial testing using MITRE ATLAS. Focus on evasion, data poisoning, model inversion, and model extraction attacks relevant to your deployment.
- [ ] Use the CSA AI Controls Matrix for vulnerability assessment. This is the most comprehensive cloud-AI security control catalog available.
- [ ] Document every identified vulnerability with: severity (CVSS), exploitability, remediation plan, and target fix date. Track to closure.

## Layer 4: Architecture and Infrastructure

- [ ] Review model selection for security: does the model provider offer zero data retention? Do they have a SOC 2 Type II report? Do they use subprocessors for inference?
- [ ] Assess data pipelines for integrity: verify that training data cannot be modified without authorization, that inference inputs are validated against the expected schema, and that outputs are checked for sensitive information leakage.
- [ ] Evaluate deployment infrastructure: are model containers isolated? Are API keys stored in a secrets manager? Is network traffic between components encrypted?
- [ ] Document secure integration patterns: how does the AI system connect to upstream data sources and downstream consumers? Each integration is an attack surface.

## Layer 5: Operations and Monitoring

- [ ] Implement drift detection for input data (PSI > 0.2 is a warning) and model outputs (distribution shift > 15% from baseline is an alert).
- [ ] Set up performance monitoring: latency, error rate, throughput, and model-specific metrics (accuracy, precision, recall if ground truth is available).
- [ ] Develop an incident response plan for AI-specific incidents: model producing harmful outputs, prompt injection attack detected, data leakage discovered, drift causing business impact. Each scenario needs a response procedure.
- [ ] Configure alerts that page a human. A dashboard that nobody watches is not monitoring. Define escalation paths and on-call rotations.

## Layer 6: Evidence and Audit

- [ ] Establish continuous evidence collection: automatically capture compliance artifacts (access logs, model version records, drift reports, security scan results) in an append-only store.
- [ ] Generate audit trails for all compliance-related activities: who approved the model for production, who changed the RLS policy, who reviewed the bias test results.
- [ ] Create compliance reports that map directly to regulatory requirements. Auditors do not want to interpret your metrics. They want to see "Requirement X: Met. Evidence: [link]."
- [ ] Define retention policies for evidence: 6 years for HIPAA audit logs, 5 years for SOC 2, per EU AI Act requirements for high-risk systems. Automate retention enforcement.

## Layer 7: Governance and Culture

- [ ] Establish an AI governance committee with defined roles: executive sponsor, legal counsel, security lead, engineering lead, and business owner. Meet monthly at minimum.
- [ ] Create an ethical review process for AI systems that affect individuals: hiring, lending, healthcare, education, criminal justice. Document the review criteria and decisions.
- [ ] Train all team members on AI compliance: what the regulations require, what the internal policies require, and what each person's responsibility is. Training is not a one-time event. Refresh annually.
- [ ] Build a culture of reporting: if someone notices a model producing biased outputs or a security gap, they must feel safe reporting it. A culture that punishes reporting ensures problems stay hidden.

## Cross-Layer Verification

- [ ] Run a mock audit: have an internal auditor or external consultant review your compliance posture against each layer. Compare to what a real regulator would ask for.
- [ ] Verify that the compliance matrix (Layer 1) is fully populated and every "not met" item has a remediation plan with a target date.
- [ ] Confirm that evidence (Layer 6) covers every control in the framework mapping (Layer 2). A control without evidence is a control that does not exist for audit purposes.
- [ ] Test the incident response plan (Layer 5) with a tabletop exercise. A plan that has never been executed is a hypothesis.

## Evidence to Collect

- Compliance matrix with regulatory mapping
- NIST AI RMF / ISO 42001 / SOC 2 control mapping
- OWASP LLM Top 10 assessment report
- MITRE ATLAS adversarial test results
- Vulnerability register with remediation status
- Architecture and integration diagrams
- Drift detection and performance monitoring configuration
- Incident response plan and tabletop exercise results
- Audit trail configuration and sample entries
- AI governance committee charter and meeting minutes
- Training materials and attendance records
- Mock audit report

---
Subodh KC
AI Advisor & AI Systems Architect
subodhkc.com
