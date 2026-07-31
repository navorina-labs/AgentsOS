# MA29 (C)

## Answer

To use Playwright with MailAgent, follow these steps:

1. **Install MailAgent QA Package**:
   ```bash
   npm install file:../MailAgent/packages/mailagent-qa
   ```

2. **Create a Test**:
   Use the following example to create a signup test with email verification:
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
   Execute your Playwright tests as you normally would, ensuring that the MailAgent API is accessible.

4. **Cleanup**:
   Make sure to delete the inbox after the test to avoid clutter:
   ```typescript
   await mail.deleteInbox(inbox.id);
   ```

5. **Additional Resources**:
   - Refer to the full example in `examples/playwright/signup-email.spec.example.ts`.
   - Use the fixture in `examples/playwright/mailagent.fixture.ts` for auto-delete functionality.

This setup allows you to create temporary inboxes for testing email verification flows in your applications.
