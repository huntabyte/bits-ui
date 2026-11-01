---
"bits-ui": patch
---

fix(Menu): only extend the submenu safe area while the pointer moves closer to the submenu. A sibling sub trigger now takes over 100ms after the pointer stops making progress, instead of 500ms after its last move.
