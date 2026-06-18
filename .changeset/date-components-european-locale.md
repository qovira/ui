---
"@qovira/ui": minor
---

DateField, DatePicker, and Calendar now accept a `locale` prop (BCP-47 tag) and default it to `"en-GB"`, so dates render in European style out of the box: DateField and DatePicker segments order dd/mm (previously the en-US mm/dd default) and both the standalone Calendar and the DatePicker's calendar start the week on Monday. Pass an explicit `locale` (e.g. `"en-US"`) to override. Note this changes the default rendered date format and week start for consumers who relied on the previous en-US default.
