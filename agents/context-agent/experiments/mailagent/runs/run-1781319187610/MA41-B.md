# MA41 (B)

## Answer

### Indexes on the `messages` table:
- `idx_messages_inbox_received` on `(inbox_id, received_at DESC)` — for listing messages.
- `idx_messages_raw_r2_key` (partial) — for raw R2 key lookups.
- `idx_messages_thread` on `(inbox_id, thread_id, received_at DESC)` — for threads API.
- `idx_messages_direction` on `(inbox_id, direction, received_at DESC)` — for filtering outbound messages.

### Constraints on the `messages` table:
- **Primary Key (PK):** `id` — unique identifier for each message.
- **Foreign Key (FK):** `inbox_id` — references `inboxes(id)` with `ON DELETE CASCADE`.
- **Unique Constraint:** `provider_id` — ensures idempotency for inbound messages.
