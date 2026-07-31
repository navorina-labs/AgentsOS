# Outreach — posts & publication content

| File | Contents |
|------|----------|
| **[PUBLICATION-PACK.md](PUBLICATION-PACK.md)** | **Full pack:** Twitter thread, HN, Reddit, LinkedIn, Dev.to, Product Hunt, release notes |
| [twitter-posts.md](twitter-posts.md) | Short Twitter-only snippets |

Image: [phase-3-twitter-card.png](../../context-os/evaluations/phase-3-twitter-card.png)

---

## Post 1 — Results (main, no @ tags)

```
We measured full-repo (A) vs domain cores (B) vs graph (C) on 149 decision-scoped questions across 4 codebases.

B ≥ A on all 4. Up to 38× fewer API tokens (CCR_tokens).

Oiloop (private): B 2.75 vs A 0.75 — prod keyword router, 0% hallucination.

Open protocol + CLI:
github.com/navorina-labs/AI-Context-OS

npx context-os init --name myapp --profile saas
```

Attach: `phase-3-twitter-card.png`

---

## Post 2 — Reply (tags, 2–4 people max)

Pick only accounts whose work you genuinely reference (RAG, agent context, coding agents):

```
Open replication — feedback welcome from folks working on context routing / coding agents.

CLI scaffolds cores + router in your repo in one command.
```

---

## Post 3 — arXiv (after upload)

```
Methods preprint: domain-oriented Context Cores for decision-scoped LLM questions.

8–38× token compression · Oiloop B 2.75 vs A 0.75 · limitations upfront (LLM judge, exploratory).

arxiv.org/abs/XXXX.XXXXX
github.com/navorina-labs/AI-Context-OS
```

Replace `XXXX.XXXXX` with real ID.

---

## Post 4 — CLI only (short)

```
context-os CLI — scaffold domain cores + keyword router for coding agents:

npx context-os init --profile saas

validate · route · stats (no API key)

github.com/navorina-labs/AI-Context-OS/tree/main/packages/cli
```

---

## Do NOT claim

- statistically significant (full bank)
- independent expert raters
- C is default on Oiloop (prod default is **B**)
