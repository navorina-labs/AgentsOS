# MA26 (A)

## Answer

The `callbackUrl` is used for:

- **Webhook Notification**: It allows MailAgent to send a `POST` request to the specified URL when a message is processed, such as when an email is received.
- **Debugging**: It can be used to receive notifications about the status of the inbox and the messages, which is particularly useful for CI (Continuous Integration) and QA (Quality Assurance) processes.

The `callbackUrl` is specified when creating an inbox and must be a valid HTTPS URL.
