# NV05 (B)

## Answer

To work with Stripe Plus checkout locally, follow these steps:

- **Setup**: Ensure you have the local billing emulator configured.
- **Run Development**: Execute `npm run dev` to start the development server.
- **Access Checkout**: Navigate to the Stripe Checkout via the setup page (`Navorina/stripe-setup.html`).
- **Use Emulator**: The billing emulator allows for instant upgrades in development without live keys.
- **Webhook Handling**: Ensure that the webhook for `user_subscriptions` is set up to handle subscription state changes.
- **Testing**: Use the CLI command `npm run subscription:upsert` to test subscription updates.
- **Debugging**: Check the `BILLING_EMULATOR` flag and the file `server/.data/user-subscriptions.json` for local subscription data.

Make sure to refer to the relevant documentation for any specific configurations or additional details.
