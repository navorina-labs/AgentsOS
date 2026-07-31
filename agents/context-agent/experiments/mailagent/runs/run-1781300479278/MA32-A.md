# MA32 (A)

## Answer

Here is a map of the MailAgent repository modules based on the provided context:

### Main Modules
- **src/**
  - **db/**: Database client and migrations.
  - **durable-objects/**: Durable object implementations (e.g., inbox wait).
  - **env.ts**: Environment variable definitions.
  - **index.ts**: Main entry point for the Cloudflare Worker.
  - **lib/**: Utility functions and types.
    - **agent-recipes.ts**: Signup-flow recipes for agents.
    - **api-context.ts**: API context definitions.
    - **api-key-hint.ts**: Functions for handling API key hints.
    - **auth.ts**: Authentication middleware.
    - **callback-url.ts**: Callback URL validation.
    - **disposable-domains.ts**: Check for disposable email domains.
    - **email-syntax.ts**: Email syntax validation.
    - **generate-api-key.ts**: API key generation.
    - **key-scope.ts**: Scoped API key constraints.
    - **mcp-jwt.ts**: JWT handling for MCP.
    - **mcp-signing-secret.ts**: Shared signing secret for JWTs.
    - **mx-lookup.ts**: MX record lookup via DNS-over-HTTPS.
    - **notify-email.ts**: Functions for handling developer email relay.
    - **npm-versions.ts**: Published package versions.
    - **oidc-flow-jwt.ts**: OIDC JWT handling.
    - **outbound-capabilities.ts**: Outbound email capabilities.
    - **plans.ts**: Plan limits and normalization.
    - **public-origin.ts**: Public API origin handling.
    - **rate-limit-usage.ts**: Rate limit usage tracking.
    - **rate-limit.ts**: Rate limiting middleware.
    - **scope-guard.ts**: Scoped key checks in routes.
    - **sender-allowlist.ts**: Sender allowlist validation.
    - **simulate-scenarios.ts**: Simulate fixtures for testing.
    - **team-secrets.ts**: Encrypting team secrets.
    - **validate-run-id.ts**: Validation for run IDs.
  - **mcp/**: MCP (Model Context Protocol) related handlers and tools.
    - **handlers.ts**: Execute MCP tools.
    - **manifest.ts**: MCP tool definitions.
    - **progress.ts**: Progress notifications for MCP tools.
    - **session-progress.ts**: Session progress event queue.
    - **session.ts**: MCP session management.
    - **sse-response.ts**: SSE framing for MCP.
- **migrations/**: Database migrations.
- **public/**: Static assets and documentation.
- **docs/**: Documentation files.
- **examples/**: Example implementations and starter projects.

### Key Features
- **API Endpoints**: Defined in `src/routes/` for various functionalities (e.g., inbox management, billing, audit logs).
- **Durable Objects**: Used for managing stateful interactions (e.g., waiting for messages).
- **MCP Tools**: Various tools for agent interactions and email verification.
- **Rate Limiting**: Implemented to manage API usage.
- **Scoped API Keys**: For enhanced security and access control.

This structure provides a comprehensive overview of the modules and their purposes within the MailAgent repository.
