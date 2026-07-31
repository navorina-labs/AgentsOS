# OL15 (A)

## Answer

The EventKit Reminders authorization avoids freezing Oiloop in background mode by using asynchronous requests for authorization. Specifically, it checks the authorization status and requests access in a way that does not block the main thread. This is achieved through the use of `withCheckedContinuation` to handle the asynchronous nature of the request, allowing the app to remain responsive while waiting for user permission. 

Key points:
- Uses `EKEventStore` to manage reminders.
- Checks authorization status before requesting access.
- Utilizes asynchronous patterns to avoid blocking the main thread.
- Ensures that the app can continue functioning while waiting for user input.
