# MA01 (B)

## Answer

OTP extraction in MailAgent works through a structured process involving regex patterns and a fallback parser. Here are the key steps:

- **Input**: The extraction process takes the combined text and HTML content of an email.
  
- **Regex Patterns**: 
  - The extraction starts with a series of ordered regex patterns (defined in `OTP_PATTERNS`), where the first match wins. The patterns include:
    - `/code[:\s]+(\d{4,8})/i`
    - `/verification[:\s]+(\d{4,8})/i`
    - `/one[- ]?time(?: password)?[:\s]+(\d{4,8})/i`
    - `/\b(\d{6})\b/`
    - `/\b(\d{4})\b/`
  - A guard is in place to skip 4-digit matches starting with "20" to avoid false positives related to years.

- **Fallback Parsing**: 
  - If no valid OTP is found using regex, the `parse-otp-message` library is used as a fallback to extract the OTP from the message.

- **Output**: 
  - The extracted OTP is stored in the database as `messages.otp` for later retrieval.

- **Conditions for Null OTP**: 
  - The OTP extraction may return null if:
    - The code is only present in an image or SVG.
    - The code is alphanumeric (not purely digits).
    - The code is in an attachment (e.g., PDF).
    - The email contains only a magic link without any digits.

- **Usage**: 
  - The `extractOtp` function is called during the email ingestion process, specifically in the `processInboundEmail` function.

This structured approach ensures that OTPs are reliably extracted from various email formats while minimizing false positives.
