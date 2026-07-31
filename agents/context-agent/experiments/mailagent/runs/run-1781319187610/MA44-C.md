# MA44 (C)

## Answer

Structured extraction with Workers AI involves the following steps:

- **Input Types**: The function accepts an input of type `StructuredExtractInput`, which can include:
  - A preset (e.g., "2fa", "magic_link", etc.)
  - A custom schema for extraction.

- **Error Handling**: 
  - If neither a preset nor a custom schema is provided, it returns an error indicating that one is required.
  - If a preset is provided but is unknown, it returns an error for the unknown preset.
  - If a custom schema is provided but AI is not enabled, it returns an error indicating that AI is required.

- **Extraction Process**:
  - If a preset is specified, it uses predefined rules to extract data from the message.
  - If a custom schema is provided and AI is enabled, it uses AI to extract data based on the custom schema.
  - If both a preset and a custom schema are provided, it combines the results from both methods.

- **Output**: The function returns a `StructuredExtractResult`, which includes:
  - The message ID.
  - The preset used (or null if none).
  - The extractor type (rules, AI, or hybrid).
  - The extracted data as a record.

- **Presets**: The system supports various extraction presets, each with its own schema defining the expected fields (e.g., OTP codes, links, invoice details).

This process allows for flexible and powerful extraction of structured data from messages, leveraging both predefined rules and AI capabilities.
