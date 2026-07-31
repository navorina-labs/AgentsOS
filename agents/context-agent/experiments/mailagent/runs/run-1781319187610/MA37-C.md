# MA37 (C)

## Answer

Stripe billing and checkout in MailAgent works as follows:

### Overview
- MailAgent supports a billing system using Stripe for upgrading from a free plan to a pro plan.
- The billing routes are defined in `src/routes/billing.ts`.

### Key Functions
1. **Stripe Configuration Check**:
   - The system checks if Stripe is configured using the `stripeConfigured` function, which verifies the presence of `STRIPE_SECRET_KEY` and `STRIPE_PRICE_PRO` in the environment.

2. **Checkout Session Creation**:
   - The `createCheckoutSession` function is used to create a Stripe checkout session.
   - It requires:
     - `teamId`: The ID of the team making the request.
     - `successUrl`: URL to redirect to upon successful payment.
     - `cancelUrl`: URL to redirect to if the payment is canceled.
   - It sends a request to Stripe's API to create a session and returns the session URL and ID.

3. **Billing Portal Session Creation**:
   - The `createBillingPortalSession` function creates a session for the Stripe Customer Portal.
   - It requires:
     - `customerId`: The Stripe customer ID associated with the team.
     - `returnUrl`: URL to redirect to after managing billing.

4. **API Endpoints**:
   - **Checkout Endpoint**: `POST /v1/billing/checkout`
     - Validates if the user is an admin and if Stripe is configured.
     - Checks if the team is registered and can upgrade.
     - Creates a checkout session and returns the session URL.
   - **Billing Portal Endpoint**: `POST /v1/billing/portal`
     - Validates if the user is an admin and if Stripe is configured.
     - Checks if the team has a Stripe customer ID.
     - Creates a billing portal session and returns the session URL.

### Error Handling
- The system handles various errors, such as:
  - Stripe not being configured.
  - Team not being registered.
  - Already being on the pro plan.
  - Issues during session creation.

### Usage
- Users can initiate a checkout session to upgrade their plan or access the billing portal for managing their subscription.

### Additional Information
- The billing system is integrated with the overall API, requiring an API key for authentication.
- The billing process is designed to be seamless, allowing users to manage their subscriptions directly through the MailAgent interface.
