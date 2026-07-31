# MA44 (B)

## Answer

Structured extract with Workers AI operates as follows:

- **Requirements**: 
  - Requires `env.AI` binding to enable AI functionality.
  - The model used for extraction can be specified via `env.EXTRACT_MODEL`, defaulting to `@cf/meta/llama-3.1-8b-instruct`.

- **Extraction Process**:
  - The extraction can utilize a preset or a custom schema.
  - If both a preset and a custom schema are provided along with AI, the extractor mode is set to **hybrid**, merging results from both sources.

- **Error Handling**:
  - Various errors can occur during the extraction process:
    - `preset_or_schema_required`: 400 error if neither preset nor schema is provided.
    - `unknown_preset`: 400 error if an invalid preset is specified.
    - `ai_required_for_custom_schema`: 501 error if AI is required but not available for a custom schema.
    - `ai_extract_failed`: 502 error if the AI extraction fails.

- **API Endpoints**:
  - The structured extraction can be accessed via:
    - `GET /v1/inboxes/:id/extract/presets` to retrieve available presets.
    - `POST /v1/inboxes/:id/messages/:messageId/extract` to perform the extraction using a specified preset or custom schema.

This process allows for enhanced extraction capabilities by leveraging AI to interpret and extract data from emails based on defined schemas or rules.
