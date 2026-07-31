# OL19 (C)

## Answer

Oiloop groups browser tabs into new windows by following these steps:

- It fetches open tabs from both Safari and Google Chrome.
- It identifies groups of tabs based on their domains.
- Tabs are grouped if there are three or more tabs from the same domain.
- The grouped tabs are then moved into new windows using AppleScript commands.

This functionality is managed by the `SafariService` and utilizes the `SafariReader` and `ChromeReader` for tab management.
