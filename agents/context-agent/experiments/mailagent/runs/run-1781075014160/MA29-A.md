# MA29 (A)

## Answer

To use Playwright with MailAgent, follow these steps:

1. **Install the MailAgent QA SDK**:
   ```bash
   npm install @mailagent/qa
   ```

2. **Set Up Playwright**:
   - Create a test file (e.g., `signup-email.spec.ts`).
   - Import the necessary modules:
     ```typescript
     import { test, expect } from "@playwright/test";
     import { createMailAgentQa, MailAgentQa } from "@mailagent/qa";
     ```

3. **Write a Test**:
   - Use the MailAgent QA SDK to create an inbox, fill out a signup form, and wait for verification:
     ```typescript
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

4. **Run Your Tests**:
   - Execute your Playwright tests using the command:
     ```bash
     npx playwright test
     ```

5. **Cleanup**:
   - Ensure to delete the inbox after the test to avoid exceeding limits:
     ```typescript
     await mail.deleteInbox(inbox.id);
     ```

### Additional Resources:
- For more detailed examples, refer to the Playwright examples in the MailAgent repository, such as `examples/playwright/signup-email.spec.example.ts`.
- Use the `mailagent.fixture.ts` for automatic inbox cleanup in your tests.

### Note:
- Ensure that your environment variables (`MAILAGENT_API_URL` and `MAILAGENT_API_KEY`) are set correctly for the tests to run against the MailAgent API.
