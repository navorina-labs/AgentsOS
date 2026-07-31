# OL19 (C)

## Answer

Oiloop groups browser tabs into new windows using the following process:

- **Tab Grouping Logic**: The `SafariService` manages the logic for regrouping open tabs by domain or category.
- **AppleScript Execution**: It executes AppleScript commands to create new browser windows and move the grouped tabs into them.
- **New Window Creation**: For each group of tabs, a new window is created in the browser (Safari or Google Chrome).
- **Tab Movement**: The tabs from the group are moved into the newly created window, with the first tab being set as the initial tab of the new window, and subsequent tabs being added as new tabs.

This process requires Safari Automation permissions for Safari.
