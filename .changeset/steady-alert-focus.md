---
"bits-ui": patch
---

Capture the original Alert Dialog content for delayed autofocus and skip it after removal, so pending focus work cannot focus replacement content or read a destroyed ref.
