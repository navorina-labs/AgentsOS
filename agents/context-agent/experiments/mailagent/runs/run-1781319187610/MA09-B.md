# MA09 (B)

## Answer

The critical database tables in MailAgent are:

1. **inboxes**
   - Core table for disposable email addresses with TTL.

2. **messages**
   - Stores inbound and outbound emails associated with inboxes.

3. **callback_deliveries**
   - Logs POST requests to inboxes' callback URLs.

4. **teams**
   - Represents organizations or billing units.

5. **api_keys**
   - Stores hashed API keys for authentication.

6. **oidc_identities**
   - Binds OIDC subjects to teams for OAuth.

7. **message_attachments**
   - Metadata for email attachments.

8. **domains**
   - Custom sending/receiving domains.

9. **message_search**
   - Supports keyword and semantic search for messages.

10. **audit_events**
    - Tracks actions for audit purposes.

11. **agent_run_sessions**
    - Manages multi-step agent states.

These tables are essential for the functionality and data integrity of the MailAgent system.
