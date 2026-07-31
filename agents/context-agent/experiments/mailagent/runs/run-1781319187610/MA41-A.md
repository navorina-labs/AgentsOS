# MA41 (A)

## Answer

The `messages` table has the following indexes and constraints:

### Constraints:
- **Primary Key**: `id` (TEXT) - This ensures that each message has a unique identifier.
- **Foreign Key**: `inbox_id` (TEXT) - This references the `id` in the `inboxes` table, ensuring that each message is associated with a valid inbox.

### Indexes:
- **Index on `inbox_id` and `received_at`**: 
  - `CREATE INDEX IF NOT EXISTS idx_messages_inbox_received ON messages (inbox_id, received_at DESC);`
  - This index allows for efficient querying of messages based on their associated inbox and the time they were received, sorted in descending order.
