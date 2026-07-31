# NV05 (C)

## Answer

Stripe Plus checkout works locally through a billing emulator. Here are the key points:

- **Emulator Mode**: The billing emulator allows for local testing without needing a live Stripe account. It can be enabled by setting the environment variable `BILLING_EMULATOR=1`.

- **Checkout Session Creation**: 
  - A POST request is made to `/api/billing/create-checkout-session`.
  - The request can include an optional body specifying the tier (e.g., 'plus', 'pro') and URLs for success and cancellation.
  - If the emulator is active, the user's tier is set in a local store, and a response is returned with a URL for the emulator checkout.

- **User Subscription Management**: 
  - The emulator writes the user's subscription tier to a local JSON file or a database (e.g., Supabase) as if it were a real transaction.
  - The emulator can simulate instant upgrades without actual payment processing.

- **Response Handling**: 
  - The response includes a URL for the checkout session, which can redirect to a success page with an emulator flag.

- **Testing**: 
  - Tests can be run to verify the emulator's functionality, ensuring that it behaves as expected during local development.

This setup allows developers to test the subscription flow without needing to interact with the live Stripe API.
