# OL11 (C)

## Answer

The Telegram and Slack connector drafts are structured using the `ConnectorDraftPlan` model. Here are the key components:

- **Properties**:
  - `id`: A unique identifier (UUID).
  - `type`: A string indicating the type of connector ("slack" or "telegram").
  - `chatID`: The ID of the chat to which the draft is related.
  - `displayName`: The name of the chat or user for display purposes.
  - `body`: The content of the draft message.
  - `dbID`: An optional database identifier (Int64).

- **Computed Property**:
  - `previewLine`: A string that provides a summary of the draft, formatted as "Reply in [type] to [displayName]".

This structure allows for easy management and display of draft messages for both Slack and Telegram within the Oiloop application.
