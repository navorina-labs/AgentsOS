# MA37 (C)

## Answer

Stripe billing and checkout in MailAgent works as follows:

### Billing Setup
- **Stripe Configuration**: 
  - Stripe must be configured with a secret key and a price ID for the Pro subscription.
  - The function `stripeConfigured(env)` checks if the necessary Stripe keys are set.

### Plans
- **Available Plans**:
  - Free: 60 requests/min, 10 active inboxes.
  - Pro: 300 requests/min, 100 active inboxes.
  - Legacy: 120 requests/min, 500 active inboxes (only for specific API keys).

### Checkout Process
- **Checkout Route**: 
  - The route `/v1/billing/checkout` is used for upgrading from free to pro.
  - Requires an API key and checks if the user has admin privileges.
  - Validates if Stripe is configured and if the team ID is present.
  - Checks if the current plan allows for an upgrade via Stripe.

- **Session Creation**:
  - A checkout session is created using `createCheckoutSession(env, input)`, which sends a request to Stripe with the team ID, success URL, and cancel URL.
  - Returns a session URL for the user to complete the payment.

### Billing Portal
- **Portal Route**: 
  - The route `/v1/billing/portal` allows users to access the Stripe billing portal.
  - Similar checks are performed as in the checkout process to ensure Stripe is configured and the team ID is valid.
  - Creates a billing portal session using `createBillingPortalSession(env, input)`.

### Webhook Handling
- **Webhook for Stripe Events**:
  - The function `handleStripeWebhook(env, payload, signatureHeader)` processes incoming Stripe webhook events.
  - Handles events like `checkout.session.completed` to update the team's subscription status.
  - Updates the plan based on subscription status changes (e.g., upgrades or cancellations).

### Audit Logging
- Actions related to billing (e.g., checkout sessions) are logged using the `auditRoute` function to maintain a record of billing activities.

This setup allows MailAgent to manage subscriptions and billing effectively through Stripe, providing users with a seamless upgrade path and management of their billing information.
