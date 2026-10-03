---
"bits-ui": patch
---

fix(DismissibleLayer): dismiss on a touch tap whose `click` follows its `pointerdown` within a few milliseconds. The click listener was armed only after a 10ms debounce, so on WebKit (mobile Safari) a quick tap on a sibling trigger landed before it and left the open layer open beside the new one.
