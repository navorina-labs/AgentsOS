# MA05 (B)

## Answer

When OTP is empty but a message exists in the inbox, it could be due to several reasons:

- **Magic Link Only**: The message may contain only a magic link without an OTP. In this case, use `verification.primaryLink` or check if `agent.primaryAction.type` is `"magic_link"`.

- **HTML-Only OTP**: The OTP might be embedded in an HTML element (e.g., an image) that is not extractable. You can try using `GET /v1/inboxes/{id}/messages/{messageId}/raw` to check the raw content.

- **Extract Miss**: The extraction process may have failed to identify the OTP. You can attempt to extract using structured extraction by posting to `POST /v1/inboxes/:id/messages/:messageId/extract` with a preset like `"2fa"`.

- **Multiple Codes**: If there are multiple codes in the email, the extraction may have picked the wrong one or none at all. Check the message content for any other codes.

- **Wrong Message Index**: If the wrong message index is used (e.g., reading the welcome email instead of the verification email), adjust the `messageIndex` to ensure you are targeting the correct message.
