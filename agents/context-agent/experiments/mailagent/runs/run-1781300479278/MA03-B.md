# MA03 (B)

## Answer

Users may not be receiving emails in their MailAgent inbox due to several potential issues. Here’s a troubleshooting guide:

1. **Check for Messages**:
   - Use `GET /messages` to see if any messages exist.
   - If no messages are found, the issue is likely in the inbound path.

2. **Inbound Path Issues**:
   - Verify the Resend dashboard for webhook deliveries. Check if they returned a 200 status.
   - Ensure the `INBOX_DOMAIN` matches the suffix of the inbox address.
   - Check the `allowed_senders` configuration to see if the sender's email matches.
   - Confirm that the inbox has not expired (`expires_at`).
   - Inspect Cloudflare Queues for any consumer lag.
   - Check the dead letter queue (`mailagent-email-dlq`) for failed jobs.
   - For enterprise setups, ensure the correct webhook URL for the team is configured.

3. **Message Exists but OTP is Null**:
   - Retrieve the raw message using `GET /raw` to check if it contains only HTML code.
   - Ensure the structured extract preset for 2FA is correctly configured.

4. **Callback Issues**:
   - Use `GET /callbacks` to inspect callback logs.
   - Verify that the `callbackUrl` is reachable via HTTPS.
   - Simulate a message with `fireCallback: true` to isolate the issue.

If these checks do not resolve the issue, further investigation into specific configurations and logs may be necessary.
