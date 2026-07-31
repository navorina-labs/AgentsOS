# MA19 (B)

## Answer

To configure the Resend webhook for the MailAgent project, follow these steps:

1. **Set Up Resend:**
   - Go to the Resend dashboard and navigate to the **Webhooks** section.
   - Create a new webhook for the event type `email.received`.

2. **Webhook URL:**
   - For production, set the webhook URL to:
     ```
     https://api.webmailagent.com/webhooks/resend
     ```
   - If using a dedicated Resend for an enterprise team, use:
     ```
     https://api.webmailagent.com/webhooks/resend/team/:teamId
     ```

3. **Signing Secret:**
   - Obtain the signing secret from Resend and set it in your environment variables:
     - For the general webhook, set:
       ```
       RESEND_WEBHOOK_SECRET=whsec_...
       ```
     - For the dedicated team webhook, ensure you have the team-specific secret.

4. **Verify Signature:**
   - Ensure that the MailAgent verifies the webhook signature using the provided secret when receiving requests.

5. **Test the Webhook:**
   - After setting up, send a test email to verify that the webhook is correctly configured and that MailAgent processes the incoming emails as expected.

Make sure to check the Resend dashboard for successful deliveries and troubleshoot any issues if emails are not being received.
