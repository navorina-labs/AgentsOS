# MA23 (C)

## Answer

The sender allowlist in the MailAgent project works as follows:

- **Normalization**: The function `normalizeAllowedSenders` normalizes and validates the allowed senders by:
  - Converting input to lowercase.
  - Ensuring that email addresses are properly formatted (e.g., adding "@" if missing).
  - Returning a unique list of allowed senders.

- **Validation**: The function `isSenderAllowed` checks if a sender is allowed by:
  - Returning true if the allowlist is empty (any sender is allowed).
  - Parsing the sender's email address to extract the host.
  - Comparing the host against the allowed senders:
    - If the rule includes "@" and matches the full address, it returns true.
    - If the rule is a domain (starts with "@"), it checks if the sender's host matches the domain or any of its subdomains.

- **Usage**: The allowlist is applied when processing inbound emails to determine if the sender's address is permitted to send messages to the inbox. If the sender is not allowed, the message is dropped and not stored.
