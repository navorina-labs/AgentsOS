# OL19 (C)

## Answer

Oiloop groups browser tabs into new windows by:

- Using the `SafariReader` and `ChromeReader` to fetch open tabs from Safari and Google Chrome.
- Identifying groups of tabs based on their domains, where at least three tabs from the same domain are required to form a group.
- Creating new windows in the respective browsers and moving the grouped tabs into these new windows.
- This functionality is implemented in the `moveTabsToNewWindows` method within the `SafariReader` and `ChromeReader` files.
