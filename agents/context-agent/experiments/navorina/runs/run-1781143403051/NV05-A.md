# NV05 (A)

## Answer

To work with Stripe Plus checkout locally, follow these steps:

- **Emulator Setup**: 
  - Set `BILLING_EMULATOR=1` in `server/development.defaults.env` (this is the default in dev).
  
- **Testing**:
  - Run smoke tests using `npm run smoke:billing-emulator`.
  - Execute unit tests with `npm run test:billing-emulator`.
  - For end-to-end tests, use `e2e/settings-billing-emulator.spec.ts`.

- **Pre-release Checks**:
  - Before going live, ensure to run `npm run setup:stripe-live-check` after obtaining live keys.

- **Settings**:
  - In the application, navigate to Settings → Plan for instant upgrades and manage tiers in `server/.data/user-subscriptions.json`.

This setup allows you to simulate Stripe's billing functionalities without needing live keys during development.
