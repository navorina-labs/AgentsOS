# MA13 (C)

## Answer

The main security risks identified in the MailAgent project include:

- **Tenant Isolation**: Risks related to unauthorized access to `inboxes`, `messages`, and `domains` due to insufficient filtering by `api_key_hint` and `team_id`.
- **Credential Management**: Risks associated with API keys, `mat_*`, and OIDC, including potential leakage and inadequate hashing.
- **Inbound Trust**: Risks from untrusted email content received via Resend, which could lead to security vulnerabilities if not properly handled.
- **Webhook Integrity**: Risks related to the security of webhook endpoints (`/webhooks/*`), particularly concerning signature verification.
- **Abuse Potential**: Risks of abuse through the REST API (`/v1/*`), which could be mitigated by implementing rate limiting and plan quotas.
- **Client Exposure**: Risks of exposing sensitive information in the dashboard or client-side code, such as API keys.
- **Supply Chain Risks**: Risks associated with dependencies in npm packages, which could introduce vulnerabilities.
- **Operational Risks**: Risks related to the shared blast radius of a single Worker handling multiple requests.

These risks are documented in the security core and are addressed through various controls and practices.
