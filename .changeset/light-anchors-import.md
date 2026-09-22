---
"bits-ui": patch
---

refactor: the context-menu attribute names and the floating root/anchor state move to leaf modules, so `DismissibleLayer` no longer imports the menu module for two strings, and `FloatingLayer` / `FloatingLayer.Anchor` no longer import the floating content module (and `@floating-ui/dom`) to register a root and its trigger. No behaviour change.
