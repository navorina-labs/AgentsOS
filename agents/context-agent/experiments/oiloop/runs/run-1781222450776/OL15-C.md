# OL15 (C)

## Answer

EventKit Reminders authorization in Oiloop avoids freezing in background mode by implementing a check for permissions before requesting access. Specifically:

- **Headless Mode Check**: If the application is running in headless mode (indicated by the `--headless` command line argument), it does not attempt to request access to Reminders if the permission status is not determined.
- **Status Check**: The application first checks the current authorization status for reminders. If the status is `.notDetermined`, it only requests access if not running headless.
- **Continuation Handling**: The request for access is handled using `withCheckedContinuation`, which allows the app to wait for the user's response without blocking the main thread, thus preventing freezes.

This approach ensures that the app can gracefully handle permission requests without causing the application to hang or freeze.
