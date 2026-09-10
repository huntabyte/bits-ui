---
"bits-ui": patch
---

fix: restore the body style through the CSSOM when the last scroll lock is released, so a Content-Security-Policy without `style-src 'unsafe-inline'` no longer leaves the page unscrollable and unclickable after closing a Dialog / Menu / Popover
