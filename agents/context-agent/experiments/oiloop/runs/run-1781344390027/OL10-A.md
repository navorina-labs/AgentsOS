# OL10 (A)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop includes the following components:

- **MailSettings**: 
  - Stores configuration for the mail client, including:
    - `mailEnabled`: Boolean to enable/disable mail functionality.
    - `inboxFetchLimit`: Limit for fetching emails from the inbox.
    - `useCustomMail`: Boolean to determine if the custom mail client is used.
    - `imapHost`, `imapPort`, `imapUser`, `imapPass`, `imapDraftsFolder`: Configuration for IMAP settings.
    - `sendViaSmtp`: Boolean to determine if SMTP is used for sending emails.
    - `smtpHost`, `smtpPort`, `smtpUser`, `smtpPass`: Configuration for SMTP settings.

- **MailService**: 
  - Handles operations related to mail, including:
    - `prepareInboxSummary()`: Prepares a summary of the inbox.
    - `prepareDraftReply()`: Prepares a draft reply to an email.
    - `confirmOpenDraftInMail()`: Opens a draft in the Mail app for user review.
    - `confirmOpenDraftInMail(with:)`: Confirms and opens a draft in Mail based on the provided draft plan.

- **CustomMailReader**: 
  - Fetches emails from the inbox using the custom IMAP settings.
  - Handles saving drafts and sending emails via SMTP if configured.

- **MailReader**: 
  - Fetches emails from the default Apple Mail application.

This implementation allows Oiloop to manage emails locally without relying on cloud services, ensuring user privacy.
