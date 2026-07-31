# MA22 (B)

## Answer

The business logic in the Worker is located in the following directories:

### Routes (HTTP layer) — `src/routes/`
- Contains thin handlers for various functionalities:
  - `inboxes.ts`: Inbox CRUD, wait, extract, simulate
  - `webhooks.ts`: Resend/Stripe ingress
  - `agent.ts`: Agent hub, verify, run sessions
  - `mcp-http.ts`: Remote MCP JSON-RPC
  - `oauth.ts`: MCP OAuth + well-known
  - `team.ts`: Teams, API keys, dedicated Resend
  - `domains.ts`: Custom domains
  - `billing.ts`: Stripe checkout
  - `console.ts`: Dashboard API
  - `audit.ts`: Audit log read

### Services (business logic) — `src/services/`
- Contains core business logic implementations:
  - `inbox.ts`: Create, read, delete, list, purge
  - `resend-mail.ts`: Inbound email processing
  - `extract.ts`: OTP + link extraction
  - `wait.ts`: Poll wait for messages
  - `simulate-inbound.ts`: QA inject
  - `outbound-mail.ts`: Send/reply
  - `callback.ts`: Webhook to callbackUrl
  - `message-verify.ts`: Verification DTO
  - `inbox-diagnose.ts`: Debug hints
  - `api-key-store.ts`: Auth resolution
  - `billing.ts`: Stripe integration
  - `domains.ts`: Custom domain lifecycle
  - `message-search.ts`: Search + embeddings
  - `structured-extract.ts`: Workers AI extract
  - `raw-mime-r2.ts`: R2 MIME storage
  - `message-attachments.ts`: Attachment handling
  - `agent-verify.ts`: Agent verify flow
  - `agent-run-session.ts`: Run state persistence
  - `audit-log.ts`: Audit events

### Lib (shared utilities) — `src/lib/`
- Contains shared utility functions and modules used across the application.
