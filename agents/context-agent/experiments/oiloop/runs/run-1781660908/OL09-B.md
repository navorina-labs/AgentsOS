# OL09 (B)

## Answer

Oiloop reads inbox headers from Apple Mail using the following process:

- **MailService**: Coordinates the automation.
- **MailReader**: Executes JXA/AppleScript scripting to read recent inbox headers.
- **System Settings Automation Permission**: Requires permission for Mail to function.
- **Toggle Option**: The feature is bypassed if "Use Apple Mail" is toggled off in Settings.
