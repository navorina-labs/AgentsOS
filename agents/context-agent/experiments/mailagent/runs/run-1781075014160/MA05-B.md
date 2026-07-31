# MA05 (B)

## Answer

If the OTP is empty but a message exists in the inbox, consider the following checks:

- **Check the message content**: Use `GET …/messages/:id/raw` to inspect the raw message. It may be HTML-only, which could prevent OTP extraction.
- **Magic link only**: The message might contain only a magic link. In this case, use `primaryLink` or check the `links[]` array.
- **Wrong service preset**: Ensure that the `service` matches the actual "From" domain of the email.
