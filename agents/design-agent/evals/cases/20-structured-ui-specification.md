# Structured UI specification repair

Create a valid, implementation-ready machine-readable specification for the supplied team access review brief.

Attachments:

- `attachments/ui-spec-brief.md`
- `attachments/ui-spec-invalid.json`

Use the canonical `references/ui-spec-schema.json` bundled with Design Agent. The draft intentionally contains plausible design language but broken IDs, unsupported confirmed decisions, arbitrary responsive values, missing states, missing acceptance coverage, and unresolved policy presented as implementation fact.

Return exactly one JSON object conforming to the canonical schema. Do not use a Markdown fence or add prose before or after the object.

Requirements:

- preserve every supplied product fact and constraint without inventing API, backend, analytics, authorization, research, token, or motion details;
- use evidence IDs to support every `confirmed` decision and contract;
- label reversible starting points `proposed_default_validate`;
- label the four unknown policy areas `requires_decision` and connect them to explicit open questions;
- keep normative requirements in `contracts`, then reference them from views, components, and acceptance criteria instead of duplicating independent rules;
- include the complete selection → review → commit → pending → success/error/recovery flow;
- define content-driven wide, intermediate, and narrow behavior across the supplied range;
- account for every required interactive component state or provide a concrete reason it is not applicable;
- provide acceptance criteria that collectively cover `core_task`, `state`, `responsive`, `accessibility`, `content_stress`, and `recovery`;
- ensure every implementation-ready contract is verified by at least one criterion;
- keep the specification status `draft` or `review` while blocking policy questions remain.

Do not copy vague words such as “modern,” “clean,” “beautiful,” or “intuitive” from the invalid draft. Do not preserve its broken references, duplicated IDs, arbitrary `768px` breakpoint, or generic `Continue` action.
