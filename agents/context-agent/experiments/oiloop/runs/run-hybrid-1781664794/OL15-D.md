# OL15 (D)

## Answer

EventKit Reminders authorization avoids freezing Oiloop in background mode by implementing the following mechanism:

- **Headless Mode Detection**: The `RemindersReader` checks for the `--headless` command line argument.
- **Immediate Return**: If the permission status is `notDetermined` and the application is running in headless mode, it returns `false` (or empty) immediately.
- **Avoiding Prompts**: This approach prevents the application from prompting the user for permissions, which can block the process and lead to freezes when running as a background agent.
