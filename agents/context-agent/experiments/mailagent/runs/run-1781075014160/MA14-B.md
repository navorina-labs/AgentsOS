# MA14 (B)

## Answer

MCP integrates with MailAgent through the following mechanisms:

- **Manifest**: Defined in `src/mcp/manifest.ts`, it includes 23 tools and specifies the version (0.8.1).
- **Handlers**: Implemented in `src/mcp/handlers.ts` and session management in `src/mcp/session.ts`.
- **Transports**:
  - **Stdio**: Accessible via `mcp/src/index.ts` using the npm package `@mailagent/mcp`.
  - **Remote HTTP**: Utilizes `POST /mcp` for JSON-RPC communication, handled by `src/routes/mcp-http.ts`.
- **OAuth Support**: Managed through endpoints like `/.well-known/oauth-*` and `/v1/oauth/*`, using `mat_` JWT for authentication (`src/lib/mcp-jwt.ts`).
- **Discovery**: The endpoint `GET /v1/agent` lists available tools, recipes, and documentation links for users.
- **Typical MCP Flow**: Involves creating an inbox, filling out forms, waiting for messages, extracting verification, and deleting the inbox.

This integration allows for seamless interaction between the MailAgent functionalities and the MCP tools.
