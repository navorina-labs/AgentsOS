# OL19 (C)

## Answer

Oiloop groups browser tabs into new windows by:

- Using the `SafariReader` and `ChromeReader` to fetch open tabs from Safari and Google Chrome.
- Identifying groups of tabs based on their domains.
- Creating new browser windows for each group of tabs that share the same domain.
- Moving the tabs into their respective new windows using AppleScript commands.

This process is managed by the `SafariService`, which prepares a plan that includes the grouped tabs and executes the necessary commands to organize them.
