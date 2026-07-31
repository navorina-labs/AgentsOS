# NV42 (B)

## Answer

To address the issue of crypto payment failures at the paywall during month close, the following cores and files are relevant:

### Cores Involved
- **Nucleus Core**
  - Handles crypto payments and invoicing.
- **Paywall Core**
  - Manages feature access and subscription tiers.
- **Billing Core**
  - Manages Stripe checkout and subscription state.

### Relevant Files
- **Nucleus Core**
  - `Navorina/src/utils/nucleus-invoicing-hub.ts` (Invoicing)
  - `Navorina/src/utils/nucleus-accountant-pack-hub.ts` (Month close)
  
- **Paywall Core**
  - `server/paywall/index.js` (Canonical paywall logic)
  - `Navorina/src/utils/nucleus-paywall-prompt.ts` (Client prompts)

- **Billing Core**
  - `server/routes/stripe-billing.js` (Checkout + webhook)
  - `server/routes/stripe-billing-tier.js` (Tier/price resolution)

### Additional Considerations
- Check for any errors in the integration between these cores, especially during the month close process, as it may affect the ability to process crypto payments.
