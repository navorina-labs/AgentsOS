# MA05 (B)

## Answer

When OTP is empty but a message exists in the inbox, it could be due to several reasons:

- **Magic Link Only**: The message may contain only a magic link without an OTP. In this case, the flow should use `primaryLink` instead of expecting an OTP.
  
- **HTML-Only OTP**: The OTP might be embedded in an HTML element (e.g., an image) that cannot be extracted. You can check the raw message using `GET /v1/inboxes/{id}/messages/{messageId}/raw` or use `mailagent_get_raw_message`.

- **Extraction Miss**: The extraction process may have failed to identify the OTP. You can attempt to extract it again using structured extraction with a preset (e.g., `POST /v1/inboxes/:id/messages/:messageId/extract` with preset `2fa`).

- **Multiple Codes**: If the email contains multiple codes, the extraction may have picked the wrong one. This can happen if the regex order is not specific enough.

- **Wrong Message Index**: If the message index used to retrieve the message is incorrect (e.g., pointing to a welcome email instead of a verification email), it may lead to an empty OTP. Adjust the `messageIndex` to ensure it targets the correct message.
