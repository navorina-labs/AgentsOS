# Team access review brief

Design an implementation-ready UI specification for a web interface where an organization administrator reviews inactive member accounts and deactivates selected access.

## Supplied product facts

- The list can contain 1–200 flagged accounts.
- Each item has name, email, organization role, last sign-in, access scope, and accountable owner.
- The administrator can select any subset and review the selection before commitment.
- Deactivation immediately removes product access; account history and audit records remain.
- The operation may fail because the administrator’s permission changed, the network was lost, or the session expired.
- An account may become ineligible between selection and commitment.
- Desktop and mobile web use the same product flow.
- Supported CSS viewport range is 320–1440 px.

## Required experience

- Preserve enough identity and access context to avoid deactivating the wrong person.
- Make selection count and consequence explicit before commitment.
- Prevent duplicate submissions.
- Preserve task context through recoverable failures.
- Cover keyboard operation, focus, semantics, announcements, reflow, content growth, and reduced motion.
- Provide observable acceptance criteria for the core task, state transitions, responsive behavior, accessibility, content stress, and recovery.

## Unknown decisions

- Whether administrators may deactivate their own account.
- Whether the final organization owner may be deactivated.
- Whether reactivation is self-service or requires support.
- Whether an expired session restores the prepared selection after reauthentication.

## Constraints

- No existing design system, component library, analytics plan, API contract, or backend architecture is supplied.
- Do not invent authorization rules, endpoints, storage behavior, analytics events, research findings, fixed visual tokens, or numeric motion thresholds.
- Content-driven layout transitions are required; a familiar device breakpoint is not product evidence.
