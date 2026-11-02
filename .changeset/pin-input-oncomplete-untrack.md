---
"bits-ui": patch
---

fix(PinInput): run `onComplete` untracked so a callback that reads and writes state no longer loops with `effect_update_depth_exceeded`
