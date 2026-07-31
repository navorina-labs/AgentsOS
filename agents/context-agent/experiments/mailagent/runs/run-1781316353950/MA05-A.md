# MA05 (A)

## Answer

When OTP is empty but a message exists in the inbox, it could be due to the following reasons:

- **Message Format**: The message may be in HTML format only, and the extraction process may not be able to parse the OTP from it.
- **Magic Link**: The message might contain a magic link instead of an OTP, which would result in the OTP field being empty.
- **Incorrect Subject Filter**: If the `subjectContains` filter used during the wait or extraction does not match the actual subject of the email, the extraction may fail to retrieve the OTP.
- **Message Content**: The OTP may not be present in the expected format or location within the message body, leading to an empty extraction.

To troubleshoot, you can:
- Check the raw MIME of the message using `GET /v1/inboxes/:id/messages/:messageId/raw` to see the full content.
- Ensure that the message contains the expected OTP format and that the extraction logic is correctly implemented.
