# arXiv submission — AI Context OS methods preprint

**Paper source:** [paper-draft.md](paper-draft.md)  
**Status:** Ready for methods preprint (see [CRITICAL-REVIEW.md](../research/CRITICAL-REVIEW.md))  
**Synthesis:** [SYNTHESIS.md](../research/SYNTHESIS.md)

---

## 1. Metadata

| Field | Value |
|-------|-------|
| **Title** | Domain-Oriented Context Cores: Bounded Context for AI Decision Support in Software Projects |
| **Authors** | Alexander Young |
| **Primary category** | `cs.SE` (Software Engineering) |
| **Secondary** | `cs.AI` |
| **Comments** | 12 pages, 4 tables; code and raw runs at https://github.com/navorina-labs/AI-Context-OS |

---

## 2. Build PDF (local)

**Primary:** LaTeX preprint style ([`arxiv.sty`](arxiv.sty) — community arXiv template) via [Tectonic](https://tectonic-typesetting.github.io/).

```bash
cd papers
./build.sh
```

Manual:

```bash
cd papers
pandoc paper-draft.md -o arxiv-paper.pdf \
  --template=arxiv-pandoc.latex \
  --pdf-engine=tectonic \
  --syntax-highlighting=none
```

**Outputs:** `arxiv-paper.pdf`, `arxiv-paper.tex` (for arXiv source upload with `arxiv.sty`), and a browsable `arxiv-paper.html`.

**Requires:** `pandoc`, `tectonic` (`brew install tectonic`).

**Legacy (HTML):** Chrome headless from HTML is deprecated; use LaTeX for publication-quality layout.


---

## 3. Upload checklist (arxiv.org)

1. Register / log in at https://arxiv.org/user/
2. **Start new submission** → Continue
3. **Add authors:** Alexander Young
4. **Title & abstract** — copy from `paper-draft.md` §Abstract
5. **Categories:** cs.SE (primary), cs.AI (secondary)
6. **Upload files:**
   - `arxiv-paper.pdf` (main)
   - Optional: `paper-draft.md` as ancilliary
7. **License:** arXiv.org perpetual non-exclusive license (default)
8. **Comments:** link to GitHub repo + `research/SYNTHESIS.md`

---

## 4. Abstract (copy-paste)

**Plain text file:** [arxiv-abstract.txt](arxiv-abstract.txt) (no markdown bold).

Or use the abstract block from [paper-draft.md](paper-draft.md). Ensure these phrases stay:

- exploratory A/B/C, four codebases, 149 questions
- CCR_tokens 8×–38×
- Oiloop Phase 3.1: B 2.70 vs A 0.75; prod router B **2.75**, hall **0%**
- author-rated blind pilot 70% B-preferred, 30% equal (n=10) — **not** independent experts
- Django aggregate-only caveat
- replication repo URL

---

## 5. After submission

- [ ] Add arXiv ID to `paper-draft.md` header
- [ ] Add badge/link in [README.md](../README.md) Results section
- [ ] Tweet #2 with arXiv link + Phase 3.1 numbers
- [ ] Update [validity-audit.md](../research/validity-audit.md) with arXiv cite

---

## 6. What this preprint is NOT

- Not a conference camera-ready (human independent raters still open)
- Not claiming statistical significance on full 149 Q bank
- Not claiming C is default on Oiloop (prod default is **B**)
