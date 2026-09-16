---
"bits-ui": patch
---

fix(Dialog, AlertDialog): pass `preventOverflowTextSelection` to the text selection layer explicitly instead of letting it ride the rest props onto the rendered content element as a `preventoverflowtextselection` attribute.
