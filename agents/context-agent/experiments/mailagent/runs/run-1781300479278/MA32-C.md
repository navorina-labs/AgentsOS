# MA32 (C)

## Answer

The MailAgent repository contains the following modules:

- **agent**: Handles REST for AI agents, including verification and recipes.
- **api-meta**: Provides a discovery endpoint for agents and documentation.
- **domains**: Manages custom domains via Resend, scoped by team or API key hint.
- **inbox**: Manages inboxes, including creation, retrieval, and message handling.
- **message-raw**: Loads raw MIME messages for REST and MCP.
- **outbound-mail**: Handles sending outbound emails from inboxes via Resend.
- **simulate-inbound**: Simulates inbound messages for QA and development.
- **extract**: Extracts OTP and links from messages.
- **agent-runs**: Lists active agent runs.
- **agent-verify**: Verifies agents.
- **team-resend**: Manages team-specific Resend configurations.
- **message-verify**: Verifies messages.
- **message-search**: Handles searching messages.
- **callback**: Manages callbacks for inboxes.
- **notify-email**: Manages email notifications.
- **team-event-webhook**: Handles team event webhooks.
- **raw-mime-r2**: Manages raw MIME storage in R2.
- **db/client**: Database client for interacting with the database.
- **lib**: Contains various utility libraries, including for authentication, rate limiting, and API context.
- **mcp**: Contains tools and definitions for the Model Context Protocol (MCP).

This list includes the main modules and their purposes within the MailAgent project.
