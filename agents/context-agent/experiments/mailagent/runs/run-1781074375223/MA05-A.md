# MA05 (A)

## Answer

When a message exists in the inbox but the OTP is empty, it could be due to the following reasons:

- **HTML-Only Email**: The email may be formatted in HTML only, and the extraction process may not be able to parse it correctly for the OTP.
- **Magic Link**: The message might contain a magic link instead of an OTP. In this case, the extraction would return the link but not an OTP.
- **Incorrect Extraction Logic**: The extraction logic may not be correctly identifying the OTP in the message content.
- **Message Format**: The message may not conform to the expected format for OTP extraction, leading to an empty result.

To troubleshoot, you can:
- Check the raw MIME of the message to see its content.
- Verify if the message contains a magic link or if the OTP is present in a different format.
- Use the `GET /v1/inboxes/:id/messages/:messageId/raw` endpoint to inspect the full message content.
