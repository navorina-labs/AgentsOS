# OL18 (A)

## Answer

Safari tab titles and URLs are fetched using the `SafariReader` class, which is part of the `SafariService`. The `prepareSafariPlan` method in the `SafariService` class calls `SafariReader.fetchTabs()` to retrieve the open tabs. The fetched tabs are then processed to identify duplicates and group them as needed.
