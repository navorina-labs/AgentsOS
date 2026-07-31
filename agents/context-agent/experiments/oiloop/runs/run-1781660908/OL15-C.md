# OL15 (C)

## Answer

EventKit Reminders authorization avoids freezing Oiloop in background mode by implementing the following strategy:

- **Headless Mode Detection**: The `RemindersReader` checks for the `--headless` command line argument.
- **Immediate Return**: If the application is running in headless mode and the authorization status is `notDetermined`, it returns `false` (or empty) immediately without prompting the user for permissions.
- **Prevention of Blocking**: This approach prevents the application from being blocked by macOS permissions popups, which can occur if the app attempts to request access without user interaction in a headless context. 

This mechanism ensures that Oiloop can operate smoothly without interruptions in background mode.
