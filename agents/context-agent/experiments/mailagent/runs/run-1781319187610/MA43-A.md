# MA43 (A)

## Answer

The Worker needs the following bindings:

- `ASSETS`: Fetcher for static assets.
- `DATABASE_URL`: Connection string for Neon Postgres.
- `RESEND_API_KEY`: API key for Resend.
- `RESEND_WEBHOOK_SECRET`: Webhook secret for Resend.
- `API_KEY`: Main API key for authentication.
- `API_KEYS`: Optional, for multiple API keys (comma-separated).
- `INBOX_DOMAIN`: Domain for the inbox.
- `MAIL_QUEUE`: Queue for email messages.
- `INBOX_WAIT`: Durable Object namespace for waiting on inbox messages.
- `RATE_LIMIT`: Optional, for rate limiting per API key.
- `RATE_LIMIT_PER_MINUTE`: Optional, for setting rate limits.
- `STRIPE_SECRET_KEY`: Optional, for Stripe integration.
- `STRIPE_WEBHOOK_SECRET`: Optional, for Stripe webhook.
- `STRIPE_PRICE_PRO`: Optional, for the price ID of the Pro subscription.
- `MCP_OAUTH_TOKEN_TTL_SEC`: Optional, for OAuth access token TTL.
- `MCP_OAUTH_JWT_SECRET`: Optional, for HMAC secret for JWT.
- `RAW_MIME`: R2 bucket for storing raw MIME.
- `RAW_MIME_MAX_BYTES`: Optional, for max size of raw MIME.
- `RAW_MIME_AGENT_MAX_BYTES`: Optional, for max size of base64 body returned to agents.
- `ATTACHMENT_MAX_STORE_BYTES`: Optional, for max attachment size to cache in R2.
- `OUTBOUND_FROM`: Optional, for verified sender address for outbound emails.
- `AI`: Optional, for Workers AI embeddings.
- `SEARCH_EMBED_MODEL`: Optional, for overriding the embed model.
- `EXTRACT_MODEL`: Optional, for overriding the LLM for structured extraction.
- `AUDIT_RETENTION_DAYS`: Optional, for audit log retention in days.
