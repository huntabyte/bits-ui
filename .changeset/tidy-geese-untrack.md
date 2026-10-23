---
"bits-ui": patch
---

fix: silence `state_referenced_locally` compiler warnings emitted in consumer builds by wrapping intentional initialization-time prop reads in `untrack`
