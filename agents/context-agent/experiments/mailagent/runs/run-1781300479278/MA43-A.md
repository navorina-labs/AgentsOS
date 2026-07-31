# MA43 (A)

## Answer

The Worker needs the following bindings:

- `ASSETS`: Fetcher for static assets.
- `DATABASE_URL`: Connection string for Neon Postgres.
- `RESEND_API_KEY`: API key for Resend.
- `RESEND_WEBHOOK_SECRET`: Secret for Resend webhooks.
- `API_KEY`: Main API key for authentication.
- `API_KEYS`: Optional, for multiple API keys (comma-separated).
- `INBOX_DOMAIN`: Domain for the inbox.
- `MAIL_QUEUE`: Queue for email messages.
- `INBOX_WAIT`: Durable Object namespace for waiting on inbox messages.
- `RATE_LIMIT`: Optional, for rate limiting per API key.
- `RAW_MIME`: R2 bucket for storing raw MIME files.
- `OUTBOUND_FROM`: Optional, for verified sender address in outbound emails.
- `MCP_OAUTH_JWT_SECRET`: Optional, for signing stateless JWTs.
- `OIDC_*`: Optional, for OIDC configuration (issuer, client ID, client secret, audience).
