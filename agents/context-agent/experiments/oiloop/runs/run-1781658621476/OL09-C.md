# OL09 (C)

## Answer

Oiloop reads inbox headers from Apple Mail using the following process:

- The `MailService` class utilizes the `MailReader` to execute JXA/AppleScript scripting.
- It fetches recent inbox headers by calling the `fetchInbox(limit:)` method in `MailReader`.
- This method runs a JavaScript function that interacts with the Mail application to retrieve message details (id, subject, sender, snippet).
- The fetched data is then decoded into `MailMessageSummary` objects for further processing.

**Requirements:**
- The user must grant System Settings Automation permission for Mail.
- The process can be bypassed if "Use Apple Mail" is toggled off in Settings.
