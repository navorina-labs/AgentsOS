# MA21 (B)

## Answer

To debug a wait timeout (408) in the MailAgent project, follow these steps:

### Check for Zero Messages
- Use the command: `GET …/messages`
  - Ensure the webhook is functioning.
  - Verify the domain and allowlist settings.

### Messages Present but Timeout
- Relax the `subjectContains` filter.
- Try using `messageIndex=1` to check for older messages (e.g., welcome emails).

### Message Exists but OTP is Null
- Use the command: `GET …/messages/:id/raw`
  - Check if the message is HTML-only, which may not contain the OTP.

### Magic Link Only
- If only a magic link is present, use `primaryLink` or check the `links[]` array.

### Wrong Service Preset
- Ensure the `service` matches the actual "From" domain of the email.

### Debug Tools
- Use the following commands for further diagnosis:
  - `GET /v1/inboxes/:id/diagnose?subjectContains=…&messageIndex=…`
  - `GET /v1/inboxes/:id/callbacks` (if using a callback URL)
  - `curl /v1/me` to check quota/rate limits.

### Documentation
- Refer to the troubleshooting documentation: `docs/QA-TROUBLESHOOTING.md` (sections 1–3) for additional guidance.
