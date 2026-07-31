# OL09 (A)

## Answer

Oiloop reads inbox headers from Apple Mail through the `MailService` class, specifically using the `prepareInboxSummary` method. Here’s how it works:

- **Mail Settings Check**: It first checks if mail automation is enabled in the settings.
- **Fetch Inbox Messages**: It fetches recent messages from Apple Mail using the `MailReader.fetchInbox(limit:)` method.
- **Filter Messages**: The fetched messages are filtered based on user-defined rules to exclude any that should be skipped.
- **Build Overview**: It then builds an overview of the messages using the `MailTriageBuilder.buildOverview` method, which likely formats the summary of the inbox messages.
- **Pending Plan**: The resulting plan, which includes the overview and messages, is stored in `pendingInboxPlan`.

This process allows Oiloop to summarize and present the inbox headers to the user.
