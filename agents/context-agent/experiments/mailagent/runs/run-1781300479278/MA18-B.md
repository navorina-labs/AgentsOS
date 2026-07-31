# MA18 (B)

## Answer

The email ingest pipeline for MailAgent consists of the following stages:

1. **Sender SMTP**: The email is sent to Resend MX (either the INBOX_DOMAIN or a team domain).
2. **Resend Storage**: Resend stores the email.
3. **Webhook Trigger**:
   - A POST request is made to `/webhooks/resend` (or `/webhooks/resend/team/:teamId` for enterprise).
   - The webhook payload is verified using svix.
   - If the event type is `email.received`, the process continues; otherwise, it is skipped.
4. **Enqueue Email**:
   - The email details are sent to the MAIL_QUEUE using `MAIL_QUEUE.send(EmailQueueMessage)`.
   - A 200 response is returned with `{ ok: true, queued: true }`.

5. **Queue Consumer**:
   - The consumer processes the queued message using `processInboundEmail(env, job, notifyInbox)`.
   - On success, the message is acknowledged (`msg.ack()`).
   - If an error occurs, the message is retried (up to 5 times).
   - If retries are exhausted, the message is sent to the dead letter queue (DLQ).

6. **Process Inbound Email**:
   - **Stage 0**: Select the Resend client based on the team ID.
   - **Stage 1**: Resolve the inbox associated with the email.
   - **Stage 2**: Check the sender against the allowed sender list.
   - **Stage 3**: Fetch the email body from Resend.
   - **Stage 4**: Extract OTP and links from the email content.
   - **Stage 5**: Store the raw MIME in R2 if available.
   - **Stage 6**: Resolve threading information for the email.
   - **Stage 7**: Insert the message into the database (idempotently).
   - **Stage 8**: Index the message for search.
   - **Stage 9**: Save any attachments associated with the email.
   - **Stage 10**: Notify any waiters (subscribers) about the new message.
   - **Stage 11**: Trigger the inbox callback if a callback URL is set.
   - **Stage 12**: Fire a team event webhook if applicable.

This pipeline ensures that emails are processed reliably and efficiently, with mechanisms for error handling and notifications.
