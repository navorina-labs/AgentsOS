# MA37 (A)

## Answer

Stripe billing and checkout in MailAgent works as follows:

### Overview
- **Optional Billing**: Stripe is not required; teams can operate on a free plan without Stripe secrets.
- **Plans**: 
  - **Free**: Default for teams created with `npm run issue:key:db`.
  - **Pro**: Available through Stripe Checkout.
  - **Enterprise**: Managed by the operator, not self-serve.

### Setup Steps
1. **Stripe Account**: Create a Stripe account and set up products and prices in the Stripe Dashboard.
2. **Product Creation**: 
   - Add a product named "MailAgent Pro".
   - Set pricing as recurring (monthly or yearly) and copy the Price ID.
3. **Webhook Configuration**: 
   - Set up a webhook in Stripe to listen for events like `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`.
   - The webhook URL should point to `https://api.webmailagent.com/webhooks/stripe`.
4. **Secrets**: Store the following secrets in Cloudflare Worker:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key.
   - `STRIPE_WEBHOOK_SECRET`: The signing secret for the webhook.
   - `STRIPE_PRICE_PRO`: The Price ID for the Pro plan.

### API Endpoints
- **Checkout Session**: 
  - `POST /v1/billing/checkout`: Initiates a Stripe Checkout session for upgrading to Pro.
  - Returns a URL for the checkout session.
- **Billing Portal**: 
  - `POST /v1/billing/portal`: Creates a session for the Stripe Customer Portal, allowing users to manage their subscriptions.

### Billing Logic
- Teams can upgrade to Pro via Stripe Checkout, which updates their plan in the database upon successful payment.
- The API checks if the team is registered and if they can upgrade based on their current plan.

### Verification
- After setting up, verify the configuration by running:
  ```bash
  npm run doctor:billing
  npm run test:contract:qa:billing
  ```

### Notes
- Without Stripe secrets, the API will return `stripe_not_configured`, and billing features will be disabled.
- The operator can manually assign plans to teams without Stripe.

For detailed steps, refer to the [STRIPE-SETUP.md](./STRIPE-SETUP.md) document.
