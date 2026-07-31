# OL18 (C)

## Answer

Safari tab titles and URLs are fetched using the `SafariReader` class, which utilizes JavaScript for Automation (JXA) to interact with the Safari application. The process involves the following steps:

- A JavaScript function is defined to access the Safari application.
- The function checks if Safari is running and retrieves all open windows and their respective tabs.
- For each tab, the title and URL are collected along with their window and tab indices.
- The collected data is returned as a JSON string, which is then decoded into `SafariTabSummary` objects.

The relevant method in `SafariReader` is `fetchTabs()`, which executes the JavaScript and processes the results.
