# MA21 (A)

## Answer

To debug a wait timeout (408) in MailAgent, follow these steps:

1. **Zero Messages in Inbox**:
   - Check if the staging application sent the email. Review app logs and mail queues.
   - Verify the Resend webhook is functioning by checking the health endpoint: `GET /health`.
   - Ensure the inbox address is correct (it should be `@your-inbox-domain`, not a random Gmail).
   - Confirm that the email is from an allowed sender using the `service` preset or `expectFrom`.

   ```bash
   curl -sS "$MAILAGENT_API_URL/v1/inboxes/INBOX_ID/messages" \
     -H "Authorization: Bearer $MAILAGENT_API_KEY" | jq .
   ```

2. **Messages Exist, Wait Still Times Out**:
   - Relax the `subjectContains` filter or remove it temporarily.
   - If the first email is a welcome message, the second email may contain the OTP. Use `messageIndex=1` to wait for the second message.

   ```bash
   curl "$MAILAGENT_API_URL/v1/inboxes/INBOX_ID/wait?timeout=120&messageIndex=1&subjectContains=verify"
   ```

3. **Message Exists, OTP/Link Empty**:
   - Open the raw MIME of the message to check its content.

   ```bash
   curl -sS "$MAILAGENT_API_URL/v1/inboxes/INBOX_ID/messages/:id/raw" \
     -H "Authorization: Bearer $MAILAGENT_API_KEY"
   ```

   - Ensure the email is not HTML-only and that the OTP or magic link is present.

4. **Callback URL Did Not Fire**:
   - Check the delivery log for the callback URL.

   ```bash
   curl -sS "$MAILAGENT_API_URL/v1/inboxes/INBOX_ID/callbacks" \
     -H "Authorization: Bearer $MAILAGENT_API_KEY" | jq .
   ```

   - If the callback failed, ensure the URL is reachable and responds with a 2xx status code.

5. **Rate Limit / Quota**:
   - Check if the rate limit has been exceeded.

   ```bash
   curl -sS "$MAILAGENT_API_URL/v1/me" -H "Authorization: Bearer $MAILAGENT_API_KEY" | jq .
   ```

If you encounter any issues during these steps, refer to the debug UI for more insights: [debug.html](https://webmailagent.com/debug.html?inbox=INBOX_ID).
