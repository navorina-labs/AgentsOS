# Contract-driven implementation repair

Use this protocol after a valid specification comparison returns `does_not_conform` or `inconclusive` and the user authorizes implementation changes.

## Freeze the repair boundary

Keep the structured specification authoritative. Record the pre-repair implementation hash, failing and unverified contract IDs, allowed files, protected behavior, verification command, and artifacts to preserve.

Do not edit a confirmed contract merely to make faulty code pass. A specification change requires explicit product or design authority plus new evidence. Do not implement a `requires_decision` contract until its linked question is resolved.

## Plan by shared cause

Map every implementation-ready contract to one of:

- `repair`: evidence proves the implementation contradicts the contract;
- `instrument`: the contract is unverified because the required state or assertion is absent;
- `preserve`: the contract already passes and must remain a regression gate;
- `blocked`: product or engineering authority is still required.

Group related symptoms under the smallest responsible implementation cause. Keep the contract IDs attached so one convenient local fix cannot hide an unmet requirement.

## Make the smallest coherent patch

Prefer existing architecture, components, tokens, and dependencies. Change only files needed to close the scoped contracts and add verification instrumentation. Preserve task content, source order, semantics, focus behavior, responsive parity, and recovery unless a contract explicitly changes them.

Test instrumentation may expose deterministic state setup, submission counters, and outcome selection. It must not replace real product behavior or be presented as production network, persistence, authorization, or assistive-technology evidence.

## Rebuild evidence from new bytes

After every patch:

1. compute the new implementation SHA-256;
2. capture the required states, viewports, modalities, media preferences, DOM assertions, and screenshots;
3. create a new evidence manifest bound to the new hash;
4. run `compare_spec_implementation.py`;
5. fix failed gates and repeat;
6. re-run all previously passing contracts as regression gates.

When the user explicitly requests their already-open Chrome, use that Chrome session and its active tab. Do not launch a separate browser process. If the selected Chrome surface blocks a local URL, preserve the repair artifact and report that browser-evidence boundary instead of opening another browser or hiding a local server workaround.

Never edit an evidence result by hand to declare success. Evidence must be regenerated from the patched implementation.

## Stop conditions

Return `repaired_and_verified` only when:

- the structured specification remains valid and unchanged;
- the post-repair implementation hash differs from the pre-repair hash;
- every implementation-ready contract passes;
- `requires_decision` contracts remain excluded;
- the comparator returns `conforms`;
- the modified implementation and generated evidence artifacts are preserved;
- remaining scope boundaries are disclosed.

Return `partially_repaired` when safe progress was made but any implementation-ready contract is failed or unverified. Return `blocked` when progress requires new authority or unavailable evidence. Never call a repair complete from source inspection or screenshots alone.
