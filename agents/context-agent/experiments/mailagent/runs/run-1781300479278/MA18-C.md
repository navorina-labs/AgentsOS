# MA18 (C)

## Answer

The email ingest pipeline in the MailAgent project consists of the following steps:

1. **Sender SMTP**:
   - Emails are sent to the Resend MX server, which is configured with the INBOX_DOMAIN or a team-specific domain.

2. **Resend Email Storage**:
   - Resend stores the incoming email.

3. **Webhook Trigger**:
   - A POST request is made to the `/webhooks/resend` endpoint (or `/webhooks/resend/team/:teamId` for enterprise setups).
   - The webhook verifies the signature using the `RESEND_WEBHOOK_SECRET` or a team-specific secret.

4. **Event Handling**:
   - If the event type is `email.received`, the process continues; otherwise, it is skipped.

5. **Queue Message Creation**:
   - An `EmailQueueMessage` is created and sent to the `MAIL_QUEUE`.

6. **Queue Consumer**:
   - The queue consumer processes the message by calling the `processInboundEmail` function with the environment and job details.
   - On successful processing, the message is acknowledged; if it fails, it retries up to 5 times before moving to a dead-letter queue (DLQ).

7. **Email Processing**:
   - The `processInboundEmail` function handles:
     - Fetching the email body from Resend.
     - Extracting OTPs and links.
     - Storing the email in the database and R2.
     - Notifying any waiting processes or callbacks.

8. **Notification**:
   - If configured, notifications are sent to the inbox's callback URL and any relevant parties.

This pipeline ensures that emails are efficiently ingested, processed, and stored while providing mechanisms for error handling and notifications.
