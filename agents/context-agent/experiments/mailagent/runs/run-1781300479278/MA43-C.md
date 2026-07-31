# MA43 (C)

## Answer

The Worker needs the following Wrangler bindings:

- **ASSETS**: Fetcher
- **DATABASE_URL**: string
- **RESEND_API_KEY**: string
- **RESEND_WEBHOOK_SECRET**: string
- **API_KEY**: string
- **API_KEYS** (optional): string
- **INBOX_DOMAIN**: string
- **DEFAULT_TTL_MINUTES**: string
- **MAIL_QUEUE**: Queue<EmailQueueMessage>
- **INBOX_WAIT**: DurableObjectNamespace
- **RATE_LIMIT_KV_WRITE_EVERY** (optional): string
- **RATE_LIMIT** (optional): KVNamespace
- **RATE_LIMIT_PER_MINUTE** (optional): string
- **STRIPE_SECRET_KEY** (optional): string
- **STRIPE_WEBHOOK_SECRET** (optional): string
- **STRIPE_PRICE_PRO** (optional): string
- **MCP_OAUTH_TOKEN_TTL_SEC** (optional): string
- **MCP_OAUTH_JWT_SECRET** (optional): string
- **OIDC_ISSUER** (optional): string
- **OIDC_CLIENT_ID** (optional): string
- **OIDC_CLIENT_SECRET** (optional): string
- **OIDC_AUDIENCE** (optional): string
- **RAW_MIME** (optional): R2Bucket
- **RAW_MIME_MAX_BYTES** (optional): string
- **RAW_MIME_AGENT_MAX_BYTES** (optional): string
- **ATTACHMENT_MAX_STORE_BYTES** (optional): string
- **OUTBOUND_FROM** (optional): string
- **AI** (optional): Ai
- **SEARCH_EMBED_MODEL** (optional): string
- **EXTRACT_MODEL** (optional): string
- **AUDIT_RETENTION_DAYS** (optional): string
