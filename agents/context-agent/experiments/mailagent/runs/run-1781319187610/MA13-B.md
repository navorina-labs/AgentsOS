# MA13 (B)

## Answer

The main security risks documented in the MailAgent project are:

- **IDOR (Insecure Direct Object Reference)**: Cross-team access to inboxes, messages, or domains.
- **API Key Leakage**: Exposure of Bearer tokens in logs, CI, or browsers.
- **Webhook Bypass**: Acceptance of unsigned payloads.
- **Allowlist Bypass**: Unexpected senders being stored.
- **Rate Limit Abuse**: Flooding the API with requests.
- **MCP Session Hijack**: Potential binding issues with remote MCP.
- **OIDC Flow Vulnerabilities**: Risks related to state or PKCE bypass.
- **Untrusted Inbound Email**: Risks from HTML/attachment injections.
- **Dashboard XSS and Key Exposure**: Risks from storing API keys in localStorage.
- **Single Worker Blast Radius**: All tenants being affected by a single deployment.
- **Silent Mail Loss**: Unprocessed messages in the dead letter queue (DLQ).
- **Allowlist Silent Drop**: Messages dropped without notifying the sender.
