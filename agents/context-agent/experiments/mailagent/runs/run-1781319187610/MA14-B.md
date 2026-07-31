# MA14 (B)

## Answer

MCP integrates with MailAgent through the following components:

### Transport Methods
- **Stdio Transport**: 
  - Uses the `@mailagent/mcp` package.
  - Can be run using `node mcp/dist/index.js` or `npx -y -p @mailagent/mcp mailagent-mcp`.
  - Communicates with the MailAgent API using `MAILAGENT_API_URL` and `MAILAGENT_API_KEY`.

- **Remote HTTP Transport**: 
  - Uses JSON-RPC 2.0 to communicate with the MailAgent API.
  - Endpoint: `POST https://api.webmailagent.com/mcp`.
  - Requires Bearer token for authorization.

### Discovery
- The discovery endpoint `GET /v1/agent` provides information about available MCP tools, authentication methods, and documentation links.

### Tools and Manifest
- The MCP manifest located in `src/mcp/manifest.ts` defines **23 tools** available for use.
- Tools are dispatched through `src/mcp/handlers.ts`, ensuring that both stdio and remote methods remain in sync.

### Client Interaction
- Clients can interact with the MCP using either the stdio method or the remote HTTP method, allowing for flexibility in how agents and applications communicate with MailAgent.

### OAuth Integration
- For browser clients, OAuth is supported through the OIDC login, providing access tokens for secure communication with the MCP.

### Summary
- MCP serves as a bridge for various agents and tools to interact with MailAgent, facilitating operations like message processing, verification, and diagnostics through both local and remote methods.
