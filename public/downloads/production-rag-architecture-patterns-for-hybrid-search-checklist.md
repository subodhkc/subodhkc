# Production RAG Architecture Checklist

Retrieval-Augmented Generation (RAG) is the standard pattern for grounding LLM outputs in enterprise data. Most RAG implementations fail in production for the same reasons: retrieval returns irrelevant chunks, the vector store becomes a bottleneck under load, and nobody monitors whether the model is actually using the retrieved context. This checklist covers the architecture decisions that separate a demo RAG pipeline from one that runs in production.

## Use Case Definition

- [ ] Define the specific questions the RAG system must answer. "Search our documents" is not a use case. "Answer customer support questions using our knowledge base" is.
- [ ] Identify the source documents: type, volume, update frequency, and access control requirements. A RAG system over 10,000 public docs is a different architecture than one over 500 access-controlled internal docs.
- [ ] Define the success metric: answer accuracy, retrieval precision, latency, or cost per query. You cannot improve what you do not measure.
- [ ] Determine the acceptable hallucination rate. Zero is not achievable. Define what level of inaccuracy is acceptable for your use case and what mitigation is required (human review, citations, confidence scoring).

## Data Pipeline

- [ ] Choose a chunking strategy based on your document structure. Fixed-size chunks (512-1024 tokens) work for generic text. Section-based chunking works for structured documents. Sentence-aware chunking works for legal and technical text.
- [ ] Preserve metadata in each chunk: source document, page number, section title, access control group. Without metadata, you cannot cite sources or enforce permissions.
- [ ] Implement a re-indexing pipeline for when source documents change. Stale embeddings produce stale answers. Schedule re-indexing based on document update frequency.
- [ ] Verify that the pipeline handles document versioning. If a policy document is updated, the old version's embeddings should be removed or marked as superseded.

## Retrieval System

- [ ] Choose between pure vector search, keyword search, or hybrid search. Hybrid search (vector + BM25) outperforms pure vector search on most enterprise corpora. Use it unless you have a specific reason not to.
- [ ] Configure the vector database (Pinecone, Weaviate, pgvector, Qdrant) for your scale. Under 100K chunks, pgvector is sufficient. Over 1M chunks, a dedicated vector database is necessary.
- [ ] Set the top-k retrieval count based on your chunk size and model context window. Start with k=5 for 512-token chunks. Adjust based on recall testing.
- [ ] Implement a reranking step (Cohere Rerank, cross-encoder model) after retrieval. Reranking the top 20 results down to the top 5 improves precision significantly.
- [ ] Test retrieval precision with a set of 50 known questions and their expected source documents. Measure: did the correct chunk appear in the top-k results? Target: 85% or higher.

## Generation Layer

- [ ] Choose a model that fits your latency and accuracy requirements. GPT-4-class models for high-stakes answers. GPT-4o-mini or Claude Haiku for high-volume, lower-stakes queries.
- [ ] Structure the prompt to force citation: "Answer the question using only the provided context. Cite the source for each claim." Without this instruction, the model will mix retrieved context with parametric knowledge.
- [ ] Implement a fallback for when retrieval returns no relevant results. The system should say "I could not find information about that" rather than hallucinating an answer from parametric knowledge.
- [ ] Configure output parsing to extract citations and verify they match the retrieved chunks. If the model cites a source that was not in the context, flag it.

## Security and Access Control

- [ ] Enforce document-level access control in the retrieval layer. If a user does not have permission to see a document, the vector search must not return chunks from that document. This requires metadata-based filtering at query time.
- [ ] For multi-tenant systems, implement tenant isolation at the vector store level. Use namespace separation (Pinecone) or row-level security (pgvector with Supabase RLS).
- [ ] Verify that the LLM API call does not leak access-controlled content to users who should not see it. The model will faithfully reproduce restricted content if it appears in the retrieved context. Filter before generation, not after.
- [ ] Log every query with: user ID, tenant ID, retrieved chunk IDs, model response. This is your audit trail for access violations and hallucination incidents.

## Monitoring

- [ ] Track retrieval metrics: query latency, top-k relevance (if you have ground truth), cache hit rate.
- [ ] Track generation metrics: response latency, token usage, citation accuracy, user feedback (thumbs up/down).
- [ ] Monitor for drift: as documents are added or updated, does retrieval quality change? Set up a weekly regression test with your 50-question test set.
- [ ] Alert on: retrieval latency p95 > 500ms, generation latency p95 > 3s, citation accuracy < 80%, user negative feedback rate > 15%.

## Deployment Verification

- [ ] Run a 100-query pilot with real users. Measure answer accuracy, retrieval precision, and user satisfaction.
- [ ] Test the system under load: 50 concurrent queries. Verify the vector store and model API handle concurrency without timeout.
- [ ] Verify that re-indexing does not cause downtime. The system should serve queries from the old index while the new index is building.
- [ ] Test access control enforcement: query as a user with restricted permissions and confirm restricted documents do not appear in results.

## Evidence to Collect

- Use case definition with success metrics
- Chunking strategy documentation with metadata schema
- Retrieval precision test results (50-question test set)
- Reranking configuration and precision improvement
- Access control enforcement test results
- Monitoring dashboard configuration
- 100-query pilot results with user feedback
- Load test results

---
Subodh KC
AI Advisor & AI Systems Architect
subodhkc.com
