# AgentsOS contribution guide

AgentsOS is a multi-agent repository. Keep changes scoped to the agent named in the task unless a shared contract explicitly requires coordinated changes.

## Boundaries

- `agents/context-agent` owns context routing, schemas, evaluation, and the Context Agent CLI.
- `agents/safety-agent` owns cryptographic posture, threat models, policy gates, and the Safety Agent CLI.
- `agents/design-agent` owns the design skill, references, scripts, and evaluation cases.
- `agents/marketing-agent` owns product marketing, SEO, content, conversion, growth measurement, and the Marketing Agent skill and audit tools.
- `agents/mail-agent` owns email, QA inboxes, communication tools, and the current cloud control plane. Follow its nested `AGENTS.md` for code changes.

Do not commit credentials, local environment files, dependency directories, generated build output, or copied nested `.git` directories. Preserve compatibility aliases when renaming a public CLI, API, package, or tool.

## Verification

Use the narrowest verification documented by the changed agent. Do not install or test every agent for a change confined to one directory.
