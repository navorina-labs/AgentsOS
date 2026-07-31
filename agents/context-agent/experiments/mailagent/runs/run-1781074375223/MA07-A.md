# MA07 (A)

## Answer

The following REST API endpoints exist for managing inboxes:

1. **List Inboxes**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes`
   - **Description:** List inboxes (can filter by label or labelPrefix).

2. **Create Inbox**
   - **Method:** `POST`
   - **Path:** `/v1/inboxes`
   - **Description:** Create a new inbox.

3. **Get Inbox**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id`
   - **Description:** Get details of a specific inbox by its ID.

4. **Delete Inbox**
   - **Method:** `DELETE`
   - **Path:** `/v1/inboxes/:id`
   - **Description:** Delete a specific inbox by its ID.

5. **Open Inbox (One-shot)**
   - **Method:** `POST`
   - **Path:** `/v1/inboxes/open`
   - **Description:** Create an inbox, wait for a message, extract verification details, and optionally delete the inbox.

6. **Wait for Message**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/wait`
   - **Description:** Block until a message arrives in the specified inbox.

7. **Extract Verification Details**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/extract`
   - **Description:** Extract OTP and links from the latest message in the specified inbox.

8. **List Messages**
   - **Method:** `GET`
   - **Path:** `/v1/inboxes/:id/messages`
   - **Description:** List messages in a specific inbox.

9. **Simulate Message**
   - **Method:** `POST`
   - **Path:** `/v1/inboxes/:id/simulate`
   - **Description:** Inject a test OTP email into an inbox without real SMTP.

10. **Send Message**
    - **Method:** `POST`
    - **Path:** `/v1/inboxes/:id/send`
    - **Description:** Send an outbound email from the specified inbox.

11. **List Threads**
    - **Method:** `GET`
    - **Path:** `/v1/inboxes/:id/threads`
    - **Description:** List email threads in a specific inbox.

12. **List Messages in a Thread**
    - **Method:** `GET`
    - **Path:** `/v1/inboxes/:id/threads/:threadId/messages`
    - **Description:** List messages in a specific thread within an inbox.

13. **Search Messages**
    - **Method:** `GET`
    - **Path:** `/v1/inboxes/:id/search`
    - **Description:** Search messages in a specific inbox by keyword.

14. **Diagnose Inbox**
    - **Method:** `GET`
    - **Path:** `/v1/inboxes/:id/diagnose`
    - **Description:** Get diagnostic information for a specific inbox.

These endpoints allow for comprehensive management of inboxes, including creation, retrieval, deletion, and message handling.
