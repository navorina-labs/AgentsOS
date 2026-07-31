# MA28 (B)

## Answer

When an inbox expires, the following occurs:

- It becomes invisible in operations such as `getInbox` and `findInboxByAddress` (due to the condition `expires_at > NOW()`).
- The `purgeExpired()` cron job is triggered hourly, which:
  - Selects inboxes where `expires_at <= NOW()`.
  - Cleans up associated raw MIME data and attachments in R2.
  - Deletes the expired inboxes from the database.
- The inbox and its associated messages are removed, preventing orphaned data.
