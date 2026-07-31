# NV26 (C)

## Answer

Dev emulators work without Stripe Resend VAPID by using local emulation features that simulate the behavior of the actual services. Here are the key points:

- **Resend Email Emulator**: 
  - Allows sending emails without using the Resend API.
  - Emails are written to a JSONL outbox file for local testing.
  - Controlled via environment variables (e.g., `RESEND_EMULATOR`).

- **Billing Emulator**:
  - Simulates billing processes without connecting to Stripe.
  - Uses environment variables to enable the emulator (e.g., `BILLING_EMULATOR`).
  - Handles user subscriptions locally, writing to a file or Supabase.

- **Push Notifications**:
  - Local push notifications can be tested using a push emulator.
  - The emulator logs notifications instead of sending them through real services.

- **Environment Configuration**:
  - Emulators are activated based on specific environment settings, ensuring they only run in development mode.

This setup allows developers to test functionalities without needing live keys or external service dependencies.
