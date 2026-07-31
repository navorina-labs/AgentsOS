# MA05 (A)

## Answer

When a message exists in the inbox but the OTP is empty, it could be due to the following reasons:

- **HTML-Only Email**: The email may be in HTML format only, and the extraction process uses both text and HTML. If the OTP is not present in the text version, it may not be extracted.
- **Magic Link**: The message might contain a magic link instead of an OTP. In this case, the `primaryLink` should be used instead of the OTP.
- **Parsing Issues**: The message may have been received, but the extraction logic did not find the OTP due to formatting or content issues.
- **Incorrect Extraction Logic**: The extraction function may not be correctly identifying the OTP in the message content.

To troubleshoot, you can:
- Check the raw MIME of the message to see its content.
- Verify if the message contains a magic link or if the OTP is present in a different format.
- Use the `GET /v1/inboxes/:id/messages/:messageId/raw` endpoint to inspect the raw message.
