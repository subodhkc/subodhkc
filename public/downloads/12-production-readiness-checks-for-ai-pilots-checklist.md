# 12 Production Readiness Checks for AI Pilots

Most AI pilots fail in the gap between "it works in the notebook" and "it works when someone is watching at 3 AM." This checklist covers the 12 checks I run before signing off on a pilot going to production. Each one exists because I have seen a pilot fail without it.

## 1. Data Integrity

- [ ] Run automated schema validation on every input batch. Reject rows that do not match the training schema, do not silently coerce them.
- [ ] Verify that production data distributions match training distributions within a defined threshold ( Population Stability Index < 0.2 for key features).
- [ ] Confirm that PII fields are tokenized or hashed before they reach the model inference layer.
- [ ] Document the data lineage: source system, transformation steps, pipeline owner, SLA for freshness.

## 2. Model Performance Under Load

- [ ] Run load tests at 2x expected peak QPS using Locust or k6, not just Apache JMeter.
- [ ] Measure p50, p95, and p99 inference latency separately. Production readiness requires p99 < 800ms for synchronous endpoints and < 2s for batch endpoints.
- [ ] Verify graceful degradation when the model service is slow: does the application timeout and return a fallback, or does it hang the request thread?
- [ ] Check GPU memory headroom. If utilization exceeds 85% at peak, the next model version will OOM.

## 3. Security

- [ ] Run OWASP LLM Top 10 assessment: prompt injection, training data poisoning, sensitive information disclosure, insecure output handling.
- [ ] Verify that model API keys are stored in a secrets manager (AWS Secrets Manager, HashiCorp Vault), not in environment variables on the application server.
- [ ] Confirm that inference endpoints require authentication. No anonymous access to production model APIs.
- [ ] Test that rate limiting is enforced per-tenant, not just globally.

## 4. Regulatory Compliance

- [ ] Map the AI system to applicable regulations: EU AI Act risk classification, GDPR Article 22 (automated decisions), HIPAA (if PHI), NYC Local Law 144 (if automated employment decisions), TRAIGA (if operating in Texas).
- [ ] Document the risk classification decision and its rationale. If you classified your system as "limited risk," state why it is not "high risk."
- [ ] Confirm that human oversight exists for any decision classified as high-risk under the EU AI Act.

## 5. Operational Readiness

- [ ] Deploy monitoring for four signals: latency, error rate, saturation, and model output distribution. The first three are standard SRE. The fourth catches silent model drift.
- [ ] Verify that alerts page a human, not just write to a log. A dashboard nobody watches is not monitoring.
- [ ] Test failover: kill the primary model container and confirm the load balancer routes to the replica within 30 seconds.
- [ ] Document the on-call runbook for model incidents. "Restart the container" is not a runbook.

## 6. Scalability

- [ ] Verify that the inference pipeline scales horizontally. If you can only scale vertically (bigger GPU), document the cost ceiling.
- [ ] Test autoscaling: confirm that a traffic spike triggers a new container before p99 latency exceeds the SLO.
- [ ] Check that the vector database (if RAG) handles concurrent queries at peak without connection pool exhaustion.

## 7. User Acceptance Testing

- [ ] Run UAT with real users on real data, not the product team on synthetic data.
- [ ] Collect structured feedback: was the output correct, was it fast enough, would you trust this in production. Five-point Likert, not free text.
- [ ] Address every "would not trust" response before launch. That is your bug list.

## 8. Integration Testing

- [ ] Verify that the AI system handles upstream API failures gracefully. If the CRM is down, does the model still serve cached results or does the entire pipeline fail?
- [ ] Test idempotency: if the same inference request is sent twice (network retry), does the system return the same result without double-charging or double-logging?
- [ ] Confirm that webhook callbacks from the AI system to downstream services are signed and verified.

## 9. Data Privacy Impact Assessment

- [ ] Complete a DPIA per GDPR Article 35 if the system processes personal data at scale or makes automated decisions.
- [ ] Document what data is retained, for how long, and under what legal basis. "We keep everything forever" is not a retention policy.
- [ ] Verify that data subject deletion requests can be fulfilled within 30 days, including from model training logs and vector store indexes.

## 10. Bias and Fairness

- [ ] Test model outputs across demographic segments relevant to your use case. If you cannot measure fairness because you do not collect demographic data, document that decision and its risk.
- [ ] Set a fairness threshold and define what happens when it is breached. "We will look into it" is not a remediation plan.
- [ ] Review the training data for representation gaps. A model trained on data from three states should not be deployed nationally without a coverage assessment.

## 11. Rollback Plan

- [ ] Document the rollback procedure: how to revert to the previous model version, how long it takes, and who has authority to execute it.
- [ ] Test the rollback in staging. A rollback plan that has never been executed is a hypothesis.
- [ ] Confirm that feature flags can disable the AI component without disabling the entire application.

## 12. Cost and Unit Economics

- [ ] Calculate the cost per inference at expected production volume. Include compute, API calls, vector store queries, and human review time.
- [ ] Set a cost ceiling alert. If inference cost exceeds 120% of forecast for three consecutive days, page someone.
- [ ] Verify that the business model supports the inference cost. A $0.50 inference on a $1 transaction is not sustainable.

## Sign-Off

Before production launch, get written sign-off from:
- [ ] Engineering lead (architecture, monitoring, rollback)
- [ ] Compliance or legal (regulatory classification, DPIA)
- [ ] Business owner (cost, user acceptance, success criteria)

## Evidence to Collect

- Load test results with p50/p95/p99 latency numbers
- Security assessment report (OWASP LLM Top 10)
- DPIA document with retention schedule
- Bias analysis results with demographic breakdown
- Rollback test execution log
- Cost-per-inference calculation
- UAT feedback summary with trust scores
- On-call runbook for model incidents

---
Subodh KC
AI Advisor & AI Systems Architect
subodhkc.com
