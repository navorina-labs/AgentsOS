# MA18 (C)

## Answer

The email ingest pipeline in the MailAgent project consists of the following steps:

1. **Email Reception**:
   - Emails are received via Resend's MX (Mail Exchange) configured for the inbox domain.

2. **Webhook Trigger**:
   - Resend sends a webhook notification to the MailAgent at the endpoint `/webhooks/resend` (or `/webhooks/resend/team/:teamId` for enterprise setups).

3. **Signature Verification**:
   - The webhook payload is verified using the `RESEND_WEBHOOK_SECRET` or a team-specific secret.

4. **Event Handling**:
   - If the event type is `email.received`, the email data is processed; otherwise, the event is skipped.

5. **Queueing**:
   - An `EmailQueueMessage` is created with details such as the email ID, sender, recipient(s), subject, and received timestamp.
   - This message is sent to the `MAIL_QUEUE` for further processing.

6. **Queue Consumer**:
   - A queue consumer processes the queued messages by calling the `processInboundEmail` function.

7. **Email Processing**:
   - The `processInboundEmail` function performs the following:
     - Finds the corresponding inbox based on the recipient address.
     - Checks if the sender is allowed (using the sender allowlist).
     - Fetches the email content from Resend using the email ID.
     - Extracts OTPs and links from the email body.
     - Resolves threading information (e.g., In-Reply-To, References).
     - Inserts the email message into the database.
     - Saves any attachments associated with the email.
     - Notifies any waiting processes or callbacks.

8. **Notification**:
   - If configured, the system sends notifications to the inbox's callback URL and/or fires events for team notifications.

This pipeline ensures that emails are efficiently received, processed, and stored while maintaining security and allowing for further actions based on the email content.
