# OL15 (C)

## Answer

EventKit Reminders authorization avoids freezing Oiloop in background mode by implementing a check for permissions before requesting access. Specifically:

- **Headless Mode Check**: If Oiloop is running in headless mode (background), it checks the status of permissions first.
- **Preventing Indefinite Blocking**: This approach prevents the application from being blocked indefinitely by macOS permissions popups, which can occur if the app tries to request access without checking the current status.

This strategy is documented in the decision history of the System Control Core, specifically under the decision made on June 10, 2026, regarding the TCC Headless Bypass.
