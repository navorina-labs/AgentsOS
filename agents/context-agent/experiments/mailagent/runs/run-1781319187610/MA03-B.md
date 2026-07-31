# MA03 (B)

## Answer

Users may not be receiving emails in their MailAgent inbox due to several potential issues. Here’s a troubleshooting guide:

1. **Check for Messages:**
   - Use `GET /messages` to see if any messages exist.
   - If no messages are found, the issue is likely in the inbound path.

2. **Inbound Path Issues:**
   - Verify the Resend dashboard for webhook delivery status. Are there any failures?
   - Ensure the `INBOX_DOMAIN` matches the suffix of the inbox address.
   - Check the `allowed_senders` configuration. Does the "From" address match any allowed senders?
   - Confirm that the inbox has not expired (`expires_at`).
   - Inspect Cloudflare Queues for any consumer lag.
   - Check the dead letter queue (`mailagent-email-dlq`) for failed jobs.
   - For enterprise setups, ensure the correct webhook URL for the team is configured.

3. **Message Exists but OTP is Null:**
   - If messages exist but the OTP is null, check if the raw message contains only HTML code.
   - Ensure the structured extract preset for 2FA is correctly configured.

4. **Callback Issues:**
   - Inspect the callback log using `GET /callbacks`.
   - Verify that the `callbackUrl` is reachable via HTTPS.
   - Use simulation with `fireCallback: true` to isolate the issue.

By following these steps, you can identify and resolve the reasons why emails are not appearing in the MailAgent inbox.
