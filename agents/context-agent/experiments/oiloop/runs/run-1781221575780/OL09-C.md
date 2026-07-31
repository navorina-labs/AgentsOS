# OL09 (C)

## Answer

Oiloop reads inbox headers from Apple Mail using the following process:

- Utilizes the `MailReader` class, which executes JavaScript for Automation (JXA) to interact with the Mail application.
- The `fetchInbox(limit: Int)` function retrieves messages from the inbox, limited to a specified number (between 1 and 30).
- It constructs a JavaScript function that accesses the Mail application, fetches messages, and formats them into a JSON structure.
- The JSON data is then decoded into an array of `MailMessageSummary` objects, which include details such as message ID, subject, sender, and a snippet of the message content. 

This process ensures that Oiloop can effectively triage and manage emails within the Apple Mail application.
