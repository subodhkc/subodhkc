# RAG Row-Level Security Checklist for Multi-Tenant AI

Multi-tenant RAG systems have one failure mode that dwarfs all others: a user in Tenant A retrieves chunks from Tenant B's data. This is not a rare edge case. It is the most common production incident in multi-tenant AI. The cause is almost always a missing or incorrect row-level security (RLS) policy on the vector store. This checklist covers the specific steps I take to prevent cross-tenant data leakage in RAG architectures built on PostgreSQL with pgvector and Supabase RLS.

## Threat Model

- [ ] Document the tenant isolation requirement: what data is tenant-specific, what is shared, and what happens if cross-tenant access occurs. This is not a hypothetical. It is the primary attack surface.
- [ ] Identify all entry points where a user query reaches tenant-scoped data: the vector search, the metadata filter, the LLM prompt construction, and the response formatting. Each one is a potential leakage point.
- [ ] Define the blast radius of a single RLS failure: one query returns one wrong chunk, or one query returns all chunks from another tenant? Design for the worst case.

## Database Configuration

- [ ] Use PostgreSQL with pgvector for the vector store. Supabase provides managed pgvector with RLS support. If you are using a standalone vector database (Pinecone, Weaviate), verify it supports namespace or metadata-based isolation at the query level.
- [ ] Add a `tenant_id` column to every table that stores tenant-scoped data, including the vector embeddings table. This column is the foundation of RLS.
- [ ] Create a B-tree index on `tenant_id` in the embeddings table. Vector searches with a tenant filter will use this index to prune the search space before the vector index is applied.
- [ ] Verify that the `tenant_id` column is NOT NULL on tenant-scoped tables. A NULL tenant_id can bypass RLS policies if the policy logic is not careful.

## RLS Policy Design

- [ ] Enable RLS on every tenant-scoped table. `ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;`
- [ ] Write RLS policies that filter on `tenant_id` using the authenticated user's tenant context. The policy should be: `USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid)`.
- [ ] Set the tenant context at the beginning of every database session or transaction. In Supabase, this is done via `set_config('app.current_tenant_id', $tenantId, true)` in a security definer function called at the start of the request.
- [ ] Verify that the RLS policy applies to SELECT, INSERT, UPDATE, and DELETE. A common mistake is to enable RLS for SELECT only and forget that INSERT also needs protection.
- [ ] Test the RLS policy with two users from different tenants. Query as Tenant A's user and confirm zero rows from Tenant B are returned. This is not a code review exercise. Run the query.

## Query-Time Enforcement

- [ ] Always include `tenant_id` in the vector search query as a metadata filter, even though RLS should enforce it. Defense in depth: RLS is the backstop, the metadata filter is the primary enforcement.
- [ ] Verify that the Supabase client used for vector queries is authenticated as the user, not as the service role. Service role keys bypass RLS. If your API route uses the service role key for vector queries, RLS is not protecting you.
- [ ] Log the tenant context for every vector query. If a cross-tenant leak occurs, you need to trace which request set the wrong tenant context.
- [ ] Implement a pre-query validation step: verify that the authenticated user belongs to the tenant_id being queried. Do not trust the client to send the correct tenant_id.

## Embedding Pipeline

- [ ] Tag every embedding with `tenant_id` at insertion time. The embedding pipeline must not write to the vector store without a tenant_id.
- [ ] Verify that the embedding pipeline uses the service role key (which bypasses RLS) only for insertion, never for retrieval. If the same key is used for both, RLS is bypassed on retrieval.
- [ ] Implement a backfill process for existing embeddings that lack `tenant_id`. Untagged embeddings are a security risk. Either tag them or delete them.
- [ ] Test that deleting a tenant's data removes all their embeddings. Run `DELETE FROM embeddings WHERE tenant_id = $tenantId` and verify the count drops to zero.

## LLM Prompt Construction

- [ ] Construct the LLM prompt using only chunks returned by the RLS-protected query. Do not pass chunks from a cache, a previous query, or a service-role query to the prompt.
- [ ] Verify that the prompt does not include tenant identifiers from other tenants in retrieved metadata. If a chunk's metadata includes a tenant name, and that name is visible in the prompt, the model may leak it in the response.
- [ ] Log the chunks passed to the LLM prompt for audit purposes. If a user reports seeing another tenant's data, this log is your investigation trail.

## Penetration Testing

- [ ] Test cross-tenant retrieval: authenticate as Tenant A's user, query for terms that exist in Tenant B's documents, and confirm zero results from Tenant B.
- [ ] Test tenant context manipulation: send a request with Tenant B's tenant_id while authenticated as Tenant A's user. Confirm the server rejects the mismatch or RLS blocks the query.
- [ ] Test service role bypass: attempt to call the vector search API with a service role key from the client side. Confirm the API route rejects client-side service role usage.
- [ ] Test embedding injection: insert an embedding with Tenant A's tenant_id while authenticated as Tenant B's user. Confirm RLS blocks the insert.

## Monitoring

- [ ] Monitor for queries that return zero results. A sudden increase in zero-result queries for a specific tenant may indicate an RLS policy is too restrictive or the tenant context is being set incorrectly.
- [ ] Alert on any query that returns chunks from multiple tenants. This should never happen in a correctly configured system. If it does, page someone immediately.
- [ ] Audit the tenant context setting weekly. Verify that every authenticated request sets the tenant context before any tenant-scoped query runs.

## Evidence to Collect

- Threat model document with blast radius analysis
- RLS policy definitions (SQL)
- Tenant isolation penetration test results (all four test scenarios)
- Embedding pipeline tenant_id tagging verification
- LLM prompt construction audit log sample
- Monitoring configuration and alert history
- Weekly tenant context audit results

---
Subodh KC
AI Advisor & AI Systems Architect
subodhkc.com
