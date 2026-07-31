# MA19 (A)

## Answer

To configure the Resend webhook for MailAgent, follow these steps:

1. **Obtain the Resend API Key**:
   - Go to your Resend account and navigate to **API Keys**.
   - Copy your **Resend API Key** and set it as `RESEND_API_KEY`.

2. **Set the Inbox Domain**:
   - In the Resend dashboard, go to **Emails → Receiving**.
   - Copy the domain (e.g., `xxxx.resend.app`) and set it as `INBOX_DOMAIN`.

3. **Configure the Webhook URL**:
   - Set the webhook URL to point to your MailAgent worker:
     - For local development: `https://<tunnel>/webhooks/resend` (using tools like cloudflared or ngrok).
     - For production: `https://mailagent.<subdomain>.workers.dev/webhooks/resend`.

4. **Set the Signing Secret**:
   - In the Resend dashboard, find the signing secret for the webhook and set it as `RESEND_WEBHOOK_SECRET`.

5. **Add the Secrets to Cloudflare Worker**:
   - Use the following commands to add the secrets to your Cloudflare Worker:
     ```bash
     npx wrangler secret put RESEND_API_KEY
     npx wrangler secret put RESEND_WEBHOOK_SECRET
     npx wrangler secret put INBOX_DOMAIN
     ```

6. **Verify the Configuration**:
   - After setting up, you can verify the webhook by checking the delivery logs in the Resend dashboard or using the MailAgent debug UI.

Make sure to follow these steps carefully to ensure that the webhook is configured correctly.
