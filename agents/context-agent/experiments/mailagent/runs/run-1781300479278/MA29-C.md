# MA29 (C)

## Answer

To use Playwright with MailAgent, follow these steps:

1. **Install MailAgent QA Package**:
   ```bash
   npm install file:../MailAgent/packages/mailagent-qa
   ```

2. **Create a Test Script**:
   Use the following example to create a test script with Playwright:
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
   Execute your test script using Playwright's test runner.

4. **Cleanup**:
   Ensure to delete the inbox after the test to avoid clutter.

For more detailed examples, refer to the full example in the MailAgent documentation: [examples/playwright/signup-email.spec.example.ts](../examples/playwright/signup-email.spec.example.ts).
