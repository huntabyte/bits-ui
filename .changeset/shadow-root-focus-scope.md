---
"bits-ui": patch
---

fix(FocusScope): trap and restore focus inside a Shadow Root. Focus reads now follow `shadowRoot.activeElement` and the `focusin` target comes from `composedPath()`, so Tab wraps within the scope and focus returns to a trigger inside the root on close.
