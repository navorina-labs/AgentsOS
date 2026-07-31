# MA19 (B)

## Answer

To configure the Resend webhook for the MailAgent project, follow these steps:

1. **Set Up Resend:**
   - Go to the Resend dashboard and create an API key.
   - Configure the receiving domain (e.g., `abc123.resend.app`) and set it as `INBOX_DOMAIN` in your environment variables.

2. **Webhook URL:**
   - For production, set the webhook URL to `https://api.webmailagent.com/webhooks/resend`.
   - If developing locally, use a tunnel (e.g., `cloudflared` or `ngrok`) to expose your local server and set the webhook URL to the tunnel's HTTPS address.

3. **Signing Secret:**
   - Obtain the signing secret from Resend and set it as `RESEND_WEBHOOK_SECRET` in your environment variables.

4. **Webhook Configuration:**
   - Ensure that the webhook is configured to trigger on the `email.received` event.

5. **Verify Webhook:**
   - The MailAgent will verify the webhook signature using the `RESEND_WEBHOOK_SECRET` when it receives a request.

6. **Testing:**
   - Use the `simulate` endpoint to test the webhook integration without needing real SMTP.

Make sure to check the Resend dashboard for any delivery logs to confirm that the webhook is functioning correctly.
