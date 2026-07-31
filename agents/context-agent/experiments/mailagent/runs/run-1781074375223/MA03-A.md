# MA03 (A)

## Answer

Users may not be receiving emails in their MailAgent inbox due to several potential issues:

- **Staging Not Sending Mail**: Ensure that the application is configured to send emails to the MailAgent inbox. Check application logs and mail queues.
  
- **Resend Webhook Issues**: Verify that the Resend webhook is correctly set up and functioning. Use the health check endpoint to confirm the webhook is active.

- **Incorrect Inbox Domain**: The email address used must match the expected inbox domain (e.g., `@your-inbox-domain`), not a random email provider like Gmail.

- **Sender Allowlist**: Ensure that the email is coming from an allowed sender. The `service` preset or `expectFrom` must be correctly configured to accept emails from the specified domains.

- **Quota Limits**: Check if the inbox limit has been reached. If the maximum number of active inboxes for the API key has been exceeded, new inboxes will not receive emails.

- **Callback URL Issues**: If using a callback URL, ensure it is valid and reachable. If the callback fails, it may prevent the inbox from processing incoming messages.

- **Message Extraction Issues**: If messages are present but the expected content (like OTP or links) is not extracted, check the message format and ensure it is compatible with the extraction logic.

To troubleshoot, you can:
- Use the debug UI to inspect the inbox and see if any messages are present.
- Check the delivery logs for callbacks to see if they were successfully received.
- Review the configuration for allowed senders and ensure the application is sending emails correctly.
