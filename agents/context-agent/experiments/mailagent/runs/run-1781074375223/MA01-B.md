# MA01 (B)

## Answer

OTP extraction in MailAgent works as follows:

### Extraction Process
1. **Combine Content**:
   - Merges `text` and `html` from the Resend receiving API.

2. **Extract OTP**:
   - Uses `extractOtp(combined)` function with regex patterns:
     - Looks for keywords: `code:`, `verification:`, `one-time password:`
     - Matches 6-digit and 4-digit numbers, skipping 4-digit years starting with `20`.
   - Fallback to `parse-otp-message` npm package if regex fails.

3. **Extract Links**:
   - Uses `extractLinks(combined)` function:
     - Applies URL regex, deduplicates, and filters out noise (e.g., unsubscribe links).
     - Ranks verify-like URLs higher and limits to a maximum of 5 links.

4. **Determine Primary Link**:
   - Uses `primaryLink(links)` to select the best magic link from the extracted links.

### Storage
- Extracted data is stored in:
  - `messages.otp`
  - `messages.links_json`
- This occurs during the `insertMessage()` in the queue consumer.

### Processing Context
- OTP extraction is performed during queue processing for reliability, not in the webhook.

### API Endpoints for OTP
- `GET /v1/inboxes/:id/extract`: Returns the latest message verification.
- `GET /v1/inboxes/:id/messages`: Returns per-message OTP and primary link.
- `POST /v1/inboxes/open`: Waits and returns verification.
- `POST /v1/agent/verify`: Agent-oriented verification.

### Debugging and Fallbacks
- If regex fails, a structured extract can be attempted using `POST …/messages/:id/extract` with a preset for 2FA.

### Dependencies
- Relies on the `parse-otp-message` package and successful processing of messages from the Resend API.
