# MA44 (C)

## Answer

Structured extraction with Workers AI in the MailAgent project works as follows:

- **Purpose**: It extracts structured data from messages based on predefined presets or custom schemas.
  
- **Input Types**:
  - **Preset**: A predefined extraction rule (e.g., "2fa", "magic_link", "invite", "invoice", "receipt").
  - **Custom Schema**: A user-defined schema for extraction.

- **Functionality**:
  - The function `extractStructuredFromMessage` takes the environment, a message row, and an input object containing either a preset or a custom schema.
  - If neither a preset nor a custom schema is provided, it returns an error.
  - If a preset is provided, it extracts data using predefined rules.
  - If a custom schema is provided, it requires the AI service to be enabled and uses AI to extract data.
  - The function can combine results from both rules and AI if both a preset and a custom schema are provided.

- **Output**:
  - Returns a structured result containing:
    - `messageId`: ID of the message.
    - `preset`: The preset used (or null if custom schema was used).
    - `extractor`: Indicates whether the data was extracted using "rules", "ai", or "hybrid".
    - `data`: The extracted data in a structured format.

- **Error Handling**: The function includes error handling for various scenarios, such as missing presets or AI extraction failures.

This process allows for flexible and powerful data extraction from messages, leveraging both predefined rules and AI capabilities.
