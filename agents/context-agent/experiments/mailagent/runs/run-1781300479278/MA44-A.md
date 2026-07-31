# MA44 (A)

## Answer

The structured extract with Workers AI in the MailAgent project works as follows:

- **Endpoint**: The structured extraction is performed via the `POST /v1/inboxes/:id/messages/:messageId/extract` API.
- **Input**: The request requires:
  - `inboxId`: The ID of the inbox from which the message is extracted.
  - `messageId`: The ID of the message to be extracted.
  - `preset`: Optional, specifies the extraction preset (e.g., `2fa`, `magic_link`, `invite`, `invoice`, `receipt`).
  - `schema`: Optional, allows for a custom JSON schema to be defined for extraction.
  
- **Functionality**:
  - The extraction process uses predefined presets or a custom schema to parse the content of the message and extract relevant structured data.
  - The extracted data can include elements like OTPs, links, and other structured information based on the specified preset or schema.

- **Response**: The response includes the structured data extracted from the message, which can be used for further processing or verification.

This feature allows for efficient parsing and extraction of relevant information from emails, enhancing the automation capabilities of the MailAgent project.
