# MA23 (A)

## Answer

The sender allowlist in MailAgent works as follows:

- **Purpose**: It restricts which email senders can send messages to the created inboxes, enhancing security by preventing unwanted emails.

- **Configuration**:
  - The allowlist can be set using the `expectFrom` or `allowedSenders` fields when creating an inbox.
  - If `allowedSenders` is empty, the inbox will accept emails from any sender (useful for development).

- **Normalization**:
  - The allowlist entries are normalized to lowercase and can include specific email addresses or domains.
  - For domains, subdomains are also accepted (e.g., `m.dribbble.com` is allowed if `dribbble.com` is in the list).

- **Validation**:
  - When an email is received, the system checks the sender's address against the allowlist.
  - If the sender is not in the allowlist, the email is not stored in the inbox.

- **Implementation**:
  - The function `isSenderAllowed` checks if the sender's address matches any entry in the allowlist.
  - The allowlist is defined in the `SERVICE_EXPECT_FROM` object for common services, which helps automate the process of setting expected senders based on the service being used.

This mechanism ensures that only emails from trusted sources are processed, reducing the risk of spam or phishing attempts.
