# OL09 (A)

## Answer

Oiloop reads inbox headers from Apple Mail through the `MailService` class, specifically using the `prepareInboxSummary` method. Here’s how it works:

- **Mail Settings Check**: It first checks if the mail feature is enabled in the settings.
- **Fetch Inbox Messages**: It fetches recent messages from the inbox using either the built-in `MailReader` or a custom mail reader, depending on the user's configuration.
- **Filter Messages**: The fetched messages are filtered based on user-defined rules to exclude any that should be skipped.
- **Build Overview**: It constructs an overview of the inbox messages, which includes details like the sender, subject, and snippets of the message body.
- **Return Plan**: Finally, it creates a `MailInboxPlan` that contains the overview and the filtered messages, which can then be used for further processing or display.

This process allows Oiloop to summarize and triage the inbox effectively.
