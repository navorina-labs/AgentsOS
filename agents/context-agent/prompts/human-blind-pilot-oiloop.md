# Human Blind Preference Pilot — Oiloop (10 Q)

**Purpose:** Independent validation beyond LLM-as-judge. Target: ≥60% B preferred or equal (Phase 3 exit criterion).

**Subset:** OL01, OL03, OL05, OL08, OL09, OL12, OL15, OL16, OL18, OL20 (mix single-domain + cross-cutting).

**Source run:** `experiments/oiloop/runs/run-1781660908/` — use `OL*-A.md` and `OL*-B.md` pairs.

---

## Protocol

1. **Shuffle** 10 question folders; within each, randomize A/B order (label as «Answer 1» / «Answer 2»).
2. **Mask** condition names, token counts, routing metadata.
3. **Rater:** domain expert (founder/engineer who knows Oiloop). No access to eval scores during rating.
4. **Per question**, pick: `A preferred` | `B preferred` | `Equal` | `Neither useful`.
5. **Record** in `research/human-blind-pilot-oiloop.csv`:

```csv
question_id,preference,notes
OL01,B,
...
```

6. **Decode** after all 10 rated: map Answer 1/2 back to A/B using shuffle key (keep key separate from rater).

---

## Scoring

| Metric | Formula |
|--------|---------|
| B preference rate | (B preferred + Equal) / N |
| Exit criterion | ≥ 60% |

Compare to masked decode baseline: 75% on prior canonical run.

---

## Artifacts

| File | Purpose |
|------|---------|
| `research/generate-human-blind-pilot.mjs` | Build blind questionnaire from run |
| `research/human-blind-pilot-oiloop/QUESTIONNAIRE.md` | **Give to rater** (no A/B labels) |
| `research/human-blind-pilot-oiloop/RATING-SHEET.md` | Quick checklist |
| `research/human-blind-pilot-oiloop.csv` | Record preferences (`display_id` Q01–Q10) |
| `research/human-blind-pilot-oiloop-shuffle-key.json` | **Private** — gitignored |
| `research/decode-human-blind-pilot.mjs` | Decode CSV → B preference rate |

## Commands

```bash
# Regenerate (if run artifacts change)
node research/generate-human-blind-pilot.mjs

# After filling CSV
node research/decode-human-blind-pilot.mjs
```

---

## Artifacts to commit

- `research/human-blind-pilot-oiloop.csv` (preferences only, after rating)
- `research/human-blind-pilot-oiloop-results.md` (after decode)
