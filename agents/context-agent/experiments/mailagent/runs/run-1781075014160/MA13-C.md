# MA13 (C)

## Answer

The main security risks documented in the MailAgent project are:

- **IDOR**: Cross-team inbox/message/domain access.
- **API key leakage**: Bearer token in logs, CI, browser storage.
- **Webhook bypass**: Unsigned Resend/Stripe payloads.
- **Allowlist bypass**: Unexpected senders stored if misconfigured.
- **Rate limit abuse**: API flooding.
- **MCP session hijack**: Remote MCP session binding.
- **OIDC flow**: State/PKCE if browser login enabled.
- **Untrusted inbound email**: Content injection — agents must not execute email HTML.
- **Dashboard**: `dashboard.html` stores API key in browser localStorage.
