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
  - An exact match against the allowlist is checked.
  - Domain rules allow matches for subdomains.

- **Behavior**:
  - If a sender does not match the allowlist, the message is silently dropped (not stored, no error to sender).
  - If the allowlist is empty, any sender is accepted.

- **Security Properties**:
  - Mismatches result in messages being dropped without notification.
  - Attempts to bypass the allowlist rely on the integrity of the receiving service (Resend).

- **Pentest Considerations**:
  - Testing can involve sending messages with incorrect `From` headers to ensure they are not delivered.

This mechanism helps maintain control over which emails are processed and stored in the system.
