# OL09 (C)

## Answer

Oiloop reads inbox headers from Apple Mail using the `MailReader` class, which employs JavaScript for Automation (JXA) to interact with the Mail application. The process involves the following steps:

- The `fetchInbox(limit: Int)` function is called to retrieve messages.
- A JavaScript function is executed to access the Mail application's inbox and fetch a specified number of messages (limited to a maximum of 30).
- The fetched messages are decoded from JSON format into `MailMessageSummary` objects, which include details such as message ID, subject, sender, and a snippet of the message content.
- The function handles errors, such as an empty inbox or script failures, and returns the list of messages.

This approach allows Oiloop to effectively triage and classify emails from the user's Apple Mail inbox.
