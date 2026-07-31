# OL10 (A)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop includes the following features:

- **IMAP Settings:**
  - Host: Configurable via `imapHost`.
  - Port: Configurable via `imapPort`.
  - Username: Configurable via `imapUser`.
  - Password: Configurable via `imapPass`.
  - Drafts Folder: Configurable via `imapDraftsFolder`.

- **SMTP Settings (if enabled):**
  - Send via SMTP: Configurable via `sendViaSmtp`.
  - SMTP Host: Configurable via `smtpHost`.
  - SMTP Port: Configurable via `smtpPort`.
  - SMTP Username: Configurable via `smtpUser`.
  - SMTP Password: Configurable via `smtpPass`.

- **Mail Functionality:**
  - Users can choose to use Apple Mail or a custom mail client.
  - The system allows for sending emails, saving drafts, and fetching emails from the inbox.
  - Users can set limits on the number of emails fetched from the inbox.

- **User Interface:**
  - The settings are presented in a form where users can input their configurations.
  - There are buttons for testing the connection to the mail server.

This implementation allows users to manage their email settings directly within the Oiloop application, ensuring that all interactions with email services are handled locally and securely.
