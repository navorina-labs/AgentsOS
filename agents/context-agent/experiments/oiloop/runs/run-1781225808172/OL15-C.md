# OL15 (C)

## Answer

EventKit Reminders authorization in Oiloop avoids freezing in background mode by implementing a check for permissions before requesting access. Specifically:

- **Headless Mode Check**: If the application is running in headless mode (indicated by the `--headless` command line argument), it bypasses the request for permissions if the status is not determined.
- **Preemptive Status Check**: The application checks the current authorization status before attempting to request access. This prevents the application from blocking indefinitely on macOS permissions popups.

This approach ensures that the application can handle permission requests smoothly without causing freezes.
