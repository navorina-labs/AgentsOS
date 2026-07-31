# OL18 (A)

## Answer

Safari tab titles and URLs are fetched using the `SafariReader` class, which is part of the `Core/Orchestrator` module. The `prepareSafariPlan` method in the `SafariService` class calls `SafariReader.fetchTabs()` to retrieve the open tabs. This method collects the titles and URLs of the tabs currently open in Safari. If Chrome is also enabled, it can similarly fetch tabs using `ChromeReader.fetchTabs()`.
