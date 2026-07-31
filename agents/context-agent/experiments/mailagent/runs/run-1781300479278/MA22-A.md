# MA22 (A)

## Answer

The business logic in the Worker is primarily located in the following areas:

- **Services**: Functions that handle specific operations, such as:
  - `src/services/inbox`: Manages inbox creation, retrieval, and deletion.
  - `src/services/message-raw`: Handles raw message processing.
  - `src/services/agent-verify`: Contains logic for verifying signups and handling OTPs.
  - `src/services/domains`: Manages custom domain operations.
  - `src/services/audit-log`: Handles logging of actions for audit purposes.
  - `src/services/billing`: Manages billing-related operations.

- **MCP Handlers**: The `src/mcp/handlers.ts` file contains the logic for executing MCP tools, including:
  - Handling requests for creating inboxes, verifying signups, and waiting for messages.
  - Implementing business rules for API key scopes and access control.

- **Route Handlers**: The route files (e.g., `src/routes/inboxes.ts`, `src/routes/agent.ts`, etc.) define the endpoints and their corresponding logic, including:
  - Validating requests.
  - Processing input data and returning appropriate responses.
  - Integrating with services to perform actions based on the request.

- **Utility Functions**: Various utility functions in `src/lib/` handle tasks such as:
  - Validating email syntax.
  - Managing API key scopes.
  - Handling rate limits.

These components work together to implement the core functionality of the MailAgent project within the Cloudflare Worker environment.
