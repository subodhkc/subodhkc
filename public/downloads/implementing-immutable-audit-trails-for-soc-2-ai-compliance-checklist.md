# Immutable Audit Trails Checklist for SOC 2 AI Compliance

SOC 2 auditors want to see that your AI system's activity logs are tamper-proof, complete, and reconstructable. Immutable audit trails are how you prove that. The challenge is that most application databases allow updates and deletes by default. Building immutability requires deliberate architecture: append-only storage, cryptographic chaining, access control on the logs themselves, and verification jobs that detect tampering. This checklist covers the implementation steps I take when building audit trails for SOC 2-controlled AI systems.

## Scope

- [ ] Identify which SOC 2 Trust Service Criteria apply: security (always), availability, processing integrity, confidentiality, privacy. Audit trails contribute most directly to security and processing integrity.
- [ ] Define which events must be logged: data access (read, write, delete), model inference requests, configuration changes, admin actions, authentication events, and access to the audit trail itself.
- [ ] Determine the retention period. SOC 2 does not specify a fixed retention period, but 1-7 years is standard. HIPAA requires 6 years. Align with the stricter requirement if multiple regulations apply.

## Append-Only Architecture

- [ ] Store audit logs in a separate table or database from application data. If the audit log is in the same database as the application, a SQL injection or admin error can modify both.
- [ ] Design the audit table as append-only. In PostgreSQL, create a trigger that rejects UPDATE and DELETE operations on the audit table:

```sql
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable. UPDATE and DELETE are not permitted.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_update_on_audit
  BEFORE UPDATE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

CREATE TRIGGER no_delete_on_audit
  BEFORE DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();
```

- [ ] Verify that no database role has UPDATE or DELETE grants on the audit table. Check with `\dp audit_events` in psql. Revoke if necessary.
- [ ] Consider write-once-read-many (WORM) storage or object storage with object lock for long-term audit log retention. Database triggers protect against application-level modification but not against a superuser with direct database access.

## Cryptographic Integrity

- [ ] Chain each log entry to the previous one using a hash. Store `previous_hash` and `current_hash` in each row. The current hash is computed from the previous hash plus the current row's payload.
- [ ] Store the chain anchor (the hash of the first entry or a periodic checkpoint hash) in a separate, tamper-resistant store. Options: an external key management service, a cloud KMS, or a blockchain anchor if your auditor requires it.
- [ ] Implement a periodic verification job that recomputes the hash chain from the first entry to the last and compares it to the stored anchor. Run this daily at minimum.
- [ ] Log the verification results themselves. If the hash chain breaks, the verification log is your evidence that you detected it.
- [ ] Alert on hash chain verification failure. This is a security incident, not a monitoring alert. Page the security team.

## Timestamping

- [ ] Use a synchronized time source (NTP) for all log timestamps. Verify NTP is running and synchronized on all servers that write audit logs.
- [ ] Store timestamps in UTC with timezone-aware types (`timestamptz` in PostgreSQL). Do not store local time. Local time creates ambiguity during audits.
- [ ] For high-assurance environments, consider RFC 3161 trusted timestamping. This provides a third-party-verified timestamp that is difficult to dispute.

## Access Control

- [ ] Restrict audit log read access to authorized security and compliance personnel. Implement RBAC with a dedicated `audit_reader` role.
- [ ] Log all access to the audit trail. This is the meta-audit: who read the audit logs, when, and what queries they ran. A tamper attempt often starts with someone reading the logs to understand the structure.
- [ ] Review audit log access monthly. Look for: access by service accounts from interactive sessions, bulk reads, off-hours access, and access by users who should not have the `audit_reader` role.

## Encryption

- [ ] Encrypt audit logs at rest using AES-256 or equivalent. In PostgreSQL, use transparent data encryption or encrypt the underlying storage volume.
- [ ] Encrypt audit log transmission in transit using TLS 1.2 or higher. Disable older TLS versions at the load balancer.
- [ ] Manage encryption keys in a dedicated KMS (AWS KMS, Google Cloud KMS, Azure Key Vault). Keys must not be stored in the same database as the audit logs.
- [ ] Rotate encryption keys on a defined schedule (annually at minimum). Document the rotation procedure and test it before you need it.

## Verification

- [ ] Run a tamper-detection test: attempt to modify a log entry directly in the database and confirm the trigger blocks the modification. Then attempt to bypass the trigger (as superuser) and confirm the hash chain verification job detects the modification.
- [ ] Verify that log retention meets or exceeds the SOC 2 retention requirement. Test that the retention enforcement job archives or deletes logs correctly after the retention period.
- [ ] Confirm that log export functions produce complete, verifiable exports. The export should include the hash chain so an auditor can verify integrity independently.
- [ ] Test that the audit logging system continues writing logs even if the primary application fails. If the application crash takes down the audit log, you have a single point of failure.

## Evidence to Collect

- Audit trail architecture diagram
- Hash chain implementation code and verification job configuration
- Tamper-detection test results (trigger block + hash chain break detection)
- Access control policy for audit logs
- Meta-audit log sample (who accessed the audit trail)
- Encryption configuration and key rotation schedule
- Retention policy and enforcement records
- Sample audit log export with hash chain verification

---
Subodh KC
AI Advisor & AI Systems Architect
subodhkc.com
