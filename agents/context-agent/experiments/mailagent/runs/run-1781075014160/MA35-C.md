# MA35 (C)

## Answer

The `mailagent_verify_signup` MCP tool is designed for verifying signups through email. Here are its key features:

- **Description**: Waits for a verification email and returns the agent's primary action, which can be either an OTP (One-Time Password) or a magic link along with instructions.
- **Input Schema**:
  - `inboxId`: Existing inbox after form submission.
  - `service`: The service for which the signup is being verified.
  - `runId`: Agent run ID for tracing.
  - `label`: Optional label for the inbox.
  - `subjectContains`: Optional string to filter the email subject.
  - `messageIndex`: Specifies which email to consider (0 for the newest).
  - `timeoutSeconds`: Time limit for waiting for the email (5 to 120 seconds).
  - `ttlMinutes`: Time-to-live for the inbox.
  - `deleteAfter`: Boolean indicating whether to delete the inbox after verification.

This tool is part of the MailAgent's functionality to facilitate automated email verification processes for various services.
