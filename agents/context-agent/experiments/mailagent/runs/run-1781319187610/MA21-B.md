# MA21 (B)

## Answer

To debug a wait timeout 408, follow these steps:

1. **Check Message Count**:
   - If `messageCount = 0`:
     - Verify the webhook for successful delivery (check `email-core`).
     - Ensure the inbox domain matches the address suffix.
     - Confirm allowed senders against the actual sender.
     - Check if the inbox has expired.
     - Investigate any queue or DLQ lag.

2. **Check Matching Count**:
   - If `messageCount > 0` but `matchingCount = 0`:
     - Relax the `subjectContains` filter.
     - Review the subjects in the 408 debug response.

3. **Check Message Index**:
   - If `matchingCount > 0` but still timing out:
     - The `messageIndex` may be too high. Lower it to 0 or wait longer.

4. **Check for Arrived Messages**:
   - If a message has arrived but `verification.otp` is null:
     - Use `GET …/raw` to check if the code is only in HTML.
     - Verify if the primary link is being used instead of the OTP.
     - Consider using `POST …/extract` with preset `2fa`.
     - Ensure the correct `messageIndex` is being used (welcome vs verify).

5. **Use Diagnose Tool**:
   - Utilize the `GET /v1/inboxes/:id/diagnose` endpoint to gather detailed information about the inbox state, message count, and any potential issues.

By following these steps, you can identify the cause of the timeout and take appropriate actions to resolve it.
