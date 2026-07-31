# MA44 (A)

## Answer

The structured extract with Workers AI in the MailAgent project works as follows:

- **Endpoint**: The structured extraction is performed via the `POST /v1/inboxes/:id/messages/:messageId/extract` API endpoint.
- **Input**: The request requires:
  - `inboxId`: The ID of the inbox from which the message is extracted.
  - `messageId`: The ID of the message to be extracted.
  - `preset`: Optional, specifies the extraction preset (e.g., `2fa`, `magic_link`, `invite`, `invoice`, `receipt`).
  - `schema`: Optional, allows for a custom JSON schema to be defined for extraction.
  
- **Functionality**:
  - The extraction process uses predefined presets or custom schemas to parse the content of the email message.
  - It extracts structured data such as OTPs, links, and other relevant information based on the specified preset or schema.

- **Response**: The response includes the extracted structured data in JSON format, which can be used for further processing or validation.

This feature allows for efficient parsing of email content without manual HTML parsing, making it suitable for automated workflows and testing scenarios.
