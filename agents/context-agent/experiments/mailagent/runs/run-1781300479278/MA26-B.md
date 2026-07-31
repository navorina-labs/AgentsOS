# MA26 (B)

## Answer

The `callbackUrl` is used for the following purposes:

- **Inbound or Simulated Message Processing**: It is specified when creating an inbox and is triggered when a message is processed.
- **Notification**: The system fires a callback to the specified URL with a JSON payload containing details about the processed message, such as `inboxId`, `otp`, and `primaryLink`.
- **Audit Logging**: Callback deliveries are logged for auditing purposes, allowing users to track callback events.
- **Parallel Processing**: It allows for handling long flows in parallel, as opposed to polling only.

The callback is validated to ensure it meets security requirements (HTTPS, no internal IPs in production).
