---
"bits-ui": patch
---

fix(FocusScope): keep focus on elements inside an open shadow root nested in the scope (e.g. a web component's `<input>`) instead of treating it as escaping the trap
