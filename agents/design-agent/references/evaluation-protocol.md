# Evaluation protocol

Use this protocol to measure design-agent changes against a fixed baseline. Keep prompts separate from scoring criteria and do not expose the manifest to the agent being tested.

## Run an evaluation

1. Validate the suite and create a versioned run workspace outside the distributable skill:

```bash
python3 scripts/validate_evals.py evals/manifest.json
python3 scripts/create_eval_run.py evals/manifest.json <runs-directory> \
  --agent-version <version-or-commit> \
  --model <model-and-version> \
  --hypothesis "<expected improvement and risk>"
```

2. Start a clean conversation or isolated execution context for each case.
3. Provide only the corresponding snapshot from `<run>/prompts/`. Do not provide this protocol, the manifest, another response, or reviewer notes.
4. Save the complete unedited response to `<run>/responses/<case-id>.md`.

For a local Codex baseline, automate steps 2–4 without exposing the rubric:

```bash
python3 scripts/run_eval_case.py . <run> <case-id> \
  --model <model-and-version> --reasoning-effort medium
```

The launcher creates a temporary read-only workspace containing the skill, its references, and one frozen prompt. It preserves the final response and execution log, refuses to overwrite an existing answer, and deletes the temporary workspace afterward.

When a case declares `assets`, the run stores hashed snapshots under `<run>/assets/<case-id>/`. The launcher copies source/reference files into `attachments/` and passes screenshot assets through the model's image input. Reviewers must confirm that visual claims respect the evidence boundaries in `references/visual-inspection.md`.

For multi-viewport cases, generate every screenshot from the same source and state with `scripts/render_viewports.py`. The renderer uses Chrome device-metric emulation and refuses the capture unless the observed CSS `innerWidth`, `innerHeight`, and device scale match the request; PNG dimensions alone are insufficient proof because a browser may crop a wider minimum viewport. Record width, height, browser, zoom, and device scale in the frozen prompt. A reviewer must reject exact breakpoint claims when the supplied renders establish only an interval.

For before/after cases, freeze both source files and every matched image pair. Reviewers must check paired evidence, regressions, retained task coverage, remaining defects, and capture equivalence before accepting an improvement claim.

For interaction cases, freeze the page source, injected harness or application bundle, state screenshots, and machine-readable trace. The trace must record source hashes, browser/viewport metadata, input modality, assertions, and screenshot mapping. Reviewers must reject behavior claims broader than the exact reproduced action and assertion.

5. Generate the review scorecard:

```bash
python3 scripts/score_eval.py evals/manifest.json <case-id> \
  <run>/responses/<case-id>.md --output <run>/scorecards/<case-id>.json
```

6. Have a reviewer score every rubric dimension from 0 to 5. Require reviewer identity, one cited response excerpt or precise locator, one short justification per score, and normalized defect tags.
7. Record fatal errors separately. A fatal error caps the result at `needs revision`, regardless of the weighted score.
8. Copy `evals/reviewer-scores.example.json` to `<run>/reviews/<case-id>.json`, replace every placeholder, and finalize the scorecard:

```bash
python3 scripts/score_eval.py evals/manifest.json <case-id> \
  <run>/responses/<case-id>.md \
  --scores <run>/reviews/<case-id>.json \
  --output <run>/scorecards/<case-id>.json
```

9. Summarize the run or compare it with the previous baseline:

```bash
python3 scripts/validate_eval_run.py <current-run> --stage reviewed
python3 scripts/compare_eval_runs.py <current-run>
python3 scripts/compare_eval_runs.py <current-run> --baseline <previous-run> \
  --output <current-run>/comparison.md
```

Use `--fail-on-regression` in continuous checks. It flags an overall drop greater than 1 point, a dimension drop of at least 0.25 on the 0–5 scale, an increase in fatal errors, or mismatched completed case sets.

## Scoring

Calculate the weighted result as:

`sum(dimension score / 5 × dimension weight)`

Interpret the result:

- `90–100`: exceptional;
- `80–89.99`: strong;
- `70–79.99`: competent;
- `60–69.99`: needs revision;
- below `60`: fails baseline.

The automated scorecard checks only observable term coverage and document integrity. It does not judge design quality. A matched keyword is not proof that the requirement was handled well, and a missing keyword can be a false negative. Human review remains authoritative.

## Reviewer rules

- Judge the response against the supplied task, not personal visual taste.
- Score only evidence present in the response.
- Treat explicit, testable behavior as stronger than generic advice.
- Penalize unnecessary length only when it hides priorities or introduces contradictions.
- Do not reward invented research, citations, product facts, or numerical claims.
- Mark uncertain interpretation rather than silently resolving it in the agent’s favor.
- Re-review a sample blind when comparing two versions.

## Change discipline

- Freeze case prompts during a comparison cycle.
- Add a new case when a real failure mode is not represented; do not rewrite an old case to make a new version pass.
- Keep at least 20% of future cases held out from instruction and retrieval changes.
- Change one layer at a time when possible: instructions, retrieval, examples, or implementation.
- Record the change hypothesis before the run and defects after the run.
- Promote a change only when it improves the target dimension without material regression elsewhere.

## Evaluation record

For each run, retain:

- skill version or commit;
- model and execution settings;
- case ID and raw response;
- generated scorecard;
- reviewer identity and scores;
- fatal errors and defect tags;
- accepted correction or follow-up action.

Never train on held-out prompts, raw reviewer notes, or benchmark-specific expected wording.
