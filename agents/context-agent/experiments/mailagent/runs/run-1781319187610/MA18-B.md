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
   - A 200 response is returned indicating the email has been queued.
5. **Queue Consumer**:
   - The consumer processes the queued message using `processInboundEmail(env, job, notifyInbox)`.
   - On success, the message is acknowledged (`msg.ack()`).
   - If an error occurs, the message is retried (up to 5 times).
   - If retries are exhausted, the message is moved to the dead letter queue (DLQ).

### Key Stages in `processInboundEmail`:
- **Stage 0**: Select Resend client based on team ID.
- **Stage 1**: Resolve the inbox associated with the email.
- **Stage 2**: Check sender against the allowlist.
- **Stage 3**: Fetch the email body from Resend.
- **Stage 4**: Extract OTP and links from the email content.
- **Stage 5**: Store raw MIME data in R2.
- **Stage 6**: Resolve threading information.
- **Stage 7**: Insert the message into the database (idempotently).
- **Stage 8**: Index the message for search.
- **Stage 9**: Save any attachments.
- **Stage 10**: Notify any waiting clients.
- **Stage 11**: Trigger the inbox callback if configured.
- **Stage 12**: Fire team event webhook if applicable.

This pipeline ensures that emails are processed reliably and efficiently, with mechanisms for error handling and notifications.
