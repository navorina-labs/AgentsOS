# MA23 (C)

## Answer

The sender allowlist in the MailAgent project works as follows:

- **Normalization**: The function `normalizeAllowedSenders` normalizes and validates the allowed senders by:
  - Converting input to lowercase.
  - Trimming whitespace.
  - Ensuring valid email formats (e.g., adding "@" if missing).

- **Allowlist Logic**: The function `isSenderAllowed` checks if a sender is allowed by:
  - Returning true if the allowlist is empty (any sender is allowed).
  - Parsing the sender's email address.
  - Checking if the sender's domain matches any domain in the allowlist:
    - Exact matches for full email addresses.
    - Domain matches for subdomains (e.g., `m.dribbble.com` matches `dribbble.com`).

- **Helper Functions**:
  - `hostMatchesDomain`: Determines if the sender's host matches a specified domain.
  - `parseFromAddress`: Extracts and validates the email address from a given string.

This mechanism ensures that only specified senders can send emails to the inboxes, enhancing security and control over incoming messages.
