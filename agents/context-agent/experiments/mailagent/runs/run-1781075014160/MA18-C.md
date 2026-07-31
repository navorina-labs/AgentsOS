# MA18 (C)

## Answer

The email ingest pipeline in the MailAgent project follows these steps:

1. **Inbound Email Reception**:
   - Emails are sent to the Resend MX (configured with `INBOX_DOMAIN`).
   - Resend stores the email and triggers a webhook event (`email.received`).

2. **Webhook Handling**:
   - The webhook endpoint (`POST /webhooks/resend`) verifies the signature using `RESEND_WEBHOOK_SECRET`.
   - If valid, it enqueues a message to the `MAIL_QUEUE` with details like `provider`, `emailId`, `from`, `to`, `subject`, and `receivedAt`.

3. **Queue Processing**:
   - A consumer processes the queued messages:
     - It finds the corresponding inbox using the recipient's address.
     - It checks if the sender is allowed using the `isSenderAllowed` function.
     - It fetches the email content from Resend using `resend.emails.receiving.get(emailId)`.

4. **Email Content Extraction**:
   - The email's text and HTML content are combined.
   - OTP (One-Time Password) and links are extracted using the `extractOtp` and `extractLinks` functions.

5. **Message Insertion**:
   - A unique message ID is generated.
   - The message is inserted into the database with relevant details (e.g., sender, subject, previews, OTP, links).

6. **Raw MIME Storage**:
   - If a raw download URL is present, the raw MIME is stored in R2 using `storeRawMimeFromUrl`.

7. **Thread Resolution**:
   - The system resolves the thread ID and in-reply-to message ID using `resolveInboundThread`.

8. **Indexing for Search**:
   - The message is indexed for search capabilities using `indexMessageSearch`.

9. **Attachment Handling**:
   - Any attachments are saved using `saveAttachmentsFromEmail`.

10. **Callback Notification**:
    - If a callback URL is set for the inbox, a callback is triggered using `fireInboxCallback`.

11. **Notification to Waiting Clients**:
    - The system notifies any waiting clients (e.g., via SSE) about the new message.

This pipeline ensures that emails are processed efficiently, with checks for sender validity, storage of relevant data, and notifications to users or systems as needed.
