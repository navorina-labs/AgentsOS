# OL15 (A)

## Answer

The EventKit Reminders authorization avoids freezing Oiloop in background mode by using asynchronous requests for authorization. Specifically, it employs the following approach:

- **Asynchronous Handling**: The request for authorization is made using `await` with `withCheckedContinuation`, allowing the app to continue running without blocking the main thread.
- **Conditional Execution**: The authorization request is only made if the current authorization status is not determined, ensuring that the app does not repeatedly request access unnecessarily.
- **Graceful Handling of Denied Access**: If access is denied, the app can handle this gracefully by informing the user without causing the app to freeze or crash.

This design allows Oiloop to maintain responsiveness while managing background tasks related to reminders.
