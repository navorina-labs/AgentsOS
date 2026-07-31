# NV39 (A)

## Answer

To check workspace services without live keys, you can use the following command:

- Run the command: `npm run setup:services-check` 

This command checks the environment and API for Stripe, Resend, and VAPID services. Additionally, you can perform a smoke test with:

- Run the command: `npm run smoke:workspace-services` 

These commands allow you to verify the setup without needing live keys.
