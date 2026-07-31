# OL11 (C)

## Answer

The Telegram and Slack connector drafts are structured using the `ConnectorDraftPlan` model. Here are the key components:

- **Properties**:
  - `id`: A unique identifier for the draft (UUID).
  - `type`: A string indicating the type of connector ("slack" or "telegram").
  - `chatID`: The identifier for the chat where the message will be sent.
  - `displayName`: The name of the user or chat being addressed.
  - `body`: The content of the message to be sent.
  - `dbID`: An optional database identifier for the draft (Int64).

- **Computed Property**:
  - `previewLine`: A string that provides a preview of the draft, indicating the platform and recipient (e.g., "Reply in Slack to [displayName]"). 

This structure allows for the management and representation of drafts for both Slack and Telegram within the Oiloop project.
