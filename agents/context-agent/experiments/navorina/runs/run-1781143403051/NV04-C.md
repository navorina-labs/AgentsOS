# NV04 (C)

## Answer

To troubleshoot a failed Stripe webhook that resulted in a subscription not being updated, check the following:

- **Webhook Configuration**: Ensure that the Stripe webhook is correctly configured in the Stripe dashboard with the correct endpoint URL.

- **Webhook Secret**: Verify that the `STRIPE_WEBHOOK_SECRET` is correctly set in your environment variables.

- **Webhook Logs**: Check the logs in the Stripe dashboard for any errors or issues related to the webhook delivery.

- **Error Handling**: Review the error handling in the `handleStripeWebhook` function to ensure it properly logs errors and handles failures.

- **Database Configuration**: Confirm that the Supabase configuration is correct and that the `user_subscriptions` table is accessible.

- **User Identification**: Ensure that the `external_user_id` used in the webhook matches an existing user in your system.

- **Subscription Logic**: Review the logic in the `upsertUserSubscriptionByExternalId` function to ensure it correctly processes the incoming data from the webhook.

- **Emulator State**: If using the billing emulator, check if it is enabled and functioning correctly.

- **Network Issues**: Ensure there are no network issues preventing the webhook from reaching your server.

- **Local Development**: If running locally, ensure that your local server is publicly accessible (e.g., using tools like ngrok) for Stripe to send webhooks.

By checking these areas, you can identify the cause of the webhook failure and take appropriate action to resolve it.
