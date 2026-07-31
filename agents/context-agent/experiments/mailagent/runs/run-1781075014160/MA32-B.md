# MA32 (B)

## Answer

Here is the map of the MailAgent repository modules:

### Корневые файлы
- `README.md`: Product overview, API table, MCP quick start
- `AGENTS.md`: Agent autonomy, test matrix, MCP tools list
- `SETUP.md`: Manual setup (Neon, Resend, deploy)
- `package.json`: Scripts, dependencies
- `wrangler.jsonc`: Cloudflare Worker config
- `.dev.vars.example`: Local secrets template
- `LICENSE`: MIT

### Основные модули (`src/`)
#### Entry & infra
- `src/index.ts`: Worker entry: fetch, queue, cron
- `src/env.ts`: Bindings interface
- `src/db/client.ts`: Neon client

#### Routes (`src/routes/`)
- `inboxes.ts`
- `webhooks.ts`
- `agent.ts`
- `mcp-http.ts`
- `oauth.ts`
- `team.ts`
- `domains.ts`
- `billing.ts`
- `console.ts`
- `audit.ts`
- `stats.ts`
- `me.ts`
- `health.ts`
- `api-meta.ts`
- `openapi.ts`

#### Services (`src/services/`)
- Core: 
  - `inbox.ts`
  - `resend-mail.ts`
  - `extract.ts`
  - `wait.ts`
  - `simulate-inbound.ts`
  - `callback.ts`
  - `message-verify.ts`
  - `inbox-diagnose.ts`
  - `api-key-store.ts`
- Extended:
  - `outbound-mail.ts`
  - `domains.ts`
  - `billing.ts`
  - `raw-mime-r2.ts`
  - `message-attachments.ts`
  - `message-search.ts`
  - `structured-extract.ts`
  - `thread-resolve.ts`
  - `agent-verify.ts`
  - `agent-run-session.ts`
  - `audit-log.ts`
  - `team-resend.ts`
  - `mcp-oauth.ts`
  - `oidc-oauth.ts`
  - console-* services

#### Lib (`src/lib/`)
- `auth.ts`
- `plans.ts`
- `rate-limit.ts`
- `sender-allowlist.ts`
- `scope-guard.ts`
- `service-presets.ts`
- `mcp-jwt.ts`
- `key-scope.ts`
- etc.

#### Other src
- `src/queue/consumer.ts`: Queue batch handler
- `src/durable-objects/inbox-wait.ts`: SSE Durable Object
- `src/mcp/manifest.ts`: 23 MCP tool definitions
- `src/mcp/handlers.ts`: MCP tool dispatch
- `src/openapi/spec.ts`: OpenAPI 3.0 schema

### MCP package (`mcp/`)
- `mcp/src/index.ts`: stdio MCP server
- `mcp/src/client.ts`: REST API client
- `mcp/src/cli.ts`: CLI (`open`, `inbox create`, `wait`)
- `mcp/src/sse.ts`: SSE wait client
- `mcp/src/service-presets.ts`: Service presets (duplicate of src/lib)

### npm packages (`packages/`)
- `@mailagent/qa`: `packages/mailagent-qa/` - Playwright/Cypress helpers
- `@mailagent/agent`: `packages/mailagent-agent/` - REST verify SDK

### Migrations (`migrations/`)
- 16 SQL files: `001_init.sql` … `016_team_dedicated_resend.sql`

### Документация (`docs/`)
- 42 markdown files covering various topics (QA, Ops, Agent, Platform, Security)

### Skills
- `skills/mailagent/SKILL.md`: Canonical Agent Skill
- Agent skill sync copy
- `examples/codex/plugin/skills/mailagent/SKILL.md`: Codex plugin copy

### Examples (`examples/`)
- Various directories for E2E specs, starter kits, CI workflows, etc.

### Scripts (`scripts/`)
- ~50 `.mjs` files for various purposes (Doctor, Contract, Smoke, Setup, Publish, Wizards)

### Public static (`public/`)
- Landing, dashboard, debug UI, docs HTML, assets.

### CI (`.github/workflows/`)
- Various workflows for deployment, testing, security, and publishing.
