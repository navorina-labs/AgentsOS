# MA37 (A)

## Answer

Stripe billing and checkout in MailAgent work as follows:

### Overview
- **Optional Billing**: Stripe is not required; teams can operate on a free plan without setting `STRIPE_*` secrets.
- **Plans**: 
  - **Free**: Default for teams created with `npm run issue:key:db`.
  - **Pro**: Available through Stripe Checkout.
  - **Enterprise**: Managed by the operator, not self-serve.

### Setup Steps
1. **Stripe Account**: Create a Stripe account and set up products and prices in the Stripe Dashboard.
2. **Webhook Configuration**:
   - Set up a webhook in Stripe to listen for events like `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`.
   - The webhook URL is `https://api.webmailagent.com/webhooks/stripe`.
   - Copy the signing secret for the webhook.

3. **Secrets Management**:
   - Store the following secrets in Cloudflare Worker:
     - `STRIPE_SECRET_KEY`: Your Stripe secret key.
     - `STRIPE_WEBHOOK_SECRET`: The signing secret from the webhook.
     - `STRIPE_PRICE_PRO`: The price ID for the Pro subscription.

### API Endpoints
- **Checkout Session**: 
  - `POST /v1/billing/checkout`: Initiates a checkout session for upgrading to Pro.
  - Returns a URL for the Stripe Checkout page.

- **Customer Portal**:
  - `POST /v1/billing/portal`: Creates a session for the Stripe Customer Portal, allowing users to manage their subscriptions.

### Billing Flow
1. **Upgrade to Pro**:
   - A team admin can initiate a checkout session via the API.
   - After successful payment, the webhook updates the team's plan to Pro.

2. **Audit and Management**:
   - Billing actions are logged for auditing purposes.
   - Teams can check their billing status and limits via the API.

### Verification
- After setting up, verify the configuration by running:
  ```bash
  npm run doctor:billing
  npm run test:contract:qa:billing
  ```

### Notes
- The billing system is currently in a draft state and not fully operational until the Pro/Enterprise plans are launched.
- The setup process is documented in `STRIPE-SETUP.md` and `BILLING.md`.
