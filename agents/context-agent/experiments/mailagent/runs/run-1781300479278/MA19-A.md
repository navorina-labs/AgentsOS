# MA19 (A)

## Answer

To configure the Resend webhook for MailAgent, follow these steps:

1. **Obtain the Resend API key**:
   - Go to your Resend account and generate an API key.

2. **Set the Resend API key in your environment**:
   - Add the API key to your environment variables as `RESEND_API_KEY`.

3. **Set the webhook URL**:
   - For local development, the webhook URL should point to your local tunnel (e.g., using ngrok or cloudflared) that forwards to the MailAgent Worker. The URL format is:
     ```
     https://<tunnel-url>/webhooks/resend
     ```
   - For production, the URL should be:
     ```
     https://mailagent.<subdomain>.workers.dev/webhooks/resend
     ```

4. **Configure the webhook in the Resend dashboard**:
   - Go to the **Webhooks** section in your Resend dashboard.
   - Set the event to listen for: `email.received`.
   - Enter the webhook URL you configured in the previous step.

5. **Set the signing secret** (optional but recommended):
   - Copy the signing secret from the Resend dashboard and set it in your environment as `RESEND_WEBHOOK_SECRET`.

6. **Deploy your MailAgent Worker**:
   - Run the deployment command to ensure the webhook is active:
     ```bash
     npm run deploy
     ```

7. **Verify the webhook**:
   - You can test the webhook by sending a test email to the configured inbox and checking if the webhook is triggered correctly.

Make sure to check the MailAgent documentation for any additional details or updates regarding webhook configuration.
