# MA19 (C)

## Answer

To configure the Resend webhook, follow these steps:

1. **Obtain the Resend API Key**:
   - Go to [resend.com](https://resend.com) and navigate to API Keys to get your `RESEND_API_KEY`.

2. **Set Up Receiving Domain**:
   - In the Resend dashboard, under **Emails → Receiving**, create a domain (e.g., `abc123.resend.app`) and set it as `INBOX_DOMAIN=abc123.resend.app`.

3. **Configure Webhook URL**:
   - Set the webhook URL for the `email.received` event:
     - For local development: `https://<tunnel>/webhooks/resend` (using tools like cloudflared or ngrok).
     - For production: `https://mailagent.<subdomain>.workers.dev/webhooks/resend`.

4. **Set the Webhook Signing Secret**:
   - In the Resend dashboard, obtain the signing secret and set it as `RESEND_WEBHOOK_SECRET`.

5. **Update Environment Variables**:
   - Ensure your environment variables are set correctly in your `.env` or `.dev.vars` file:
     ```plaintext
     RESEND_API_KEY=<your_resend_api_key>
     INBOX_DOMAIN=abc123.resend.app
     RESEND_WEBHOOK_SECRET=<your_webhook_secret>
     ```

6. **Deploy Changes**:
   - If applicable, deploy your changes to ensure the webhook is active.

7. **Verify Configuration**:
   - Test the webhook by sending a test email to the configured domain and check if it is received correctly.

By following these steps, you will have configured the Resend webhook successfully.
