# NV28 (A)

## Answer

The paywall upgrade CTA in Settings works as follows:

- **Settings Page**: Users can navigate to the Settings page where the upgrade option is presented.
- **Instant Upgrade**: The upgrade process allows users to instantly upgrade their plan.
- **Tier Information**: The current tier information is stored in `server/.data/user-subscriptions.json`.
- **Billing Emulator**: In local development, the billing emulator can be activated with `BILLING_EMULATOR=1` in `server/development.defaults.env`.
- **Testing**: The upgrade functionality can be tested using the command `npm run test:billing-emulator` and end-to-end tests with `e2e/settings-billing-emulator.spec.ts`.

This process ensures that users can easily upgrade their subscription tier directly from the Settings interface.
