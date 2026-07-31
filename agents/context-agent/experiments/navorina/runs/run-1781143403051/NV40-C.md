# NV40 (C)

## Answer

The process for accepting crypto on invoices involves several key functions and data structures:

- **InvoiceCryptoPaymentMeta**: This type holds metadata related to crypto payments, including:
  - `acceptCrypto`: Boolean indicating if crypto is accepted.
  - `status`: Current status of the crypto payment.
  - `paymentLinkUrl`: URL for the payment link.
  - `asset`, `network`, `amountDue`, `amountReceived`, `fee`, `transactionId`, `rateLockedUntil`, `nucleusTransactionId`, `statusContext`, `updatedAt`: Various details about the payment.

- **setInvoiceAcceptCrypto**: This function updates an invoice to accept crypto payments:
  - It checks the current invoice and updates its `cryptoPayment` metadata.
  - If crypto acceptance is enabled or disabled, it appends a timeline event to the invoice.

- **getInvoiceCryptoPayment**: This function retrieves the crypto payment metadata for a given invoice.

- **cryptoMetaFromServerIntent**: This function updates the invoice's crypto payment metadata based on server intents, ensuring the latest status and details are reflected.

- **applyServerCryptoIntentToInvoice**: This function applies the server's crypto payment intent to the invoice, marking it as paid if applicable and updating the invoice's status.

- **Compliance and Acknowledgment**: There are compliance checks and acknowledgments required when enabling crypto payments, ensuring users are aware of the terms and conditions.

Overall, the system manages the acceptance of crypto payments through a combination of metadata handling, server communication, and compliance measures.
