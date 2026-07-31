# MA17 (A)

## Answer

The simulate feature in MailAgent for QA allows for deterministic testing of email verification processes without relying on actual email delivery. Here’s how it works:

- **Purpose**: 
  - Used when staging does not send mail or when deterministic OTPs are needed in CI.
  - Allows for testing without real SMTP, making it suitable for contract tests and local development.

- **API Usage**:
  - The endpoint `POST /v1/inboxes/:id/simulate` is used to inject a test OTP email into an inbox.
  - The request includes parameters such as:
    - `inboxId`: The ID of the inbox to simulate the message for.
    - `otp`: The one-time password to simulate.
    - `from`: The sender's email address.
    - `subject`: The subject of the simulated email.
    - `fireCallback`: A boolean to indicate if the callback URL should be triggered.
  
- **Example REST Call**:
  ```bash
  curl -sS -X POST "$MAILAGENT_API_URL/v1/inboxes/$INBOX/simulate" \
    -H "Authorization: Bearer $MAILAGENT_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"otp":"482910","subject":"Verify (simulated)"}'
  ```

- **Response**:
  - The response includes the simulated message details, allowing the QA process to verify the OTP or links without waiting for actual email delivery.

- **Integration with SDK**:
  - In the `@mailagent/qa` SDK, the method `simulateAndVerify` can be used to create an inbox, simulate the OTP, and verify it in one step.

- **Use Cases**:
  - Ideal for CI environments where real email delivery is not feasible.
  - Useful for debugging and testing email verification flows without external dependencies.

This feature enhances the reliability and speed of QA processes by allowing for controlled testing scenarios.
