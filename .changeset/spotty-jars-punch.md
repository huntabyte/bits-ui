---
"bits-ui": patch
---

fix(TextSelectionLayer): don't read the `ref` box in `#pointerdown` before the enabled check, which emitted `derived_inert` on every document pointerdown when a leaked listener outlived its component
