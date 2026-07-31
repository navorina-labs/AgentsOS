# OL09 (C)

## Answer

Oiloop reads inbox headers from Apple Mail using the following process:

- **MailReader**: Utilizes the `MailReader` class to fetch inbox messages.
- **JavaScript for Automation (JXA)**: Executes a JavaScript function that interacts with the Mail application to retrieve messages.
- **Fetch Inbox Method**: The `fetchInbox(limit: Int)` method in `MailReader`:
  - Defines a script to access the Mail application and fetch a specified number of messages (limited to a maximum of 30).
  - Collects message details such as ID, subject, sender, and a snippet of the message body.
  - Returns the fetched messages as an array of `MailMessageSummary` objects.
- **Error Handling**: Throws errors if the inbox is empty or if the script fails to execute properly.

This process allows Oiloop to classify and triage emails effectively.
