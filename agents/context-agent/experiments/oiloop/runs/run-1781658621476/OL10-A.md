# OL10 (A)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop includes the following features:

- **IMAP Settings:**
  - Host: Configurable via `imapHost`.
  - Port: Configurable via `imapPort`.
  - Username: Configurable via `imapUser`.
  - Password: Configurable via `imapPass`.
  - Drafts Folder: Configurable via `imapDraftsFolder`.

- **SMTP Settings:**
  - Option to send emails via SMTP, configurable via `sendViaSmtp`.
  - SMTP Host: Configurable via `smtpHost`.
  - SMTP Port: Configurable via `smtpPort`.
  - SMTP Username: Configurable via `smtpUser`.
  - SMTP Password: Configurable via `smtpPass`.

- **Mail Functionality:**
  - Users can choose to enable or disable the use of Apple Mail, Messages, Notes, and Reminders.
  - Fetch limits for inbox and messages are configurable (e.g., `inboxFetchLimit`, `chatFetchLimit`).

- **User Interface:**
  - Settings view allows users to input and modify their IMAP/SMTP configurations.
  - Options to test the connection to the mail server.

- **Data Handling:**
  - The implementation ensures that user credentials and settings are stored securely and are not sent to the cloud.

This implementation allows users to manage their email communications directly within the Oiloop application while maintaining control over their data and privacy.
