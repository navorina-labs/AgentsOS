# MA35 (C)

## Answer

The `mailagent_verify_signup` MCP tool is designed for verifying email signups through a temporary inbox. Here are its key features:

- **Description**: It facilitates the verification process for signups by waiting for a verification email and returning the primary action (such as an OTP or magic link).
- **Input Schema**:
  - `inboxId`: Existing inbox after form submission.
  - `service`: The service for which the signup is being verified.
  - `flow`: The type of flow (signup, login, or password reset).
  - `runId`: Agent run ID for tracing.
  - `label`: Optional label for the verification process.
  - `subjectContains`: Filter by subject substring.
  - `messageIndex`: Specifies which email to consider (0 for the newest).
  - `timeoutSeconds`: Maximum time to wait for the verification email.
  - `ttlMinutes`: Time-to-live for the inbox.
  - `deleteAfter`: Indicates whether to delete the inbox after verification.

This tool is part of the MailAgent's suite of tools for managing email interactions in automated testing and agent workflows.
