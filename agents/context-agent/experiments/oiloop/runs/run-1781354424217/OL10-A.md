# OL10 (A)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop includes the following components:

- **MailSettings**: 
  - Stores configuration for the mail client, including:
    - `mailEnabled`: Boolean to enable/disable the mail feature.
    - `inboxFetchLimit`: Limit for fetching emails from the inbox.
    - `useCustomMail`: Boolean to determine if custom mail settings are used.
    - IMAP settings:
      - `imapHost`: Host for the IMAP server.
      - `imapPort`: Port for the IMAP server.
      - `imapUser`: Username for the IMAP account.
      - `imapPass`: Password for the IMAP account.
      - `imapDraftsFolder`: Folder name for drafts.
    - SMTP settings (if `sendViaSmtp` is enabled):
      - `smtpHost`: Host for the SMTP server.
      - `smtpPort`: Port for the SMTP server.
      - `smtpUser`: Username for the SMTP account.
      - `smtpPass`: Password for the SMTP account.

- **MailService**: 
  - Handles operations related to mail, including:
    - `prepareInboxSummary()`: Prepares a summary of the inbox.
    - `prepareDraftReply()`: Prepares a draft reply to an email.
    - `confirmOpenDraftInMail()`: Opens the draft in the Mail app for user review.
    - `confirmOpenDraftInMail(with:)`: Confirms and opens a draft in Mail with specific details.

- **CustomMailReader**: 
  - Fetches emails from the inbox using the custom IMAP settings.
  - Handles saving drafts to the IMAP drafts folder.

- **MailReader**: 
  - Fetches emails from the default Apple Mail application.

- **Error Handling**: 
  - Various error types are defined to handle issues related to mail operations, such as `MailToolError`.

This implementation allows Oiloop to interact with the user's email accounts, fetch messages, and create drafts without relying on cloud services, ensuring that all operations remain local.
