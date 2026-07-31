# OL11 (A)

## Answer

The Telegram and Slack connector drafts are structured as follows:

### Telegram Draft
- **Type**: "telegram"
- **Chat ID**: The ID of the chat to which the draft is directed.
- **Display Name**: The name of the user or chat.
- **Body**: The content of the message to be sent.
- **DB ID**: An optional identifier for the draft in the database.

### Slack Draft
- **Type**: "slack"
- **Chat ID**: The ID of the chat or channel to which the draft is directed.
- **Display Name**: The name of the channel or user.
- **Body**: The content of the message to be sent.
- **DB ID**: An optional identifier for the draft in the database.

Both drafts include an identifier (`id`), which is a UUID, and a `dbID` that links to the database record if applicable.
