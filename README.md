# AgentsOS

AgentsOS is a home for focused AI agents that can be used independently and combined into one workflow.

## Agents

| Agent | Purpose | Status |
| --- | --- | --- |
| [Context Agent](agents/context-agent) | Builds, routes, validates, and evaluates minimal project context for AI-assisted work. | Existing implementation imported from AI Context OS |
| [Safety Agent](agents/safety-agent) | Audits cryptographic posture, post-quantum migration, policies, and implementation risks. | Renamed from SafetyOS; legacy CLI remains compatible |
| [Design Agent](agents/design-agent) | Produces implementation-ready interface specifications, critiques, and design-system guidance. | Existing skill and evaluation suite imported |
| [Mail Agent](agents/mail-agent) | Gives agents email verification, inbox, QA, and workspace communication capabilities. | Existing service; first module of the future AgentsOS Cloud |

Each agent keeps its own runtime, dependencies, tests, and release lifecycle. The repository root contains only shared governance and platform documentation, so one agent can evolve without forcing a release of the others.

## Repository layout

```text
AgentsOS/
├── agents/
│   ├── context-agent/
│   ├── safety-agent/
│   ├── design-agent/
│   └── mail-agent/
└── docs/
    └── platform-direction.md
```

## npm strategy

Do not create a separate npm account or token for every agent. Use one organization scope and one trusted-publishing or granular automation credential for the whole suite:

```text
@agentsos/context
@agentsos/safety
@agentsos/design
@agentsos/mail
@agentsos/mcp
```

Existing package names such as `context-os` and `@mailagent/mcp` should remain available during migration. New scoped packages can be introduced as major versions or compatibility wrappers after the `@agentsos` npm scope is secured.

## Development

Run commands from the agent you are changing. For example:

```bash
cd agents/safety-agent
npm install
npm run verify
```

See each agent's README or `SKILL.md` for its own setup and verification commands.

