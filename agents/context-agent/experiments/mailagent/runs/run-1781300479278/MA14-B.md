# MA14 (B)

## Answer

MCP (MailAgent Control Protocol) integrates with MailAgent in the following ways:

- **Transport Methods**:
  - **Stdio**: 
    - Uses the `@mailagent/mcp` package.
    - Can be run with `node mcp/dist/index.js` or `npx -y -p @mailagent/mcp mailagent-mcp`.
    - Communicates with the MailAgent API using `MAILAGENT_API_URL` and `MAILAGENT_API_KEY`.
  - **Remote HTTP**: 
    - Uses JSON-RPC 2.0 for communication.
    - Endpoint: `POST https://api.webmailagent.com/mcp`.
    - Requires Bearer token for authorization.

- **Discovery**:
  - The endpoint `GET /v1/agent` provides a discovery hub for available MCP tools, links to documentation, and other resources.

- **Tools**:
  - There are **23 tools** defined in the MCP manifest located at `src/mcp/manifest.ts`.
  - Tools are dispatched through a single handler layer in `src/mcp/handlers.ts`.

- **OAuth Support**:
  - For browser clients, OAuth is supported via the OIDC login, which provides a `mat_` access token for authentication.

- **SSE Support**:
  - The stdio MCP client can open SSE connections to the API for real-time message waiting.

- **Versioning**:
  - The current version of the MCP tools is `0.8.1`, and any changes to the tools require running `npm run sync:context-os` to update the documentation.

This integration allows for a seamless interaction between agents and the MailAgent platform, enabling various functionalities such as message processing, verification, and real-time updates.
