# MA28 (B)

## Answer

When an inbox expires:

- It is deleted by the `cron` job that runs `purgeExpired()`.
- The `purgeExpired()` function removes expired inboxes and any associated data in R2 storage.
- Messages linked to the expired inbox are also deleted via foreign key constraints.
- Raw MIME and attachments related to the inbox are purged using `purgeRawMimeForInboxes` and `purgeAttachmentR2ForInboxes`.
