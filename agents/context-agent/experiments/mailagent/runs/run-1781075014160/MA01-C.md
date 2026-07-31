# MA01 (C)

## Answer

OTP extraction in MailAgent works as follows:

- **Extraction Patterns**: The system uses predefined regex patterns to identify OTP codes in the email text. Common patterns include:
  - `code[:\s]+(\d{4,8})`
  - `verification[:\s]+(\d{4,8})`
  - `one[- ]?time(?: password)?[:\s]+(\d{4,8})`
  - It also looks for 4 to 8 digit codes that may appear as standalone numbers.

- **Fallback Parsing**: If the regex patterns do not yield a result, the system utilizes the `parse-otp-message` library to parse the message for OTP codes.

- **Functionality**: The `extractOtp` function is responsible for this process. It:
  - Iterates through the defined OTP patterns to find a match.
  - If a match is found, it returns the OTP code.
  - If no match is found, it attempts to parse the message using the fallback method.

- **Return Value**: The function returns either the extracted OTP code or `null` if no code is found.

This process ensures that OTP codes can be reliably extracted from various email formats and structures.
