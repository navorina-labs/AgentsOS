# MA37 (B)

## Answer

### Stripe Billing and Checkout in MailAgent

- **Checkout Process**:
  - Endpoint: `POST /v1/billing/checkout`
  - Requirements:
    - Must have `stripeConfigured` (both `STRIPE_SECRET_KEY` and `STRIPE_PRICE_PRO` set).
    - Must have a `teamId`.
    - Only teams with the `free` plan can upgrade via Stripe (`canUpgradeViaStripe(plan)` returns true).
  - Creates a Stripe Checkout Session in subscription mode.
  - `client_reference_id` and `metadata[team_id]` are set to the `teamId`.
  - Returns a URL and session ID for redirecting the user to Stripe.

- **Billing Portal**:
  - Endpoint: `POST /v1/billing/portal`
  - Requires the `stripe_customer_id` to be present on the team.
  - Creates a Billing Portal Session and returns a URL for the portal.

- **Webhook Events**:
  - Endpoint: `POST /webhooks/stripe`
  - Handles various Stripe events:
    - `checkout.session.completed`: Updates the team plan to `pro` and stores customer and subscription IDs.
    - `customer.subscription.updated`: Downgrades the team plan to `free` if the subscription status is canceled, unpaid, or incomplete.
    - `customer.subscription.deleted`: Same downgrade action as above.
  - Requires a valid `stripe-signature` header for verification.

- **Manual Plan Override**:
  - Can manually change a team's plan using the command:
    ```bash
    npm run team:plan -- TEAM_ID pro
    ```
  - This can be done for `pro` or `enterprise` plans without using Stripe.

### Additional Notes
- The billing system is integrated with the team management system, meaning that plan changes affect all API keys associated with the team.
- The self-serve upgrade is only available from the `free` to `pro` plan. Upgrading to `enterprise` requires manual intervention.
