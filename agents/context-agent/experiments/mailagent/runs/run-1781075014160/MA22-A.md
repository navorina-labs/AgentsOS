# MA22 (A)

## Answer

The business logic in the Worker is primarily located in the following files and services:

- **Services**: 
  - `src/services/inbox.ts`: Handles inbox creation, deletion, and message retrieval.
  - `src/services/message-raw.ts`: Manages raw message handling and retrieval.
  - `src/services/message-attachments.ts`: Deals with message attachments.
  - `src/services/agent-verify.ts`: Contains logic for verifying agent signups.
  - `src/services/audit-log.ts`: Manages audit logging for actions performed.
  - `src/services/billing.ts`: Handles billing-related operations with Stripe.
  - `src/services/team-resend.ts`: Manages dedicated Resend configurations for teams.

- **MCP Handlers**: 
  - `src/mcp/handlers.ts`: Executes MCP tools and manages the logic for various operations like verifying signups, creating inboxes, and waiting for messages.

- **Routes**: 
  - `src/routes/inboxes.ts`: Defines RESTful endpoints for inbox management, including creation, retrieval, and deletion.
  - `src/routes/agent.ts`: Handles agent-related requests, including verification and recipe retrieval.
  - `src/routes/oauth.ts`: Manages OAuth token issuance and client registration.

- **Utilities**: 
  - Various utility functions in `src/lib/` that support the main logic, such as API key validation, rate limiting, and callback URL validation.

These components work together to implement the core functionality of the MailAgent, including handling email verification, managing inboxes, and processing messages.
