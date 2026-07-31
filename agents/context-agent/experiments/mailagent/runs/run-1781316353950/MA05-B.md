# MA05 (B)

## Answer

When OTP is empty but a message exists in the inbox, it could be due to several reasons:

- **Magic Link Only**: The message may contain only a magic link without an OTP. In this case, the flow should use `verification.primaryLink`.
  
- **HTML-Only OTP**: The OTP might be embedded in an HTML element (e.g., an image) that cannot be extracted. You can check this by using `GET /v1/inboxes/{id}/messages/{messageId}/raw` or `mailagent_get_raw_message`.

- **Extract Miss**: The extraction process may have failed. You can attempt to extract using structured extraction by posting to `POST /v1/inboxes/:id/messages/:messageId/extract` with a preset of `2fa`.

- **Multiple Codes**: If there are multiple codes in the email, the extraction may have picked the wrong one. This can happen if the regex order is not specific enough.

- **Wrong Message Index**: If the wrong message index is used (e.g., reading the welcome email instead of the verification email), it may lead to an empty OTP. Adjust the `messageIndex` to ensure the correct message is being read.
