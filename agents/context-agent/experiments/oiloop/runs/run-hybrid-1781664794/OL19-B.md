# OL19 (B)

## Answer

Oiloop groups browser tabs into new windows using the following process:

- **Tab Grouping Logic**: Managed by the `SafariService`, which handles the regrouping of open tabs by domain or category.
- **AppleScript Execution**: It executes AppleScript commands to create new browser windows with the grouped tabs.
- **Browser Integration**: This process requires Safari Automation permissions to function correctly.
- **Grouping Functionality**: The `groupTabs` function in the `SafariService` organizes tabs and the `moveTabsToNewWindows` function facilitates the actual creation of new windows with the grouped tabs.
