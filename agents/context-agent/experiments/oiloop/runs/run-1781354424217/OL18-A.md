# OL18 (A)

## Answer

Safari tab titles and URLs are fetched using the `SafariReader` class, which is part of the `SafariService`. The `fetchTabs` method in `SafariReader` retrieves the open tabs from Safari. The relevant code for fetching tabs is as follows:

- The `prepareSafariPlan` method in `SafariService` calls `SafariReader.fetchTabs()` to get the list of open tabs.
- The fetched tabs are then processed to identify duplicates and groups.

This process allows the application to summarize and manage the open tabs in Safari.
