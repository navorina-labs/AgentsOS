# Comparison: Knowledge Graphs vs AI Context OS

Objective comparison of four approaches to providing context for AI reasoning. No marketing claims — only trade-offs.

---

## Approaches Compared

1. **Knowledge Graph** — entities and relationships stored in a graph database
2. **GraphRAG** — graph-based retrieval augmented generation
3. **Full Repository** — entire codebase and docs as context
4. **AI Context OS** — domain-oriented context cores with routing

---

## Knowledge Graph

### What it does

Stores entities (people, services, concepts) and edges (depends_on, owns, implements) in a queryable graph.

### Strengths

- Explicit relationship modeling
- Traversal queries ("what depends on billing service?")
- Good for discovery and exploration
- Reusable across multiple query types
- Standard graph query languages (Cypher, SPARQL)

### Weaknesses

- High upfront construction cost
- Entity extraction errors propagate
- No inherent decision boundaries
- Graph completeness ≠ decision sufficiency
- Maintenance burden as project evolves
- Retrieval can return large subgraphs (same dilution problem)

### Best for

Exploratory questions, dependency analysis, "what is connected to X?"

### Weak for

Narrow decision questions ("why did revenue drop?"), questions requiring procedural knowledge (deploy steps)

---

## GraphRAG

### What it does

Combines knowledge graphs with RAG: extract subgraph relevant to query, inject into LLM prompt.

### Strengths

- Better than naive RAG for multi-hop questions
- Reduces irrelevant document chunks vs flat vector RAG
- Community detection can surface thematic clusters
- Published benchmarks show gains on complex QA

### Weaknesses

- Still retrieval-centric, not decision-centric
- Subgraph size hard to bound
- Community summaries may miss domain-specific invariants
- Construction pipeline is complex (entity extraction, summarization, clustering)
- Latency: graph traversal + summarization + LLM
- Does not define what questions a context unit should answer

### Best for

Multi-hop factual questions across documents, research synthesis

### Weak for

Operational procedures, business metric interpretation, bounded decision support

---

## Full Repository

### What it does

Loads entire project (or large slices) into LLM context window.

### Strengths

- Zero curation cost
- Nothing explicitly excluded (completeness for exploration)
- Works for "read the codebase" tasks
- No routing errors
- Simple mental model

### Weaknesses

- Massive token cost
- Attention dilution on narrow questions
- No decision boundaries
- Hallucinated cross-domain connections
- Latency scales with repo size
- Quality degrades as irrelevant context grows
- Cannot distinguish decision frames

### Best for

Broad exploration, greenfield understanding, small repositories

### Weak for

Targeted business/product/ops questions on large codebases

---

## AI Context OS

### What it does

Curates domain-oriented context cores with explicit boundaries; routes questions to minimal sufficient context before LLM.

### Strengths

- Explicit decision boundaries
- Minimal context by design
- Router audibility (which core was selected)
- Compression ratio measurable
- Cores versioned independently of codebase
- Subcore granularity without graph complexity
- Lower token cost for scoped questions

### Weaknesses

- Manual curation required (initially)
- Core drift if not maintained
- Routing errors cause wrong context (garbage in)
- Does not replace exploration use cases
- Mixed-domain questions need composition logic
- No standard tooling ecosystem yet (research stage)

### Best for

Decision-scoped questions, metric analysis, incident response, scoped implementation guidance

### Weak for

"Understand entire codebase", ad-hoc exploration, questions outside defined cores

---

## Side-by-Side Matrix

| Dimension | Knowledge Graph | GraphRAG | Full Repository | AI Context OS |
|-----------|----------------|----------|-----------------|---------------|
| Setup cost | High | Very high | None | Medium |
| Maintenance | High | High | None | Medium |
| Decision boundaries | Implicit | Implicit | None | Explicit |
| Context size (scoped Q) | Variable | Variable | Very large | Small |
| Hallucination risk (scoped Q) | Medium | Medium | High | Lower (hypothesis) |
| Exploration | Good | Good | Good | Poor |
| Scoped decisions | Medium | Medium | Poor | Good (hypothesis) |
| Auditability | Medium | Low | Low | High |
| Latency | Medium | High | High | Low (hypothesis) |

---

## Complementary Use

These approaches are not mutually exclusive:

- **Graph** can feed entity extraction for core building
- **GraphRAG** can supplement cores for multi-hop discovery
- **Full repo** remains valid for exploration mode
- **Context OS** handles decision-scoped default path

AI Context OS hypothesis: for decision-scoped questions, explicit cores outperform the other three on quality-per-token.

---

## Research Questions

1. At what repository size does full-context quality degrade below core-based quality?
2. Can GraphRAG subgraphs be bounded to match core token budgets?
3. Does hybrid (core + small graph supplement) beat either alone?
4. What is the routing error rate threshold below which cores dominate?

See [research/questions.md](../research/questions.md) and [research/experiment-design.md](../research/experiment-design.md).
