# MA44 (B)

## Answer

Structured extract with Workers AI operates as follows:

- **Requirements**: 
  - Requires `env.AI` binding to enable AI functionality.
  - A model is specified, defaulting to `@cf/meta/llama-3.1-8b-instruct`.

- **Extraction Process**:
  - The API can accept a custom schema for extraction.
  - The prompt instructs the AI to extract JSON keys from the provided custom schema.
  - The email content is limited to a maximum of 10,000 characters, and the AI response is capped at 800 tokens.

- **Error Handling**:
  - Various errors can occur during the extraction process:
    - `preset_or_schema_required`: 400 error if neither a preset nor a schema is provided.
    - `unknown_preset`: 400 error if an invalid preset is specified.
    - `ai_required_for_custom_schema`: 501 error if AI is not enabled for a custom schema extraction.
    - `ai_extract_failed`: 502 error if the AI extraction fails.

- **Extractor Modes**:
  - The extraction can operate in three modes:
    - **Rules**: When only a preset is used without AI or custom schema.
    - **AI**: When only a custom schema is provided with AI.
    - **Hybrid**: When both a preset and a custom schema are provided, merging results from both.

- **API Endpoints**:
  - The structured extraction can be accessed via:
    - `GET /v1/inboxes/:id/extract/presets` for available presets.
    - `POST /v1/inboxes/:id/messages/:messageId/extract` for performing the extraction with specified preset or schema.
