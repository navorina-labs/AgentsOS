# OL10 (A)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop includes the following components:

- **MailSettings**: 
  - Stores configuration for using custom mail, including:
    - `imapHost`: IMAP server address.
    - `imapPort`: Port for IMAP (default is 993).
    - `imapUser`: Username for IMAP authentication.
    - `imapPass`: Password for IMAP authentication.
    - `imapDraftsFolder`: Folder name for drafts (default is "Drafts").
    - `sendViaSmtp`: Boolean indicating whether to send emails via SMTP.
    - `smtpHost`: SMTP server address.
    - `smtpPort`: Port for SMTP (default is 587).
    - `smtpUser`: Username for SMTP authentication.
    - `smtpPass`: Password for SMTP authentication.

- **MailService**: 
  - Handles operations related to mail, including:
    - `prepareDraftReply`: Prepares a draft reply based on the latest email or specified message ID.
    - `confirmOpenDraftInMail`: Opens the draft in the Mail app for user review and sending.
    - `cancelDraft`: Cancels the current draft.

- **CustomMailReader**: 
  - Fetches inbox messages and handles sending drafts via IMAP/SMTP based on user settings.

- **MailReader**: 
  - Fetches inbox messages from the default Apple Mail.

- **MailTriageBuilder**: 
  - Builds an overview of the inbox and drafts replies using the local LLM.

- **Error Handling**: 
  - Various error types are defined to handle issues related to mail operations, such as missing configurations or API request failures.

This implementation allows Oiloop to manage email interactions locally without relying on cloud services, ensuring user data remains private.
