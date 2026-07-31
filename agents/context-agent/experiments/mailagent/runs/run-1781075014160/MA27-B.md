# MA27 (B)

## Answer

Messages are idempotent due to the following mechanism:

- **Unique Identifier:** Each message has a `provider_id` that is marked as UNIQUE in the `messages` table.
- **Resend Integration:** The `provider_id` corresponds to either the Resend `email_id` or a prefix `sim_*` for simulated messages, ensuring that duplicate messages with the same `provider_id` are not inserted multiple times.
