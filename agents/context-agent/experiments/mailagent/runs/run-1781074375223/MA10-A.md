# MA10 (A)

## Answer

The required environment variables for the Worker are:

- `DATABASE_URL`: Connection string for Neon Postgres.
- `RESEND_API_KEY`: API key for Resend.
- `RESEND_WEBHOOK_SECRET`: Signing secret for Resend webhooks.
- `API_KEY`: Main API key for authentication.
- `INBOX_DOMAIN`: Domain for the inbox.
- `DEFAULT_TTL_MINUTES`: Default time-to-live for inboxes.

Optional variables include:

- `OUTBOUND_FROM`: Email address for sending/replying.
- `OIDC_*`: Variables for OIDC configuration (issuer, client ID, client secret, audience).
- `RAW_MIME`: R2 bucket for storing raw MIME.
- `RAW_MIME_MAX_BYTES`: Maximum size for raw MIME.
- `ATTACHMENT_MAX_STORE_BYTES`: Maximum size for attachments.
