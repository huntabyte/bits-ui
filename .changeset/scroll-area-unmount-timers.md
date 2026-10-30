---
"bits-ui": patch
---

fix(ScrollArea): cancel the pending scroll-end timers and stop the thumb's scroll loop on unmount, so `type="scroll"` no longer keeps detached instances alive after unmount
