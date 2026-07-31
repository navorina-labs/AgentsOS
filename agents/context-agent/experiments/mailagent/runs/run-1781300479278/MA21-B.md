# MA21 (B)

## Answer

To debug a wait timeout 408, follow these steps:

1. **Check Message Count**:
   - If `messageCount = 0`:
     - Verify the Resend webhook is functioning (check for a 200 response).
     - Ensure the inbox domain matches the address suffix.
     - Check allowed senders against the actual "From" address.
     - Confirm the inbox has not expired.
     - Investigate any queue or DLQ lag.

2. **Check for Matching Messages**:
   - If `messageCount > 0` but `matchingCount = 0`:
     - Relax the `subjectContains` filter and check the subjects in the 408 debug response.

3. **Adjust Message Index**:
   - If `matchingCount > 0` but still timing out:
     - Lower the `messageIndex` to 0 or wait longer.

4. **Inspect Arrived Messages**:
   - If a message has arrived but `verification.otp` is null:
     - Use `GET …/raw` to check if the code is only in HTML.
     - Verify if the primary link is being used instead of the OTP.
     - Consider using `POST …/extract` with the preset `2fa`.
     - Check if the wrong `messageIndex` is being used (e.g., welcome vs verify email).

5. **Use Diagnose Tool**:
   - Execute `GET /v1/inboxes/:id/diagnose?subjectContains=&messageIndex=` to get a full troubleshoot bundle, which includes:
     - Inbox metadata and message count.
     - Last messages with OTP, primary link, and raw URL.
     - Last 20 callback deliveries.
     - Wait debug information and troubleshooting hints.

By following these steps, you can identify the cause of the timeout and take appropriate actions to resolve it.
