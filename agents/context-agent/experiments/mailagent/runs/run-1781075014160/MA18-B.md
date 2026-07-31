# MA18 (B)

## Answer

The email ingest pipeline consists of several stages that process inbound email messages. Here’s a breakdown:

1. **Webhook Trigger**
   - Endpoint: `POST /webhooks/resend`
   - Verifies the Svix signature using `RESEND_WEBHOOK_SECRET`.
   - Enqueues the email message with `MAIL_QUEUE.send({ provider, emailId, from, to, subject, receivedAt })`.
   - Responds with `200 { ok: true, queued: true }`.

2. **Queue Consumer**
   - Finds the inbox by the recipient address (`to[]`).
   - Checks if the sender is allowed (`isSenderAllowed(from, inbox.allowed_senders)`).
   - Retrieves the email using `resend.emails.receiving.get(emailId)`.
   - Extracts OTP and links from the email content.
   - Inserts the message into the database (ensuring idempotency with `provider_id`).
   - Stores raw MIME data in R2 if a download URL is present.
   - Saves any attachments from the email.
   - Resolves the inbound thread using `thread_id` and `in_reply_to`.
   - Indexes the message for search capabilities.
   - Fires a callback if a `callback_url` is set.
   - Notifies the inbox and broadcasts updates via SSE.

3. **Ingest Service**
   - Located in `src/services/resend-mail.ts`.
   - Responsible for fetching, filtering, extracting, and storing the email data.

4. **Extraction**
   - Handled by `src/services/extract.ts`.
   - Extracts OTP and links from the email content.

5. **Verification**
   - Managed by `src/services/message-verify.ts`.
   - Verifies the format of the incoming message.

6. **Raw MIME Storage**
   - Managed by `src/services/raw-mime-r2.ts`.
   - Archives raw MIME data in R2.

7. **Attachments Handling**
   - Managed by `src/services/message-attachments.ts`.
   - Stores metadata and caches attachments in R2.

8. **Thread Resolution**
   - Managed by `src/services/thread-resolve.ts`.
   - Groups messages into conversations.

9. **Search Indexing**
   - Managed by `src/services/message-search.ts`.
   - Indexes messages for keyword and semantic search.

10. **Callback Handling**
    - Managed by `src/services/callback.ts`.
    - Sends POST requests to the specified callback URL.

11. **Notification**
    - Managed by `src/durable-objects/inbox-wait.ts`.
    - Pushes updates to clients via SSE.

This pipeline ensures that inbound emails are processed efficiently and reliably.
