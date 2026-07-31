# OL11 (A)

## Answer

The Telegram and Slack connector drafts are structured as follows:

### Telegram Connector Draft
- **Type**: "telegram"
- **Chat ID**: The ID of the chat to which the draft is related.
- **Display Name**: The name of the user or chat.
- **Body**: The content of the message to be sent.
- **DB ID**: An optional identifier for the draft in the database.

### Slack Connector Draft
- **Type**: "slack"
- **Chat ID**: The ID of the chat or channel to which the draft is related.
- **Display Name**: The name of the channel or user.
- **Body**: The content of the message to be sent.
- **DB ID**: An optional identifier for the draft in the database.

Both drafts include an `id` (UUID) and can have a `dbID` for database tracking.
