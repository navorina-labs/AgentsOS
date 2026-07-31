# MA01 (C)

## Answer

OTP extraction in MailAgent works as follows:

- **Extraction Function**: The function `extractOtp(text: string)` is used to identify and extract OTP codes from the email text.
- **Patterns**: It uses predefined regex patterns to match common OTP formats, such as:
  - `code[:\s]+(\d{4,8})`
  - `verification[:\s]+(\d{4,8})`
  - `one[- ]?time(?: password)?[:\s]+(\d{4,8})`
  - It also matches 4 to 8 digit codes that may appear as standalone numbers.
- **Fallback Parsing**: If the regex patterns do not yield a result, it utilizes the `parseOtpMessage` function to parse the text for OTP codes.
- **Return Value**: The function returns the extracted OTP code if found; otherwise, it returns `null`.

This process ensures that OTP codes are accurately identified and extracted from incoming messages for further processing.
