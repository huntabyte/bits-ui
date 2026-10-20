---
"bits-ui": patch
---

fix(Calendar): fall back to the default `placeholder` when spread props are reassigned and `placeholder` is not bound, preventing `Cannot read properties of undefined (reading 'set')`. Also applies to `RangeCalendar`, `DatePicker`, `DateRangePicker`, `DateRangeField`, `TimeField`, and `TimeRangeField`.
