# OL10 (A)

## Answer

The custom IMAP/SMTP mail client implementation in Oiloop includes the following components:

- **MailSettings**: 
  - Stores configuration for the mail client, including:
    - `mailEnabled`: Boolean to enable/disable mail functionality.
    - `inboxFetchLimit`: Limit for fetching emails from the inbox.
    - `useCustomMail`: Boolean to indicate if a custom mail setup is used.
    - `imapHost`, `imapPort`, `imapUser`, `imapPass`, `imapDraftsFolder`: Configuration for IMAP settings.
    - `sendViaSmtp`: Boolean to indicate if SMTP should be used for sending emails.
    - `smtpHost`, `smtpPort`, `smtpUser`, `smtpPass`: Configuration for SMTP settings.

- **MailService**: 
  - Handles operations related to mail, including:
    - `prepareInboxSummary()`: Fetches and summarizes emails from the inbox.
    - `prepareDraftReply()`: Prepares a draft reply to an email.
    - `confirmOpenDraftInMail()`: Opens a draft in the Mail app for user review and sending.
    - `confirmOpenDraftInMail(with:)`: Confirms and sends a draft email based on the provided draft plan.

- **CustomMailReader**: 
  - Responsible for fetching emails from the inbox and saving drafts using the custom IMAP configuration.

- **MailReader**: 
  - Fetches emails from the default Apple Mail application.

- **MailTriageBuilder**: 
  - Builds an overview of the inbox and drafts replies based on the fetched emails.

- **Error Handling**: 
  - Various error types are defined to handle issues related to mail operations, such as missing configurations or failed requests.

This implementation allows Oiloop to interact with the user's email through both IMAP for fetching and SMTP for sending, while providing a user-friendly interface for managing email tasks.
