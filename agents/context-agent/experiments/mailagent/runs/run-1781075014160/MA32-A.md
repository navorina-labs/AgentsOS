# MA32 (A)

## Answer

Here is a map of the MailAgent repository modules based on the provided context:

### Main Modules
- **Core Functionality**
  - `src/index.ts`: Main entry point for the Cloudflare Worker.
  - `src/env.ts`: Environment variables and types.
  - `src/db/client.ts`: Database client setup for Neon Postgres.
  - `src/queue/consumer.ts`: Handles email processing from the queue.

- **Routes**
  - `src/routes/agent.ts`: REST API for AI agents, including verification and recipes.
  - `src/routes/api-meta.ts`: Discovery endpoint for API metadata.
  - `src/routes/audit.ts`: Audit log API for team/key scoped actions.
  - `src/routes/billing.ts`: Stripe checkout and billing management.
  - `src/routes/console.ts`: Hosted SaaS console API for managing inboxes and threads.
  - `src/routes/domains.ts`: Management of custom domains.
  - `src/routes/health.ts`: Health check endpoint.
  - `src/routes/inboxes.ts`: Management of temporary inboxes.
  - `src/routes/me.ts`: Key profile and usage limits.
  - `src/routes/oauth.ts`: OAuth 2.0 token management and dynamic client registration.
  - `src/routes/openapi.ts`: OpenAPI JSON specification for the API.
  - `src/routes/stats.ts`: Usage statistics for monitoring.

- **Durable Objects**
  - `src/durable-objects/inbox-wait.ts`: Handles waiting for messages via SSE.

### Libraries and Utilities
- **Key Management**
  - `src/lib/api-keys.ts`: API key management and validation.
  - `src/lib/auth.ts`: Authentication middleware for API routes.
  - `src/lib/key-scope.ts`: Scoped API key constraints and validation.
  - `src/lib/rate-limit.ts`: Rate limiting logic for API requests.
  - `src/lib/scope-guard.ts`: Scoped key checks in routes.

- **MCP (Model Context Protocol)**
  - `src/mcp/handlers.ts`: Handles execution of MCP tools.
  - `src/mcp/manifest.ts`: MCP tool definitions and metadata.
  - `src/mcp/progress.ts`: Progress notifications for MCP wait tools.
  - `src/mcp/session.ts`: Management of MCP sessions.
  - `src/mcp/sse-response.ts`: SSE framing for MCP Streamable HTTP.

### Services
- **Business Logic**
  - `src/services/audit-log.ts`: Audit log management.
  - `src/services/billing.ts`: Billing and Stripe integration.
  - `src/services/console-summary.ts`: Summary for console dashboard.
  - `src/services/domains.ts`: Domain management services.
  - `src/services/inbox.ts`: Inbox management services.
  - `src/services/message-attachments.ts`: Attachment handling.
  - `src/services/message-raw.ts`: Raw message handling.
  - `src/services/message-verify.ts`: Message verification logic.
  - `src/services/outbound-mail.ts`: Outbound email sending logic.
  - `src/services/resend-mail.ts`: Integration with Resend for inbound emails.
  - `src/services/simulate-inbound.ts`: Simulate inbound messages for testing.
  - `src/services/team-resend.ts`: Management of dedicated Resend accounts for teams.

### Migrations
- **Database Migrations**
  - `migrations/001_init.sql` to `migrations/016_team_dedicated_resend.sql`: SQL scripts for setting up and modifying the database schema.

### Documentation
- **Docs**
  - Various markdown files in the `docs/` directory providing detailed documentation on setup, usage, and features.

### Examples
- **Example Implementations**
  - `examples/`: Contains example projects for QA pilots, Playwright, Cypress, and Codex integration.

This structure provides a comprehensive overview of the modules and their purposes within the MailAgent repository.
