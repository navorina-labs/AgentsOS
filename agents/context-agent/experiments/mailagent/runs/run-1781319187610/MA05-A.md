# MA05 (A)

## Answer

When OTP is empty but a message exists in the inbox, it could be due to the following reasons:

- **Message Type**: The message may not contain an OTP. For example, it could be a welcome email or a different type of notification that does not include an OTP.
- **HTML Parsing**: The message might be in HTML format, and the extraction process may not have successfully parsed the OTP from the email body.
- **Message Index**: If multiple messages exist, the OTP might be in a different message than the one being checked. Ensure that the correct message index is being used when waiting for or extracting the OTP.
- **Links**: If the message contains a magic link instead of an OTP, the extraction process may return the link but not an OTP.

To troubleshoot, you can:
- Check the raw MIME of the message to see its content.
- Verify the subject and ensure that the expected OTP message is being targeted.
- Use the `GET /v1/inboxes/:id/messages` API to list all messages and confirm their content.
