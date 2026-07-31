# MA17 (A)

## Answer

The simulate feature in MailAgent for QA allows for deterministic testing of email flows without relying on actual email delivery. Here’s how it works:

- **Purpose**: 
  - Used when staging does not send mail or to generate a predictable OTP for CI tests.

- **API Endpoint**: 
  - `POST /v1/inboxes/:id/simulate` allows injecting test emails into a specified inbox.

- **Simulate Scenarios**: 
  - Predefined scenarios can be used, such as OTP, magic link, attachment, etc.
  - Each scenario has specific fields like `otp`, `from`, `subject`, and `links`.

- **Example Usage**:
  ```bash
  INBOX=$(curl -sS -X POST "$MAILAGENT_API_URL/v1/inboxes" \
    -H "Authorization: Bearer $MAILAGENT_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"label":"sim-test","ttlMinutes":15}' | jq -r .id)

  curl -sS -X POST "$MAILAGENT_API_URL/v1/inboxes/$INBOX/simulate" \
    -H "Authorization: Bearer $MAILAGENT_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"otp":"482910","subject":"Verify (simulated)"}' | jq .
  ```

- **Integration with QA SDK**:
  - The `@mailagent/qa` SDK provides methods like `simulateAndVerify()` to streamline the process of simulating an email and verifying the response.

- **Use Cases**:
  - Ideal for CI environments where real email delivery is not feasible.
  - Allows for testing of email verification flows, ensuring that the application behaves as expected without waiting for actual emails.

- **Testing Frameworks**:
  - Can be integrated with testing frameworks like Playwright and Cypress for automated testing scenarios.

This feature enhances the reliability and speed of QA processes by allowing tests to run without dependency on external email services.
