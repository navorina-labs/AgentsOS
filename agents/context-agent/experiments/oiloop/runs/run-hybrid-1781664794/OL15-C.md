# OL15 (C)

## Answer

EventKit Reminders authorization avoids freezing Oiloop in background mode by implementing the following strategy:

- **Headless Mode Check**: The `RemindersReader` checks for the `--headless` command line argument.
- **Immediate Return**: If the application is running in headless mode and the authorization status is `notDetermined`, it returns `false` (or empty) immediately without prompting the user for permissions.
- **Prevention of Blocking**: This approach prevents the application from being blocked by macOS permissions popups, which can occur when background agents request access without user interaction.
