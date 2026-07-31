# MA01 (B)

## Answer

OTP extraction in MailAgent works through a defined algorithm that processes incoming email messages to identify and extract one-time passwords (OTPs). Here’s a concise breakdown of the process:

### Extraction Process
1. **Input**: The extraction function receives the combined text and HTML content of the email.
2. **Regex Patterns**: It uses a series of ordered regex patterns to find potential OTPs:
   - Explicit labels like `code:`, `verification:`, and `one-time password:` are prioritized.
   - Standalone 6-digit and 4-digit numbers are also considered.
   - A guard is in place to skip 4-digit numbers starting with "20" (to avoid year confusion).
3. **Fallback Parsing**: If no OTP is found using regex, it falls back to the `parse-otp-message` library, which can handle more natural language patterns.
4. **Return Value**: The function returns the first valid OTP found or `null` if no valid OTP is detected.

### Key Points
- **Single Extraction**: OTP is extracted once during the message ingestion process and stored in the database.
- **No Re-parsing**: Subsequent reads do not re-parse the email; they retrieve the stored OTP directly.
- **Conditions for Null**: OTP extraction may return null if:
  - The OTP is embedded in an image or SVG.
  - The email contains only alphanumeric codes.
  - The OTP is in an attachment (e.g., PDF).
  - The email is a magic link only without any digits.

### Example Code Snippet
The core extraction function is defined as follows:
```typescript
export function extractOtp(text: string): string | null {
  // Phase 1: ordered regex patterns (first match wins)
  for (const pattern of OTP_PATTERNS) {
    const match = text.match(pattern);
    const code = match?.[1];
    if (!code) continue;
    if (code.length === 4 && code.startsWith("20")) continue; // year guard
    return code;
  }
  // Phase 2: npm parse-otp-message
  const parsed = parseOtpMessage(text);
  if (parsed?.code && /^\d{4,8}$/.test(parsed.code)) return parsed.code;
  return null;
}
```

This structured approach ensures that OTP extraction is efficient and reliable, minimizing false positives and maximizing the chances of correctly identifying valid OTPs.
