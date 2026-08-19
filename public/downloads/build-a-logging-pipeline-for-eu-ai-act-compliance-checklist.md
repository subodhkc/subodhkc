This checklist provides actionable steps to build a logging pipeline that meets EU AI Act Article 12 compliance requirements, covering log design, collection, storage, traceability, and evidence collection.

## Preparation
- [ ] Read and understand EU AI Act Article 12 (logging requirements for high-risk AI systems).
- [ ] Identify your AI system's risk classification under the EU AI Act.
- [ ] Map all AI system components that generate loggable events (inputs, processing, outputs, human oversight).
- [ ] Define the retention period for logs (minimum: duration of system operation + regulatory requirement).
- [ ] Establish a cross-functional team (engineering, compliance, legal, data governance).

## Implementation

### 1. Define Logging Requirements
- [ ] Log all data inputs to the AI system (source, format, timestamp, hash).
- [ ] Log all processing actions (model version, parameters, inference results).
- [ ] Log all outputs (decisions, recommendations, confidence scores).
- [ ] Log user interactions (who, what, when, from where).
- [ ] Log errors, exceptions, and fallback behavior.
- [ ] Log model and pipeline configuration changes.

### 2. Choose the Right Logging Framework
- [ ] Select a framework that supports structured logging (JSON or equivalent).
- [ ] Ensure the framework can handle the expected log volume and throughput.
- [ ] Verify the framework integrates with your AI pipeline (batch, streaming, real-time).
- [ ] Common options: ELK Stack (Elasticsearch, Logstash, Kibana), Fluentd, Cloud-native logging (CloudWatch, Stackdriver).

### 3. Implement Structured Logging
- [ ] Define a canonical log schema with required fields (timestamp, event_type, actor, system_component, input_hash, output_hash).
- [ ] Use consistent field names and data types across all log sources.
- [ ] Include correlation IDs to trace a single decision end-to-end.
- [ ] Validate log entries against the schema before storage.

### 4. Ensure Traceability
- [ ] Link each output to the input data and model version that produced it.
- [ ] Maintain a model registry with version, training data hash, and deployment timestamp.
- [ ] Log the full decision path (input -> preprocessing -> model -> post-processing -> output).
- [ ] Enable reconstruction of any past decision from logs alone.

### 5. Data Integrity and Security
- [ ] Make logs append-only (no updates or deletes within retention period).
- [ ] Hash-chain log entries to detect tampering.
- [ ] Encrypt logs at rest and in transit.
- [ ] Restrict log access to authorized personnel only.
- [ ] Log all access to the logging system itself.

### 6. Retention and Disposal
- [ ] Define retention period based on EU AI Act requirements and organizational policy.
- [ ] Implement automated retention enforcement (archival then secure deletion).
- [ ] Document the retention and disposal policy.
- [ ] Test that expired logs are securely deleted and cannot be recovered.

## Verification
- [ ] Run a traceability test: pick a past decision and reconstruct it entirely from logs.
- [ ] Verify that logs survive system restarts and failures.
- [ ] Confirm that log timestamps are synchronized (NTP) and timezone-aware.
- [ ] Test that tampering with a log entry is detected by the hash chain.
- [ ] Validate that log exports are complete and machine-readable for regulatory inspection.

## Evidence to Collect
- [ ] Logging pipeline architecture diagram.
- [ ] Canonical log schema documentation.
- [ ] Sample log entries demonstrating traceability (input to output).
- [ ] Retention policy and enforcement records.
- [ ] Access control policy for log storage.
- [ ] Tamper-detection test results.

## About
Generated from: https://subodhkc.com/blog/build-a-logging-pipeline-for-eu-ai-act-compliance
