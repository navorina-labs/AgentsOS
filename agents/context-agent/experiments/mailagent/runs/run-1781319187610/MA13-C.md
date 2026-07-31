# MA13 (C)

## Answer

The main security risks identified in the MailAgent project include:

- **Tenant Isolation**: Risks related to unauthorized access to `inboxes`, `messages`, and `domains` due to insufficient filtering by `api_key_hint` and `team_id`.
- **Credential Management**: Risks associated with API keys, `mat_*`, and OIDC, including the need for hashing at rest and implementing TTL (Time to Live) for keys.
- **Inbound Trust**: Risks from untrusted email content received via Resend, mitigated by using an allowlist and avoiding HTML execution.
- **Webhook Integrity**: Ensuring the integrity of webhooks from Resend and Stripe through signature verification.
- **Abuse Prevention**: Risks of abuse in REST API endpoints (`/v1/*`), managed through rate limiting and plan quotas.
- **Client Exposure**: Risks of exposing sensitive information in the dashboard or Codex plugin, ensuring no keys are included in bundles.
- **Supply Chain Risks**: Risks from npm dependencies, monitored through security audits.
- **Operational Risks**: Risks associated with a single Worker architecture, which can create a shared blast radius for failures.

These risks are documented in the security core and are part of the overall security strategy for the MailAgent project.
