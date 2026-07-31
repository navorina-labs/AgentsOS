# NV04 (B)

## Answer

To troubleshoot a failed Stripe webhook and ensure the subscription is updated, check the following:

- **Webhook Configuration**:
  - Verify the `STRIPE_WEBHOOK_SECRET` is correctly set for webhook verification.

- **Webhook Handler**:
  - Check the implementation of `upsertUserSubscriptionByExternalId` in `server/db/upsert-user-subscription.js` to ensure it correctly processes incoming webhook events.

- **Supabase Table**:
  - Ensure the `user_subscriptions` table in Supabase is correctly configured and accessible.

- **Error Logs**:
  - Review logs for any errors during the webhook processing to identify specific issues.

- **Tier Desynchronization**:
  - Confirm that the tier information in Stripe matches the data in Supabase to avoid desynchronization.

- **Testing**:
  - Use the billing emulator (`npm run smoke:billing-emulator`) to simulate webhook events and verify the handling logic.

- **Network Issues**:
  - Ensure there are no network issues preventing Stripe from reaching your webhook endpoint.

If any of these checks do not resolve the issue, further investigation into the specific error messages or logs may be necessary.
