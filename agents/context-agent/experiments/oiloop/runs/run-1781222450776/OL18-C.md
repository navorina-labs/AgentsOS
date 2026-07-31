# OL18 (C)

## Answer

Safari tab titles and URLs are fetched using the `SafariReader` class, which utilizes JavaScript for Automation (JXA) to interact with the Safari application. The process involves the following steps:

- A JavaScript function is defined to access the Safari application and retrieve its open windows and tabs.
- For each window, the script iterates through its tabs, collecting the title and URL of each tab.
- The collected data is returned as a JSON string, which is then decoded into `SafariTabSummary` objects in Swift.

The relevant method in `SafariReader` is `fetchTabs()`, which executes the JavaScript and processes the results.
