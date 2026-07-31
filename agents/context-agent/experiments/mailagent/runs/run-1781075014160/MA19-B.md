# MA19 (B)

## Answer

To configure the Resend webhook, follow these steps:

1. **Set Up Webhook URL**:
   - For development, use a tunnel to expose your local server.
   - The webhook URL should be in the format: `https://<tunnel>/webhooks/resend`.

2. **Webhook Event**:
   - The webhook will trigger on the event: `email.received`.

3. **Verify Signature**:
   - Use the `RESEND_WEBHOOK_SECRET` to verify the svix signature of incoming webhook requests.

4. **Update Production Webhook**:
   - After deploying to production, update the Resend webhook to point to the production URL.

Make sure to check the Resend dashboard for webhook events and ensure that the `INBOX_DOMAIN` matches the address suffix.
