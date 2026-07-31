# MA03 (A)

## Answer

Users may not be receiving emails in their MailAgent inbox due to several potential issues:

- **Staging Not Sending Mail**: Ensure that the application is configured to send emails to the MailAgent inbox. Check application logs and mail queues.
  
- **Resend Webhook Issues**: Verify that the Resend webhook is correctly set up and that it is receiving events. Use the health check endpoint to confirm the webhook status.

- **Incorrect Inbox Domain**: Ensure that the email address used for the inbox is correctly formatted and matches the expected domain (e.g., `@your-inbox-domain`).

- **Sender Allowlist**: Check if the email is from an allowed sender. If the `service` preset or `expectFrom` is not set correctly, emails from other domains may be dropped.

- **Quota Limits**: If the inbox limit has been reached (e.g., `inbox_limit_reached`), no new emails will be accepted. Check the usage stats for active inboxes.

- **Callback URL Issues**: If using a callback URL, ensure it is valid and reachable. If the callback does not fire, it may indicate a problem with the URL or the webhook delivery.

- **Message Extraction Issues**: If messages are present but the wait function times out, ensure that the `subjectContains` filter is not too restrictive or that the correct message index is being used.

- **Rate Limits**: If the API key has exceeded its rate limit, it may prevent further email processing. Check the rate limit headers in the API response.

To troubleshoot, you can:
- Use the debug UI to inspect the inbox and messages.
- Check the delivery logs for callbacks.
- Run the `GET /v1/inboxes/:id/diagnose` endpoint for detailed diagnostics.
