---
"bits-ui": patch
---

fix: only call onCloseAutoFocus handler if defined

If popovers or other elements have been removed from the DOM, then
onCloseAutoFocus.current may be undefined.
