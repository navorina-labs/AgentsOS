# OL11 (B)

## Answer

The drafts for Telegram and Slack connectors are managed by the `RoutineConnectorService`. Here’s how they are structured:

### Telegram Connector Drafts
- **Draft Previews**: Managed within the `ConnectorPreviewSheet`.
- **Sending**: Requires a manual "Send Message" trigger click to send the draft.

### Slack Connector Drafts
- **Draft Previews**: Also managed within the `ConnectorPreviewSheet`.
- **Sending**: Similar to Telegram, it requires a manual "Send Message" trigger click to send the draft.

### Common Features
- Both connectors utilize bot tokens or chat IDs stored in user settings.
- Drafts are presented for user confirmation before sending. 

No specific structural details about the content of the drafts are provided in the context.
