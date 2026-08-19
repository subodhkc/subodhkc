# HIPAA-Compliant AI Checklist

HIPAA compliance for AI systems is not a checkbox exercise. The Security Rule (45 CFR 164.308-164.312) specifies administrative, physical, and technical safeguards that apply to any system handling electronic Protected Health Information (ePHI). When you add an AI layer, you introduce new attack surfaces: model inference logs, training data residuals, prompt-level PHI exposure, and vendor model APIs that may retain inputs. This checklist covers the specific steps I take when building AI systems for healthcare clients.

## Scope and Inventory

- [ ] Identify every AI system that will process, train on, or infer from ePHI. Include internal models, vendor APIs (OpenAI, Anthropic, Google), and embedded ML features in third-party software.
- [ ] Classify each system: does it process ePHI at rest, in transit, or both? Does it generate new ePHI (diagnostic suggestions, risk scores)?
- [ ] Maintain a written inventory of all AI assets handling ePHI, including model versions, deployment locations, and data flow diagrams. 45 CFR 164.308(a)(7)(A) requires this for contingency planning.

## Business Associate Agreements

- [ ] Obtain a signed BAA from every AI vendor whose service touches ePHI. This includes LLM API providers, vector database hosts, and cloud training platforms. No BAA, no ePHI. Period.
- [ ] Verify that the BAA covers subprocessors. If your LLM vendor uses a cloud provider for inference, that cloud provider must also be covered.
- [ ] Review BAAs annually. Vendor terms change. A BAA signed two years ago may not cover new features the vendor has added.
- [ ] Document the BAA status for every vendor. If a vendor refuses to sign a BAA, they cannot process ePHI. Route their component through a PHI-stripping layer or replace them.

## Encryption (45 CFR 164.312(a)(2)(iv) and (e)(2)(ii))

- [ ] Encrypt ePHI at rest using AES-256. Verify the encryption is database-level or volume-level, not just application-level. Application-level encryption that stores keys in the same database is not encryption.
- [ ] Encrypt ePHI in transit using TLS 1.2 or higher. Disable TLS 1.0 and 1.1 at the load balancer. Test with SSL Labs and verify the grade is A or higher.
- [ ] Manage encryption keys in a dedicated KMS (AWS KMS, Google Cloud KMS, Azure Key Vault). Keys must not be co-located with the data they encrypt.
- [ ] Rotate encryption keys on a defined schedule. Document the rotation procedure and test it.

## Access Control (45 CFR 164.312(b))

- [ ] Implement role-based access control (RBAC) for all AI systems processing ePHI. Define the minimum necessary access for each role per 45 CFR 164.502(b).
- [ ] Require multi-factor authentication for all access to AI systems handling ePHI. SMS-based MFA is not sufficient for production healthcare systems. Use TOTP or hardware keys.
- [ ] Implement per-tenant isolation if the AI system serves multiple healthcare organizations. One organization's ePHI must not be accessible to another. Test this with a tenant isolation penetration test.
- [ ] Log every access to ePHI through the AI system. Logs must include: user ID, timestamp, action, resource accessed, and purpose. 45 CFR 164.312(b) requires audit controls.

## Model-Specific HIPAA Considerations

- [ ] Verify that the LLM vendor does not retain inputs for model training. OpenAI's API and Azure OpenAI provide zero data retention configurations. Enable them.
- [ ] Strip PHI from prompts before sending to vendor APIs if the vendor does not have a BAA. Use a PHI detection and redaction layer (Presidio, AWS Comprehend Medical) as a preprocessing step.
- [ ] Confirm that model inference logs do not contain raw ePHI. Logs often capture the full request payload. If the payload contains PHI, the log is a PHI repository and must be treated as such.
- [ ] Verify that vector store embeddings do not reconstruct ePHI. Embeddings of PHI text are not clearly de-identified. Treat the vector store as a PHI repository unless you can demonstrate the embeddings cannot be inverted.

## Audit Controls and Logging (45 CFR 164.312(b))

- [ ] Implement immutable audit logs for all AI system interactions involving ePHI. Use append-only storage or hash-chained logs.
- [ ] Send audit logs to a SIEM (Splunk, Datadog, Elastic Security) with alerts for anomalous access patterns: bulk queries, off-hours access, access by service accounts from interactive sessions.
- [ ] Retain audit logs for a minimum of 6 years per 45 CFR 164.530(j). Verify the retention policy is enforced automatically, not manually.

## Breach Notification Readiness (45 CFR 164.404)

- [ ] Define the breach notification workflow: who determines if an incident is a breach, who notifies the Secretary of HHS, who notifies affected individuals, and within what timeframe (60 days for individual notification).
- [ ] Document the risk assessment process for determining if an impermissible use or disclosure is a reportable breach.
- [ ] Test the breach notification workflow with a tabletop exercise. A process that has never been practiced will fail under pressure.

## Vendor Monitoring

- [ ] Monitor AI vendor compliance quarterly. Review their SOC 2 Type II report, HITRUST certification, or equivalent. A BAA is necessary but not sufficient.
- [ ] Track vendor model updates. When a vendor releases a new model version, verify that the update does not change data handling terms or introduce new subprocessors.
- [ ] Maintain a vendor risk register. Record incidents, findings, and remediation status for each AI vendor.

## Workforce Training (45 CFR 164.308(a)(5))

- [ ] Train every team member with access to the AI system on HIPAA requirements specific to AI: prompt-level PHI exposure, inference log risks, vendor data retention.
- [ ] Document training attendance and content. Auditors will ask for this.
- [ ] Include AI-specific scenarios in security awareness training: what to do if a model output contains PHI from another patient, what to do if a vendor API returns unexpected data.

## Evidence to Collect

- AI asset inventory with data flow diagrams
- Signed BAAs for all AI vendors (with subprocessor coverage)
- Encryption configuration documentation (at rest, in transit, key management)
- RBAC policy and access review records
- Tenant isolation penetration test results
- Audit log configuration and sample entries
- Breach notification workflow documentation
- Tabletop exercise results
- Vendor SOC 2 / HITRUST reports
- Training materials and attendance records

---
Subodh KC
AI Advisor & AI Systems Architect
subodhkc.com
