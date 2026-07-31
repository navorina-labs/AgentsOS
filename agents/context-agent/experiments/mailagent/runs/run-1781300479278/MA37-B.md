# MA37 (B)

## Answer

### Stripe Billing and Checkout in MailAgent

- **Checkout Process**:
  - Endpoint: `POST /v1/billing/checkout`
  - Requirements:
    - Must have `stripeConfigured` (both `STRIPE_SECRET_KEY` and `STRIPE_PRICE_PRO` set).
    - Requires `teamId`.
    - Only allows upgrades from `free` to `pro` (checked via `canUpgradeViaStripe(plan)`).
    - Scoped keys require `scope_admin_required`.
    - Legacy keys require `billing_requires_registered_key`.
  - Creates a Stripe Checkout Session in subscription mode.
  - `client_reference_id` and `metadata[team_id]` are set to the `teamId`.
  - Returns a URL and session ID for redirecting the user to Stripe.

- **Billing Portal**:
  - Endpoint: `POST /v1/billing/portal`
  - Requires `stripe_customer_id` on the team.
  - Creates a Billing Portal Session and returns a URL for the portal.

- **Webhook Events**:
  - Endpoint: `POST /webhooks/stripe`
  - Handles various events:
    - `checkout.session.completed`: Updates the team plan to `pro`.
    - `customer.subscription.updated`: Downgrades to `free` if the subscription is canceled or unpaid.
    - `customer.subscription.deleted`: Same downgrade action as above.
  - Requires signature verification using the `stripe-signature` header and `STRIPE_WEBHOOK_SECRET`.

- **Manual Plan Override**:
  - Can manually set team plans using CLI commands:
    - `npm run team:plan -- TEAM_ID pro`
    - `npm run team:plan -- TEAM_ID enterprise`
    - `npm run team:plan -- TEAM_ID free`

### Additional Notes
- The billing system is integrated with the team management system, meaning that plan changes affect all keys associated with a team.
- The self-serve upgrade is only available from the free plan to the pro plan.
