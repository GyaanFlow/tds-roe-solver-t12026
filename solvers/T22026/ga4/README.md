# 🔍 GA4 — RAG & Retrieval Engineering (T22026)

This module contains **13 advanced solvers** covering cutting-edge Retrieval-Augmented Generation (RAG) paradigms.

---

## 📋 Topics & Solver Index

| Question | Title | Type | Technical Focus |
| :---: | :--- | :---: | :--- |
| **Q1** | Hybrid-Search Chunking | `solved` | BM25 sparse keyword + dense vector hybrid retrieval. |
| **Q2** | Reciprocal Rank Fusion (RRF) | `solved` | Multi-retriever score fusion algorithm ($k=60$). |
| **Q3** | Hypothetical Document Embeddings (HyDE) | `solved` | Zero-shot hallucinated document expansion. |
| **Q4** | GraphRAG Knowledge Graphs | `solved` | Entity-relation extraction and community summary querying. |
| **Q5** | Late Chunking | `solved` | Long-context transformer token embeddings before chunk splitting. |
| **Q6** | ANN Recall/Latency Tuning | `solved` | HNSW `efSearch`/`M` tuning curves for target recall thresholds. |
| **Q7** | Semantic Caching | `solved` | Vector similarity thresholding for prompt cache hits. |
| **Q8** | Multimodal Embeddings | `solved` | Cross-modal text-image alignment and temperature scaling. |
| **Q9** | RAG Evaluation Harnesses | `solved` | Faithfulness, answer relevance, and context recall metrics. |
| **Q10** | Lost-in-the-Middle Mitigation | `solved` | Context re-ordering placing vital evidence at start and end. |
| **Q11** | Semantic Deduplication | `solved` | Chunk clustering and cosine similarity thresholding. |
| **Q12** | Vector Rerank APIs | `solved` | Cross-encoder reranker inference and score thresholding. |
| **Q13** | Grounded Answer Generation | `solved` | Citation grounding and hallucination filtering. |

---

## 🛠️ Execution & Testing

```bash
npm run check
```
