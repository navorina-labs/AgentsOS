# MA35 (C)

## Answer

The `mailagent_verify_signup` MCP tool is designed for verifying email signups through a temporary inbox. Here are its key features:

- **Description**: It facilitates the verification process for signups by waiting for a verification email and returning the primary action (such as an OTP or magic link).
- **Input Schema**:
  - `inboxId`: Existing inbox after form submission.
  - `service`: The service for which the signup is being verified.
  - `flow`: The type of flow, which can be "signup", "login", or "password_reset".
  - `runId`: An identifier for the agent run (used for tracing).
  - `label`: An optional label for the verification process.
  - `subjectContains`: A filter for the subject substring of the verification email.
  - `messageIndex`: Specifies which message to consider (0 for the newest).
  - `timeoutSeconds`: The maximum time to wait for the verification email (between 5 and 120 seconds).
  - `ttlMinutes`: Time-to-live for the inbox.
  - `deleteAfter`: A boolean indicating whether to delete the inbox after verification.

This tool is part of the MailAgent's suite of tools for managing email interactions and is particularly useful for automated testing and integration scenarios.
