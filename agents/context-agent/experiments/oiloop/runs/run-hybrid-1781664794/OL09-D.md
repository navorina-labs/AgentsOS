# OL09 (D)

## Answer

Oiloop reads inbox headers from Apple Mail using the following process:

- **MailService**: Utilizes the `MailReader` to execute JXA/AppleScript scripting.
- **MailReader**: 
  - Fetches recent inbox messages by running a JavaScript function that interacts with the Mail application.
  - The function retrieves messages from the inbox, limits the number of messages fetched, and extracts details such as ID, subject, sender, and a snippet of the message body.
- **Permissions**: Requires System Settings Automation permission for Mail, and this functionality is bypassed if "Use Apple Mail" is toggled off in Settings.
