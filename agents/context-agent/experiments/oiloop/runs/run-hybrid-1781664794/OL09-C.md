# OL09 (C)

## Answer

Oiloop reads inbox headers from Apple Mail using the following process:

- The `MailService` class utilizes the `MailReader` to execute JXA/AppleScript scripting.
- The `MailReader` fetches recent inbox headers by running a JavaScript function that interacts with the Mail application.
- It retrieves messages from the inbox, limiting the number of messages fetched based on user settings.
- The fetched messages are then processed and returned as `MailMessageSummary` objects.

This process requires System Settings Automation permission for Mail and can be bypassed if "Use Apple Mail" is toggled off in the settings.
