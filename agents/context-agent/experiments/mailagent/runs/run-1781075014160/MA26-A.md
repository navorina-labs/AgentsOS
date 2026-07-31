# MA26 (A)

## Answer

The `callbackUrl` is used for:

- **Webhook Delivery**: It allows MailAgent to send a `POST` request to the specified URL when a message is processed, such as when an email is received.
- **Asynchronous Testing**: In QA scenarios, it enables tests to receive notifications about message arrivals without polling, allowing for more efficient and responsive test flows.

The `callbackUrl` must be a valid HTTPS URL, and it is specified when creating an inbox.
