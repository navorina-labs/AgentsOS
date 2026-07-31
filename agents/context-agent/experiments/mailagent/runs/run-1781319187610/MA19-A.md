# MA19 (A)

## Answer

To configure the Resend webhook for MailAgent, follow these steps:

1. **Obtain the Resend API key**:
   - Go to your Resend account and navigate to the API Keys section to get your `RESEND_API_KEY`.

2. **Set the webhook URL**:
   - For local development, set the webhook URL to your local tunnel (e.g., using ngrok or cloudflared):
     ```
     https://<tunnel>/webhooks/resend
     ```
   - For production, set the webhook URL to:
     ```
     https://mailagent.<subdomain>.workers.dev/webhooks/resend
     ```

3. **Configure the webhook in Resend**:
   - In the Resend dashboard, go to the **Webhooks** section.
   - Set the event to listen for: `email.received`.
   - Enter the URL you obtained in the previous step.

4. **Set the signing secret**:
   - Copy the signing secret from the Resend dashboard and set it as `RESEND_WEBHOOK_SECRET` in your environment variables.

5. **Deploy your changes**:
   - If you made changes to your environment variables, ensure they are deployed to your Cloudflare Worker.

6. **Verify the webhook**:
   - You can test the webhook by sending a test email to the configured inbox and checking if the webhook is triggered correctly.

For more detailed instructions, refer to the **Resend** section in the [MailAgent setup documentation](./SETUP.md).
