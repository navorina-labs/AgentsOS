# MA18 (A)

## Answer

The email ingest pipeline in the MailAgent project involves the following steps:

1. **Webhook Reception**:
   - Incoming emails are received via a webhook configured in Resend.
   - The webhook URL is set to point to the MailAgent worker.

2. **Queue Processing**:
   - The received email is processed and queued for further handling.
   - A message is sent to a queue (e.g., `MAIL_QUEUE`) for asynchronous processing.

3. **Durable Object Notification**:
   - A Durable Object (e.g., `InboxWait`) is used to manage subscriptions for clients waiting for messages.
   - When an email is processed, the Durable Object notifies all subscribers about the new message.

4. **Message Storage**:
   - The email details are stored in a database (Neon Postgres) in the `messages` table.
   - The raw MIME of the email is downloaded and stored in Cloudflare R2 for later retrieval.

5. **Callback Delivery**:
   - If a `callbackUrl` is specified when creating the inbox, MailAgent sends a POST request to this URL with the email details (e.g., OTP, links).
   - This allows for real-time notifications to the client or system that initiated the email verification process.

6. **SSE (Server-Sent Events)**:
   - Clients can subscribe to receive updates about new messages via SSE, allowing them to react to incoming emails without polling.

7. **Message Extraction**:
   - The system can extract relevant information (e.g., OTP, links) from the email for further processing or verification.

8. **Inbox Management**:
   - Inboxes are created and managed dynamically, allowing for temporary email addresses that can be deleted after use.

This pipeline ensures that emails are processed efficiently, allowing for real-time notifications and easy integration with various services.
