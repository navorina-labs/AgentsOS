# MA17 (B)

## Answer

The simulate feature for QA works as follows:

- **Endpoint:** `POST /v1/inboxes/:id/simulate`
- **Function:** Calls `simulateInboundMessage()`
- **Provider ID:** Uses a prefix `sim_*` for the provider ID
- **Process:** Follows the same extraction and notification path as inbound messages but does not fetch from Resend
- **MCP:** Utilizes `mailagent_simulate_message` for processing

This allows for testing the inbound message flow without actual email delivery.
