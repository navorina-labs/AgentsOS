# MA10 (A)

## Answer

The required environment variables for the Worker are:

- `DATABASE_URL`: Connection string for Neon Postgres.
- `RESEND_API_KEY`: API key for Resend.
- `RESEND_WEBHOOK_SECRET`: Secret for Resend webhook.
- `API_KEY`: Main API key for authentication.
- `INBOX_DOMAIN`: Domain for the inbox.
- `DEFAULT_TTL_MINUTES`: Default time-to-live for inboxes.
- `MAIL_QUEUE`: Queue for email messages.
- `INBOX_WAIT`: Durable object namespace for waiting on inbox messages.

Optional variables include:

- `RATE_LIMIT_KV_WRITE_EVERY`: Rate limit sampling for KV writes.
- `RATE_LIMIT`: KV namespace for rate limiting.
- `RATE_LIMIT_PER_MINUTE`: Rate limit per minute.
- `STRIPE_SECRET_KEY`: Secret key for Stripe (if billing is enabled).
- `STRIPE_WEBHOOK_SECRET`: Webhook secret for Stripe.
- `STRIPE_PRICE_PRO`: Price ID for Pro subscription.
- `MCP_OAUTH_TOKEN_TTL_SEC`: OAuth access token TTL in seconds.
- `MCP_OAUTH_JWT_SECRET`: HMAC secret for stateless JWT.
- `OIDC_ISSUER`: OIDC issuer URL for Auth0/Google.
- `OIDC_CLIENT_ID`: OIDC client ID for Auth0/Google.
- `OIDC_CLIENT_SECRET`: OIDC client secret for Auth0/Google.
- `RAW_MIME`: R2 bucket for raw MIME storage.
- `RAW_MIME_MAX_BYTES`: Max size for raw MIME storage.
- `RAW_MIME_AGENT_MAX_BYTES`: Max size for base64 body returned to agents.
- `ATTACHMENT_MAX_STORE_BYTES`: Max size for cached attachments.
- `OUTBOUND_FROM`: Verified sender for outbound emails.
- `AI`: Workers AI settings for semantic search.
- `SEARCH_EMBED_MODEL`: Override for embedding model.
- `EXTRACT_MODEL`: LLM for structured extraction.
- `AUDIT_RETENTION_DAYS`: Audit log retention in days.
