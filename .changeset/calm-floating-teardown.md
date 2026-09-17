---
"bits-ui": patch
---

fix(Floating): ignore `autoUpdate` callbacks that fire after the floating element's effect is destroyed to avoid `derived_inert`
