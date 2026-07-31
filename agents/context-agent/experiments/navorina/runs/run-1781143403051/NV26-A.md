# NV26 (A)

## Answer

Dev emulators for Navorina work without Stripe, Resend, and VAPID by using specific environment variables set in the development configuration. Here are the key points:

- **Default Configuration**: In `server/development.defaults.env`, the following emulators are enabled by default:
  - `BILLING_EMULATOR=1`
  - `RESEND_EMULATOR=1`
  - `PUSH_EMULATOR=1`

- **Running Emulators**: Developers can run the emulators using the following commands:
  - For billing: `npm run test:billing-emulator`
  - For Resend: `npm run test:resend-emulator`
  - For Push notifications: `npm run test:push-emulator`

- **Local Development**: Developers can quickly verify functionality without needing live keys or external services, allowing for testing and development in a controlled environment.

- **Documentation**: Detailed guidance on setting up and using local dev emulators can be found in `docs/setup/LOCAL_DEV_EMULATORS.md`. 

This setup allows for a seamless development experience while ensuring that the core functionalities can be tested without relying on external services.
