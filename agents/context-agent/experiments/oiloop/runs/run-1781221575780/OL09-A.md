# OL09 (A)

## Answer

Oiloop reads inbox headers from Apple Mail through the `MailService` class, specifically using the `prepareInboxSummary` method. Here’s how it works:

- **Mail Settings Check**: It first checks if mail automation is enabled in the settings.
- **Fetch Inbox Messages**: It fetches recent inbox messages using either the built-in `MailReader` or a custom mail reader, depending on the user's configuration.
- **Filter Messages**: The fetched messages are filtered based on user-defined rules to exclude any that should be skipped.
- **Build Overview**: It constructs an overview of the messages and prepares a `MailInboxPlan` that includes the messages and a summary.
- **Pending Plan**: The resulting plan is stored in `pendingInboxPlan`, which can then be used to display the summary and details to the user.

This process allows Oiloop to summarize and triage the inbox effectively.
