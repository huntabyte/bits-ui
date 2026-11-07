---
"bits-ui": patch
---

fix(TimeField, DateField): use the `ZonedDateTime` value's time zone, not the local one, when computing AM/PM
