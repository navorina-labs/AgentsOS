# NV25 (B)

## Answer

The server API entry structure is as follows:

- **Main Entry Point**: 
  - `server/financial-api-server.js` - This is the main Express entry for the API.

- **Routes**:
  - `server/routes/stripe-billing.js` - Handles Stripe checkout and webhook.
  - `server/routes/billing-emulator.js` - Manages development billing.
  - `server/routes/financial-mirror-*.js` - Contains various routes for the financial mirror.
  - `server/routes/ops.js` - Operations version 0.

- **Key Files**:
  - `server/package.json` - Contains server-specific scripts and tests.
  - `server/development.defaults.env` - Default emulator flags for development.
  - `server/.env.example` - Template for production environment variables.
