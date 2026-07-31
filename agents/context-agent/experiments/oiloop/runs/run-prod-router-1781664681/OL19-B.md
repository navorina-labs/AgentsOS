# OL19 (B)

## Answer

Oiloop groups browser tabs into new windows using the following process:

- **Tab Grouping Logic**: Managed by `SafariService`, which handles the regrouping of open tabs by domain or category.
- **AppleScript Execution**: Utilizes AppleScript commands to create new browser windows with grouped tabs.
- **Functionality**: The `groupTabs` function organizes tabs based on their domains and categories, and the `moveTabsToNewWindows` function executes the necessary AppleScript to create new windows with the grouped tabs.
- **User Confirmation**: The process requires explicit user confirmation before closing or moving tabs.
