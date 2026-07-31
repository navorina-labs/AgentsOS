# MA10 (B)

## Answer

The required environment variables for the Worker are:

| Variable                  | Description                             |
|---------------------------|-----------------------------------------|
| `DATABASE_URL`           | Neon pooled connection string           |
| `RESEND_API_KEY`         | Resend API key                          |
| `RESEND_WEBHOOK_SECRET`  | Webhook signing secret (whsec_)        |
| `API_KEY`                | Master API key (or use `API_KEYS`)    |
| `INBOX_DOMAIN`           | Resend receiving domain                 |
