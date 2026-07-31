# MA01 (A)

## Answer

OTP extraction in MailAgent works as follows:

- **Inbox Creation**: A temporary inbox is created using the `POST /v1/inboxes` endpoint or via the MCP tool `mailagent_create_inbox`.
- **Service Specification**: The service (e.g., Auth0, GitHub) is specified, which sets up an allowlist for expected senders.
- **Waiting for Messages**: The agent waits for incoming messages using the `GET /v1/inboxes/:id/wait` endpoint or the MCP tool `mailagent_wait_for_message`.
- **Message Extraction**: Once a message is received, the OTP and any links are extracted using the `GET /v1/inboxes/:id/extract` endpoint or the MCP tool `mailagent_extract_verification`.
- **Primary Action**: The extracted OTP or primary link is returned as part of the response, allowing the agent to proceed with the verification process.

### Key Points:
- **No Real SMTP**: The extraction process does not involve real SMTP; it uses simulated messages for testing.
- **Structured Extraction**: The extraction can also be done using structured extraction tools for specific formats (e.g., OTP, magic links).
- **Debugging**: If extraction fails, the `mailagent_diagnose_inbox` tool can be used to troubleshoot issues related to message reception and extraction.
