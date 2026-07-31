# OL18 (C)

## Answer

Safari tab titles and URLs are fetched using the `SafariReader` class, which executes JXA/AppleScript scripting commands. The process involves the following steps:

- The `fetchTabs()` function constructs a JavaScript function that:
  - Checks if Safari is running.
  - Iterates through all open windows and their tabs.
  - Collects the title and URL of each tab.
- The collected data is returned as a JSON string, which is then decoded into an array of `SafariTabSummary` objects containing the title, URL, window index, and tab index.
