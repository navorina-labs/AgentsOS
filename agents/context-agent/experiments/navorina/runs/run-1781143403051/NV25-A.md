# NV25 (A)

## Answer

The server API entry structure includes the following endpoints:

- **Financial Mirror Workspace Services:**
  - `GET /api/financial-mirror/workspace/services` (public)
  - `GET /api/financial-mirror/workspace/context` (requires `userId` for paywall, subscription, and services)

- **Ops API:**
  - `GET/PUT /api/ops/users/:userId/subscription`
  - `GET /api/ops/integrations/summary`
  - `POST /api/ops/digest/weekly?dryRun=1`

- **Billing API:**
  - `GET /api/financial-mirror/billing/*` (specific billing-related operations)

- **Crypto Payments API:**
  - `GET /crypto-payments/status`
  - `POST /crypto-payments/register`
  - `GET /crypto-payments/intent`
  - `POST /crypto-payments/standing/register`
  - `GET /crypto-payments/standing?customerId=`
  - `GET /crypto-payments/checkout?token=`
  - `GET /crypto-payments/audit?monthKey=`
  - `POST /crypto-payments/webhook`
  - `POST /crypto-payments/dev/simulate` (for development)

- **Resend API:**
  - `GET /api/financial-mirror/digest/email-status`
  - `POST /api/financial-mirror/digest/send`

- **Push Notifications API:**
  - `GET /api/financial-mirror/push/status`
  - `PUT /api/financial-mirror/push/subscribe`
  - `POST /api/financial-mirror/push/notify`

- **Magic Inbox API:**
  - `POST /api/financial-mirror/ai/magic-inbox-receipt-hints`

- **Xero API:**
  - `/api/accounting/xero/*` (OAuth, journal push as DRAFT ManualJournals)

This structure provides a comprehensive overview of the available server API endpoints for various functionalities within the Navorina project.
