# MA41 (A)

## Answer

The `messages` table has the following indexes and constraints:

### Constraints:
- **Primary Key**: `id` (TEXT) - This ensures that each message has a unique identifier.
- **Foreign Key**: `inbox_id` (TEXT) - This references the `inboxes` table, ensuring that each message is associated with a valid inbox.

### Indexes:
- **Index on `inbox_id` and `received_at`**: 
  - `idx_messages_inbox_received` - This index is created to optimize queries that filter messages by `inbox_id` and order them by `received_at` in descending order. 

- **Index on `raw_r2_key`**: 
  - `idx_messages_raw_r2_key` - This index is created to optimize queries that check for the presence of a raw MIME stored in R2.

### Additional Fields:
- `provider_id` (TEXT) - Must be unique for each message.
- `from_addr` (TEXT) - The sender's email address.
- `subject` (TEXT) - The subject of the email, with a default value of an empty string.
- `text_preview` (TEXT) - A preview of the email's text content.
- `html_preview` (TEXT) - A preview of the email's HTML content.
- `otp` (TEXT) - The one-time password extracted from the email.
- `links_json` (JSONB) - A JSON array of links extracted from the email.
- `received_at` (TIMESTAMPTZ) - The timestamp when the email was received, with a default value of the current time.
