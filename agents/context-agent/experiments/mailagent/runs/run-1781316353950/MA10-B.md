# MA10 (B)

## Answer

The required environment variables for the Worker are:

- `DATABASE_URL` (Neon pooled Postgres)
- `RESEND_API_KEY` (Resend API)
- `RESEND_WEBHOOK_SECRET` (Webhook signing secret)
- `API_KEY` (Master key, legacy)
- `INBOX_DOMAIN` (Receiving domain, e.g., `id.resend.app`)
