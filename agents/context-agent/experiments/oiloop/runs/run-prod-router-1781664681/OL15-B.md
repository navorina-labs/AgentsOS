# OL15 (B)

## Answer

EventKit Reminders authorization avoids freezing Oiloop in background mode by implementing the following:

- **Headless Mode Check**: The `RemindersReader` checks for the `--headless` command line argument.
- **Immediate Return**: If the authorization status is `notDetermined` and the application is running in headless mode, it returns `false` (or empty) immediately.
- **No Prompting**: This approach prevents prompting the user for permissions, which can block the application and cause freezes when running as a background agent.
