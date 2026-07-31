# Structured UI specification

Use the machine-readable contract when a specification must be validated, compared, handed to another agent, or checked against implementation.

The canonical schema is [ui-spec-schema.json](ui-spec-schema.json). Validate a JSON specification with:

```bash
python3 scripts/check_spec.py path/to/ui-spec.json
```

Use `--format json` when another tool or agent will consume the validation result.

## Author one normative contract

Keep each requirement once in `contracts`. Views and components reference contract IDs; acceptance criteria verify them. Do not restate the same rule independently in flow, component, accessibility, and acceptance prose.

Use:

- `evidence` for supplied facts, sources, renders, traces, standards, and disclosed assumptions;
- `decisions` for choices and trade-offs;
- `contracts` for normative behavior;
- `flows` for task sequence and recovery;
- `views` for hierarchy, order, composition, and component placement;
- `components` for anatomy, states, interaction, content, accessibility, and adaptation;
- `acceptance_criteria` for observable verification;
- `open_questions` only for decisions that materially change implementation.

## Label decision maturity

Every decision and contract uses one status:

- `confirmed`: explicitly supported by supplied evidence; include at least one evidence ID;
- `proposed_default_validate`: a reversible starting point; link the decision that records its trade-off;
- `requires_decision`: implementation depends on product, engineering, security, legal, research, or platform authority; link an open question.

Do not mark assumptions or generic best practices `confirmed` merely because they sound reasonable. Do not approve a specification while implementation-blocking questions remain.

## Make states explicit

For every interactive component, specify or explicitly mark not applicable:

- default;
- focus visible;
- disabled;
- loading;
- error;
- success.

Add hover, pressed, selected, empty, dragging, expanded, or other states when the component supports them. `not_applicable_states` maps a state to a concrete reason; it is not a place to write “later”.

## Make responsive rules content-driven

Describe wide, intermediate, and narrow composition plus the observed content condition that triggers each transition. A familiar number such as `768px` is not a requirement unless product evidence or an existing system establishes it. If a numeric starting point helps implementation, label it `proposed_default_validate` and verify the rendered condition.

Preserve task content, actions, reading order, focus order, and recovery across transitions. Reflow before truncation; if truncation is intentional, keep task-critical full content reachable.

## Bind acceptance to contracts

Every implementation-ready contract must be referenced by at least one acceptance criterion. Together the criteria cover:

- core task;
- interaction state;
- responsive behavior;
- accessibility;
- content stress;
- recovery.

Use observable Given/When/Then statements and name the evidence surface: DOM assertion, interaction trace, matched render, computed style, accessibility tree, named assistive-technology test, or another appropriate check.

`requires_decision` contracts are excluded from implementation acceptance until the linked question is resolved.

## Produce human and machine views

When both audiences matter:

1. author and validate the JSON contract;
2. derive the concise human-readable handoff from the same IDs;
3. do not maintain two independent normative versions.

The Markdown view may summarize context, flow, hierarchy, key contracts, acceptance, and open questions. Link each summary statement to its contract or decision ID so disagreement can be resolved against the validated JSON.

## Interpret validation

Schema checks prove shape, types, required fields, and enum use. Semantic checks additionally verify:

- globally unique IDs;
- valid cross-references;
- evidence for confirmed decisions and contracts;
- tracked proposed defaults;
- open questions for unresolved dependencies;
- acceptance coverage for every implementation-ready contract;
- complete interactive-state accounting;
- absence of vague normative adjectives.

A passing validator does not prove visual quality, usability, correct product policy, accessibility conformance, implementation feasibility, or rendered behavior. It proves that the handoff is structurally complete enough for those claims to be tested.
