# MA19 (C)

## Answer

To configure the Resend webhook, follow these steps:

1. **Obtain API Key and Webhook Secret:**
   - Go to [resend.com](https://resend.com) and navigate to API Keys to get your `RESEND_API_KEY`.
   - Under Emails → Receiving, set up a domain (e.g., `abc123.resend.app`) and note it as `INBOX_DOMAIN=abc123.resend.app`.
   - Set the signing secret in your environment as `RESEND_WEBHOOK_SECRET`.

2. **Set Up Webhook URL:**
   - For local development, use a tunneling service (like cloudflared or ngrok) to expose your local server.
   - The webhook URL should be:
     - Local: `https://<tunnel>/webhooks/resend`
     - Production: `https://mailagent.<subdomain>.workers.dev/webhooks/resend`

3. **Update Your Environment Variables:**
   - Ensure your environment variables are set correctly in your `.dev.vars` or `.env` file:
     ```plaintext
     RESEND_API_KEY=<your_resend_api_key>
     RESEND_WEBHOOK_SECRET=<your_webhook_secret>
     INBOX_DOMAIN=abc123.resend.app
     ```

4. **Deploy Changes:**
   - After configuring, deploy your application to ensure the webhook is active.

5. **Verify Configuration:**
   - Test the webhook by sending a test email to the configured domain and check if your application receives the webhook event.

Make sure to follow any additional instructions specific to your application setup as needed.
