# MA18 (A)

## Answer

The email ingest pipeline in the MailAgent project involves the following steps:

1. **Email Reception**:
   - Emails are received via the Resend service, which handles inbound email delivery.

2. **Queue Processing**:
   - Incoming emails trigger a message in a queue (e.g., `mailagent-email`).
   - A worker processes the queued messages, invoking the `processInboundEmail` function.

3. **Message Processing**:
   - The `processInboundEmail` function extracts relevant information from the email, such as:
     - Sender address
     - Subject
     - OTP (One-Time Password)
     - Links (e.g., verification links)
   - The email content is parsed, and the extracted data is structured for further use.

4. **Database Storage**:
   - The processed email data is stored in a PostgreSQL database, specifically in the `messages` table.
   - Each message is linked to an inbox, which is also stored in the `inboxes` table.

5. **Notification**:
   - After processing, a notification is sent to any subscribed clients (e.g., via SSE or a callback URL) to inform them that a new message has been received.
   - This notification includes details such as the inbox ID, OTP, and any links extracted from the email.

6. **SSE Subscription**:
   - Clients can subscribe to updates via a Durable Object that maintains a list of subscribers.
   - When a new message is processed, the subscribers are notified in real-time.

7. **Debugging and Diagnostics**:
   - If there are issues (e.g., timeouts or missing messages), developers can use the debug UI or the `GET /v1/inboxes/:id/diagnose` endpoint to troubleshoot the inbox and message status.

This pipeline allows for efficient handling of email verification processes, enabling automated testing and integration with various services.
