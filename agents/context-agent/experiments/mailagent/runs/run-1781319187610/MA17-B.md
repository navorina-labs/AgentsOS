# MA17 (B)

## Answer

The simulate feature for QA in the MailAgent project works as follows:

- **Endpoint**: `POST /v1/inboxes/:id/simulate`
- **Purpose**: Allows injecting test messages without using real SMTP, facilitating contract tests and QA processes.
- **Body Parameters**:
  - `scenario`: Optional, specifies the type of simulation (e.g., otp, magic_link, attachment).
  - `otp`: Optional, can provide a specific OTP.
  - `from`: Optional, specifies the sender's email address.
  - `subject`: Optional, specifies the email subject.
  - `fireCallback`: Optional, if true, triggers the inbox callback.
  - `attachmentFilename`: Optional, specifies a filename for simulated attachments.
  - `inReplyToMessageId`, `rfcMessageId`, `inReplyTo`, `references`, `headers`: Additional optional fields for simulating message details.

### Flow:
1. **Inbox Validation**: Checks if the specified inbox exists and is not expired.
2. **Scenario Resolution**: Resolves the simulation scenario to set default values if not provided.
3. **OTP Default**: If no OTP is provided, a default OTP (`482910`) is used.
4. **Provider ID**: Generates a unique `providerId` for the simulated message.
5. **Message Insertion**: Inserts the message into the system without checking the sender allowlist.
6. **Search Indexing**: Indexes the message for search functionality.
7. **Optional Attachment Handling**: If specified, simulates the attachment metadata.
8. **Notification**: Notifies inbox waiters about the new message.
9. **Callback Trigger**: If `fireCallback` is true and a callback URL is set, it triggers the inbox callback.

### Scenarios List:
- Available via `GET /v1/inboxes/simulate/scenarios`, which lists the different scenarios that can be simulated.

This process allows for comprehensive testing without the need for actual email delivery, making it efficient for QA and development purposes.
