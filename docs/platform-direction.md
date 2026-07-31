# AgentsOS platform direction

## Product model

Mail Agent should become a module of a broader **AgentsOS Cloud**, not be stretched into a vague all-purpose agent. Its existing infrastructure already provides the useful shared layer: identity, API keys, billing, MCP discovery, run state, reminders, audit history, and production QA.

The platform split should be:

- **AgentsOS** — the umbrella brand, catalog, account, billing, documentation, and orchestration surface.
- **Context Agent** — context preparation and routing.
- **Safety Agent** — security and cryptographic posture.
- **Design Agent** — design specification, review, and verification.
- **Mail Agent** — email, signup verification, inboxes, and communication workflows.

This keeps every agent understandable while sharing one commercial and operational foundation.

## Website migration

Evolve the current Mail Agent site in three compatible stages:

1. Add an AgentsOS navigation shell and agent catalog while keeping all existing Mail Agent URLs, API endpoints, and documentation working.
2. Move account, billing, API keys, runs, and agent discovery into shared AgentsOS pages. Present Mail Agent as the first installed agent.
3. Introduce the umbrella domain and redirect only marketing pages. Keep `api.webmailagent.com`, npm package names, MCP tool names, and customer integrations stable until versioned replacements exist.

Avoid a big-bang rename. The Mail Agent name has value as a precise product capability, and its public identifiers are already embedded in code, clients, documentation, and package registries.

## Package and token policy

Use one npm organization scope (`@agentsos`) with granular access or trusted publishing from GitHub Actions. A single npm account can own and publish many packages; package count does not require account count.

Recommended rules:

- Prefer trusted publishing (OIDC) for release workflows where supported.
- If a token is required, use one granular automation token limited to the exact `@agentsos` packages.
- Put tokens in GitHub Actions secrets or environments, never in this repository.
- Keep legacy packages publishing during the transition and mark replacements in their README and package metadata before deprecation.
- Release agents independently; do not force a repository-wide version.

