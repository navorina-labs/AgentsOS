# MA17 (A)

## Answer

The simulate feature in MailAgent for QA allows for deterministic testing of email flows without relying on actual email delivery. Here’s how it works:

- **Purpose**: 
  - Used when staging does not send mail or to generate a predictable OTP for CI tests.

- **API Usage**:
  - The endpoint `POST /v1/inboxes/:id/simulate` is used to inject test emails into a specified inbox.
  
- **Simulate Scenarios**:
  - Various scenarios can be simulated, such as OTP emails, magic links, attachments, invites, and invoices.
  - Each scenario has predefined fields like `from`, `subject`, and `otp`.

- **Example of Simulate API Call**:
  ```bash
  curl -sS -X POST "$MAILAGENT_API_URL/v1/inboxes/$INBOX/simulate" \
    -H "Authorization: Bearer $MAILAGENT_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"otp":"482910","subject":"Verify (simulated)"}'
  ```

- **Response Handling**:
  - After simulating, you can extract the OTP or links using the `GET /v1/inboxes/:id/extract` endpoint.

- **Integration with SDK**:
  - In the `@mailagent/qa` SDK, the method `simulateAndVerify` can be used to create an inbox, simulate a message, and verify the OTP in one step.

- **Use Cases**:
  - Ideal for CI environments where real email delivery is not feasible.
  - Allows for testing of email verification flows without waiting for actual emails.

This feature enhances the reliability and speed of QA processes by allowing tests to run without dependency on external email services.
