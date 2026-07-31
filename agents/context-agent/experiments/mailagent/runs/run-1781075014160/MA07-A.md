# MA07 (A)

## Answer

The following REST API endpoints exist for managing inboxes:

1. **Create Inbox**
   - **Method:** `POST`
   - **Path:** `/v1/inboxes`
   - **Description:** Create a new inbox.

2. **Open Inbox (One-shot)**
   - **Method:** `POST`
   - **Path:** `/v1/inboxes/open`
   - **Description:** Create an inbox, wait for a message, extract it, and optionally delete the inbox.

3. **Get Inbox Status**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id`
   - **Description:** Retrieve the status of a specific inbox.

4. **List Inboxes**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes`
   - **Description:** List all inboxes, with optional filters by label or label prefix.

5. **Delete Inbox**
   - **Method:** `DELETE`
   - **Path:** `/v1/inboxes/:id`
   - **Description:** Delete a specific inbox.

6. **List Messages in Inbox**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/messages`
   - **Description:** Retrieve messages associated with a specific inbox.

7. **Extract OTP and Links from Latest Message**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/extract`
   - **Description:** Extract OTP and links from the latest message in the inbox.

8. **Wait for a Message**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/wait`
   - **Description:** Poll for a new message in the inbox.

9. **Get Events for Inbox**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/events`
   - **Description:** Stream events for new messages in the inbox (SSE).

10. **Delete Inboxes by Label Prefix**
    - **Method:** `DELETE`
    - **Path:** `/v1/inboxes`
    - **Description:** Bulk delete inboxes that match a specified label prefix.

11. **Simulate Inbound Message**
    - **Method:** `POST`
    - **Path:** `/v1/inboxes/:id/simulate`
    - **Description:** Inject a test OTP email into an inbox without real SMTP.

12. **Send Email from Inbox**
    - **Method:** `POST`
    - **Path:** `/v1/inboxes/:id/send`
    - **Description:** Send an outbound email from a specific inbox.

13. **List Threads in Inbox**
    - **Method:** `GET`
    - **Path:** `/v1/inboxes/:id/threads`
    - **Description:** List email threads in a specific inbox.

14. **List Messages in a Thread**
    - **Method:** `GET`
    - **Path:** `/v1/inboxes/:id/threads/:threadId/messages`
    - **Description:** Retrieve messages in a specific thread.

15. **Search Messages in Inbox**
    - **Method:** `GET`
    - **Path:** `/v1/inboxes/:id/search`
    - **Description:** Search messages in the inbox by keyword.

16. **Diagnose Inbox**
    - **Method:** `GET`
    - **Path:** `/v1/inboxes/:id/diagnose`
    - **Description:** Get diagnostic information for an inbox.

These endpoints provide comprehensive functionality for creating, managing, and interacting with temporary inboxes.
