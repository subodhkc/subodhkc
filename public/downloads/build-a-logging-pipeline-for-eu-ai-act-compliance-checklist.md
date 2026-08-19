# EU AI Act Logging Pipeline Checklist

EU AI Act Article 12 requires providers of high-risk AI systems to keep automatically generated logs. The logs must enable traceability of the AI system's operation: what went in, what processing occurred, what came out, and who was involved. Most organizations approach this as a logging problem. It is not. It is a traceability problem. A log that records events but cannot reconstruct a specific past decision is not Article 12 compliant. This checklist covers the pipeline architecture I build for clients subject to EU AI Act logging requirements.

## Scope and Classification

- [ ] Determine your AI system's risk classification under the EU AI Act. Article 12 applies to high-risk systems (Annex III). If your system is limited-risk or minimal-risk, logging requirements are lighter but not zero.
- [ ] Identify what constitutes a "loggable event" for your system: input data receipt, preprocessing steps, model inference, post-processing, output delivery, human oversight actions, and system configuration changes.
- [ ] Define the retention period. The EU AI Act does not specify a fixed period, but it must be "appropriate to the intended purpose and the risk level." For high-risk systems, I recommend retaining logs for the operational lifetime of the system plus 2 years.
- [ ] Document the legal basis for log processing under GDPR. Logs that contain personal data are subject to GDPR. Retention must be justified under Article 5(1)(f) (legitimate interests) or another lawful basis.

## Log Design

- [ ] Define a canonical log schema with required fields: `timestamp` (UTC, timezone-aware), `event_type`, `actor` (user or system ID), `system_component`, `input_hash`, `output_hash`, `correlation_id`, `model_version`, `tenant_id` (if multi-tenant).
- [ ] Use structured logging (JSON). Unstructured text logs are not machine-parseable and will fail an audit.
- [ ] Include a `correlation_id` that links all log entries for a single decision end-to-end. Without this, you cannot reconstruct a specific decision from logs.
- [ ] Hash the input and output of each inference call. Store the hash, not the raw content (unless content retention is required). The hash proves that the logged input matches the actual input without storing potentially sensitive data.

## Log Collection

- [ ] Choose a logging framework that supports structured output and can handle your expected log volume. ELK Stack (Elasticsearch, Logstash, Kibana) for self-hosted. CloudWatch or Stackdriver for cloud-native. Fluentd or Fluent Bit for lightweight collection.
- [ ] Verify that the framework handles the expected throughput. A high-volume inference system generating 10,000 events per second needs a different architecture than a batch system generating 100 events per hour.
- [ ] Implement log shipping from the application to the logging pipeline with at-least-once delivery. Lost logs are a compliance gap. Use a durable queue (Kafka, SQS) between the application and the log store if the log store is not highly available.
- [ ] Validate log entries against the canonical schema before storage. Reject entries that do not conform. A log store with invalid entries is harder to audit than a log store with missing entries.

## Traceability

- [ ] Link each output to the input data and model version that produced it. The log entry for an inference must contain: input hash, model version, output hash, and the processing steps in between.
- [ ] Maintain a model registry that records: model version, training data hash, training configuration, deployment timestamp, and deployment status (active, superseded, rolled back).
- [ ] Log the full decision path: input receipt, preprocessing, feature extraction, model inference, post-processing, output delivery. Each step is a separate log entry with the same `correlation_id`.
- [ ] Verify that any past decision can be reconstructed from logs alone. Pick a decision from 30 days ago and trace it through the logs. If you cannot reconstruct what happened, the logging pipeline is not Article 12 compliant.

## Data Integrity and Security

- [ ] Make logs append-only. In PostgreSQL, use triggers to prevent UPDATE and DELETE on log tables. In Elasticsearch, use the immutable index pattern with no update API enabled.
- [ ] Hash-chain log entries to detect tampering. Each entry stores the hash of the previous entry. A break in the chain is a tamper signal.
- [ ] Encrypt logs at rest (AES-256) and in transit (TLS 1.2+). Manage keys in a dedicated KMS.
- [ ] Restrict log access to authorized compliance and security personnel. Log all access to the logging system (meta-audit).
- [ ] Implement per-tenant access control if the system is multi-tenant. One tenant's logs must not be accessible by another tenant's administrators.

## Retention and Disposal

- [ ] Define the retention period based on the EU AI Act requirement and your organizational policy. Document the decision and its rationale.
- [ ] Implement automated retention enforcement. Logs older than the retention period should be archived to cold storage or securely deleted. Do not rely on manual cleanup.
- [ ] Document the disposal method. Secure deletion (cryptographic erasure or DoD 5220.22-M) for logs containing personal data. Simple deletion is not sufficient for GDPR compliance.
- [ ] Test that expired logs are actually deleted and cannot be recovered. A "deleted" log that is still in a backup is not deleted.

## Verification

- [ ] Run a traceability test: pick a past decision, reconstruct it entirely from logs, and verify the reconstruction matches the actual output that was delivered.
- [ ] Verify that logs survive system restarts and failures. Kill the application and confirm the logging pipeline continues collecting from other sources.
- [ ] Test that log timestamps are synchronized across all components. Check NTP status on all servers.
- [ ] Test tamper detection: modify a log entry and confirm the hash chain verification job detects the break and alerts.
- [ ] Validate that log exports are complete and machine-readable. An auditor will ask for a log export. It must be in a format they can parse.

## Evidence to Collect

- Logging pipeline architecture diagram
- Canonical log schema documentation
- Model registry configuration
- Sample traceability reconstruction (input to output from a past decision)
- Hash chain verification job configuration and results
- Retention policy and enforcement records
- Access control policy for log storage
- Tamper-detection test results
- Log export sample in machine-readable format

---
Subodh KC
AI Advisor & AI Systems Architect
subodhkc.com
