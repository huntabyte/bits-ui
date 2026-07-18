---
"bits-ui": patch
---

fix(DismissibleLayer): cancel pending `afterSleep` timer on destroy to prevent `derived_inert` and stale document listeners (#2080)
