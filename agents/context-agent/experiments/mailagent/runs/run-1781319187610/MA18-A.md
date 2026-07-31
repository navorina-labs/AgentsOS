# MA18 (A)

## Answer

The email ingest pipeline in the MailAgent project involves the following steps:

1. **Email Reception**:
   - Emails are received via the Resend service, which handles inbound email delivery.

2. **Processing Inbound Email**:
   - The `processInboundEmail` function is called to handle the received email message.
   - This function processes the email and prepares it for further actions, such as extracting relevant information.

3. **Notification**:
   - After processing, a notification is sent to the corresponding inbox using the `notifyInbox` function.
   - This function sends a `POST` request to the durable object responsible for managing the inbox, notifying it of the new message.

4. **Durable Object Notification**:
   - The `InboxWait` durable object maintains a list of subscribers waiting for messages.
   - When notified, it broadcasts the message details (including OTP and links) to all subscribers.

5. **Message Storage**:
   - The email message is stored in the database, including its metadata (e.g., sender, subject, received time).
   - If configured, the raw MIME of the email is also downloaded and stored in Cloudflare R2 for later retrieval.

6. **SSE and Polling**:
   - Clients can subscribe to receive real-time updates about new messages via Server-Sent Events (SSE).
   - Alternatively, clients can poll the API to check for new messages.

7. **Extraction**:
   - The system can extract specific information from the email, such as OTPs or links, using the `mailagent_extract_verification` tool.

8. **Callback Handling**:
   - If a `callbackUrl` is provided during inbox creation, the system sends a notification to that URL when a message is processed.

This pipeline allows for efficient handling of incoming emails, enabling features like OTP verification and automated testing without manual intervention.
