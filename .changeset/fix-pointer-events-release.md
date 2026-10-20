---
"bits-ui": patch
---

fix(body-scroll-lock): restore body `pointer-events` as soon as the last lock is released so clicks right after a layer closes aren't lost
