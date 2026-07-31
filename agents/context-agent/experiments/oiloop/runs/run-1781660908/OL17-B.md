# OL17 (B)

## Answer

The `RemindersReader.parseDate(from:)` function is used to parse natural language deadlines like "tomorrow at 5pm" or "завтра в 17:00". It utilizes `NSDataDetector(types: NSTextCheckingResult.CheckingType.date.rawValue)` to achieve this.
