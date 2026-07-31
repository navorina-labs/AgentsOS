# Systemic design review

Use this protocol when critiquing several findings, auditing a product surface, or deciding whether a local defect belongs in the design system.

## Separate symptom from cause

For each finding, identify the narrowest responsible layer:

1. content instance;
2. screen composition or flow;
3. component contract;
4. semantic token or foundation;
5. product policy, data, or platform capability;
6. governance, documentation, or testing.

Do not call a problem systemic from one occurrence alone. Promote it when evidence shows repetition, a shared primitive, or a missing contract likely to affect multiple surfaces.

## Cluster related findings

Group findings only when one upstream correction can prevent several symptoms. Useful clusters include:

- field labels, validation timing, error association, and focus recovery → form-field and validation contract;
- competing filled buttons and ambiguous outcomes → action hierarchy and button-variant contract;
- inconsistent loading replacement and lost context → asynchronous-state and content-preservation contract;
- repeated arbitrary color or spacing → semantic foundation or token governance.

Keep unrelated high-severity findings separate even if clustering would make the review shorter.

## Recommend two horizons

For every systemic cluster, specify:

- **Immediate containment:** the smallest safe fix for the reviewed surface.
- **System correction:** the reusable component, token, content, test, or governance change that prevents recurrence.
- **Blast radius:** where else to audit before rollout.
- **Owner and verification:** the likely responsible team and observable adoption/regression checks.

Do not delay a critical local fix while waiting for a design-system migration.

## Preserve evidence discipline

- Cite every included symptom and state confidence.
- Distinguish observed repetition from suspected reuse.
- Do not infer repository-wide prevalence from one screenshot.
- Phrase unverified scope as an audit recommendation, not a fact.
- Avoid creating a component variant or token for a one-off need.

## Output

Lead with ranked user-impact findings. Add a short `Systemic synthesis` only when supported:

| Cluster | Evidence | Immediate containment | System correction | Audit scope / owner |
|---|---|---|---|---|

End with the smallest rollout sequence that fixes blockers first and validates the shared correction before broad adoption.
