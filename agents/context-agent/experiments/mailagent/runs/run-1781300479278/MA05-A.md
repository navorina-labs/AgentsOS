# MA05 (A)

## Answer

When OTP is empty but a message exists in the inbox, it could be due to the following reasons:

- **Message Format**: The message may be in HTML format, and the OTP extraction process might not be able to parse it correctly. Check if the message contains the OTP in a format that the extraction logic can recognize.
  
- **Message Type**: The message might not be an OTP email. For example, it could be a welcome email or another type of notification that does not include an OTP.

- **Extraction Logic**: The extraction logic may not be functioning as expected. You can check the raw MIME of the message to see if the OTP is present but not being extracted.

- **Multiple Messages**: If there are multiple messages in the inbox, ensure that the correct message is being referenced for OTP extraction. Use the `messageIndex` parameter to specify which message to check.

To troubleshoot further, you can:
- Open the raw MIME of the message using `GET /v1/inboxes/:id/messages/:messageId/raw`.
- Check if the OTP is present in the message body or if it is located in a different part of the email (like a link).
