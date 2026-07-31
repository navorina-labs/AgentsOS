# MA23 (B)

## Answer

The sender allowlist in MailAgent works as follows:

- **Purpose**: To restrict which senders can fill an inbox.
- **Configuration**: Set during inbox creation using parameters like `expectFrom`, `allowedSenders`, or a preset `service`.
- **Normalization Rules**:
  - Exact email addresses are stored in lowercase.
  - Domain rules can be specified (e.g., `@example.com`).
  - An empty allowlist (`undefined` or empty array) means all senders are accepted.

- **Matching Process**:
  - The `From` header is parsed to extract the email.
  - An exact match checks if the full address matches.
  - Domain rules check if the sender's host matches the allowed domain or its subdomains.

- **Security Properties**:
  - If a sender does not match the allowlist, the message is silently dropped (not stored, no error to sender).
  - Bypass attempts (e.g., spoofed `From` headers) rely on the integrity of the receiving service (Resend).

- **Operational Risks**:
  - Silent drops can lead to confusion for senders, as they do not receive bounce notifications.

This mechanism ensures that only specified senders can send messages to the inbox, enhancing security and control over incoming emails.
