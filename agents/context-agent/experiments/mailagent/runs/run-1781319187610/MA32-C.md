# MA32 (C)

## Answer

The MailAgent repository modules include:

- **agent**: Handles REST for AI agents, including verification and recipes.
- **api-meta**: Provides a discovery endpoint for agents and documentation.
- **domains**: Manages custom domains via Resend, scoped by team or API key hint.
- **simulate-inbound**: Allows injection of test messages without using Resend.
- **extract**: Extracts OTP and links from messages.
- **agent-runs**: Lists active agent runs.
- **message-verify**: Verifies messages.
- **message-search**: Handles searching of messages.
- **callback**: Manages callbacks for inboxes.
- **inbox**: Manages inboxes and their messages.
- **oidc-oauth**: Handles OAuth for OpenID Connect.
- **agent-verify**: Verifies agents.
- **agent-run-session**: Manages sessions for agent runs.
- **team-resend**: Manages team-specific Resend configurations.
- **raw-mime-r2**: Handles raw MIME storage and retrieval.
- **notify-email**: Manages email notifications.
- **audit-log**: Logs audit events for team and key actions.
- **service-presets**: Contains service-specific presets for handling emails.
- **rate-limit**: Implements rate limiting for API requests.
- **scope-guard**: Manages access control based on scopes.
- **api-context**: Provides context for API requests.
- **npm-versions**: Manages published versions of MailAgent packages.

This list summarizes the main modules in the MailAgent project.
