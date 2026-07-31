# MA21 (A)

## Answer

To debug a wait timeout (408) in the MailAgent project, follow these steps:

1. **Check for Zero Messages in Inbox**:
   - Verify if the staging application sent the email by checking app logs or the mail queue.
   - Confirm that the Resend webhook is functioning by checking the health endpoint (`GET /health`) and the Resend Dashboard for events.
   - Ensure the inbox address is correct (it should be `@your-inbox-domain`, not a random email).
   - Validate the sender allowlist (`service` preset or `expectFrom`) to ensure the email is not dropped.

   ```bash
   curl -sS "$MAILAGENT_API_URL/v1/inboxes/INBOX_ID/messages" \
     -H "Authorization: Bearer $MAILAGENT_API_KEY" | jq .
   ```

2. **Messages Exist, but Wait Still Times Out**:
   - Relax the `subjectContains` filter or remove it temporarily.
   - If the first email is a welcome message, the second email may contain the OTP. Use `messageIndex=1` to wait for the second message.

   ```bash
   curl "$MAILAGENT_API_URL/v1/inboxes/$INBOX_ID/wait?timeout=120&messageIndex=1&subjectContains=verify"
   ```

3. **Message Exists, but OTP/Link is Empty**:
   - Open the raw MIME of the message to check its content.

   ```bash
   curl -sS "$MAILAGENT_API_URL/v1/inboxes/:id/messages/:id/raw" \
     -H "Authorization: Bearer $MAILAGENT_API_KEY"
   ```

   - Ensure the email is not HTML-only and that the OTP/link is present.

4. **Callback URL Did Not Fire**:
   - Check the delivery log for the callback URL to see if it was triggered.

   ```bash
   curl -sS "$MAILAGENT_API_URL/v1/inboxes/INBOX_ID/callbacks" \
     -H "Authorization: Bearer $MAILAGENT_API_KEY" | jq .
   ```

   - If the callback is not recorded, ensure the `callbackUrl` was passed correctly when creating the inbox and that the email arrived.

5. **Rate Limit / Quota Issues**:
   - Check the usage stats to see if the inbox limit has been reached.

   ```bash
   curl -sS "$MAILAGENT_API_URL/v1/me" -H "Authorization: Bearer $MAILAGENT_API_KEY" | jq .
   ```

If the issue persists after these checks, consider using the debug UI to further investigate the inbox state and messages.
