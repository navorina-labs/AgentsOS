# OL11 (B)

## Answer

The drafts for Telegram and Slack connectors are managed by the `RoutineConnectorService`. Here’s how they are structured:

### Telegram Connector Drafts
- **Draft Management**: Drafts are prepared and managed within the `RoutineConnectorService`.
- **Draft Preview**: Draft previews are presented inside the `ConnectorPreviewSheet`.
- **Sending**: Requires a manual "Send Message" trigger click to send the draft.

### Slack Connector Drafts
- **Draft Management**: Similar to Telegram, drafts are prepared and managed within the `RoutineConnectorService`.
- **Draft Preview**: Draft previews are also presented inside the `ConnectorPreviewSheet`.
- **Sending**: Requires a manual "Send Message" trigger click to send the draft.

### Common Features
- Both connectors require user interaction for sending messages, ensuring that no messages are sent silently in the background.
