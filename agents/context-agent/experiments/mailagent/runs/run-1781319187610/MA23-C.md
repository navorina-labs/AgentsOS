# MA23 (C)

## Answer

The sender allowlist in the MailAgent project works as follows:

- **Normalization**: The function `normalizeAllowedSenders` normalizes and validates the allowed senders by:
  - Converting input to lowercase.
  - Ensuring that email addresses are properly formatted (e.g., adding "@" if missing).
  - Returning a unique list of allowed senders.

- **Validation**: The function `isSenderAllowed` checks if a sender's email address is allowed by:
  - Allowing all senders if the allowlist is empty.
  - Parsing the sender's email address to extract the host.
  - Comparing the host against the allowed senders:
    - If the allowed sender includes "@" and matches the sender's address exactly, it is allowed.
    - If the allowed sender starts with "@", it checks if the sender's host matches the domain.
    - If the allowed sender does not start with "@", it treats it as a domain and checks for matches with subdomains.

- **Domain Matching**: The function `hostMatchesDomain` is used to determine if the sender's host matches the allowed domain, considering subdomains.

This mechanism ensures that only specified senders can send emails to the inbox, enhancing security and control over incoming messages.
