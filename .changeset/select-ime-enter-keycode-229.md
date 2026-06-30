---
"bits-ui": patch
---

fix(Select): don't commit the highlighted item on an IME composition-commit Enter in Safari (`keyCode === 229`), matching the guard already used in Command. This also fixes Combobox, which shares the same input keydown handler.
