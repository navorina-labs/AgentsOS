# MA29 (A)

## Answer

To use Playwright with MailAgent, follow these steps:

1. **Install MailAgent QA SDK**:
   - In your test project, install the MailAgent QA SDK:
     ```bash
     npm install file:../MailAgent/packages/mailagent-qa
     ```

2. **Create a Playwright Test**:
   - Import the necessary modules and create a test using the MailAgent QA SDK:
   ```typescript
   import { test, expect } from "@playwright/test";
   import { createMailAgentQa, MailAgentQa } from "@mailagent/qa";

   const mail = createMailAgentQa();

   test("signup with email verify", async ({ page }) => {
     const inbox = await mail.createInbox({
       label: MailAgentQa.runLabel("signup"),
       service: "auth0",
     });

     await page.goto("/signup");
     await page.fill('[name=email]', inbox.address);
     await page.click('button[type=submit]');

     const verification = await mail.waitForVerification(inbox.id, {
       subjectContains: "verify",
       timeoutSeconds: 120,
     });

     if (verification.otp) {
       await page.fill('[name=code]', verification.otp);
       await page.click('button[type=submit]');
     }

     await mail.deleteInbox(inbox.id);
   });
   ```

3. **Run the Test**:
   - Execute your Playwright tests as usual, ensuring that the MailAgent API URL and API key are set in your environment.

4. **Cleanup**:
   - Optionally, you can clean up the inbox after the test to avoid exceeding limits:
   ```typescript
   await mail.deleteInbox(inbox.id);
   ```

5. **Debugging**:
   - Use the debug UI to inspect the inbox and messages if needed:
   ```bash
   curl -sS "$MAILAGENT_API_URL/v1/inboxes?label=ci-12345" \
     -H "Authorization: Bearer $MAILAGENT_API_KEY" | jq .
   ```

For more detailed examples and configurations, refer to the [MailAgent QA documentation](https://webmailagent.com/docs/qa.html).
