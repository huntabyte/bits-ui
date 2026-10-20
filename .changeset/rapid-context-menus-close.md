---
"bits-ui": patch
---

fix(DismissibleLayer): close an open layer when a second outside `pointerdown` lands within its 10ms dismissal debounce. The second event replaced the pending one and was judged against the newly opened layer, so rapidly right clicking across `ContextMenu` triggers left earlier menus open.
