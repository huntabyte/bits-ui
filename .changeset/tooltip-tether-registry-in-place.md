---
"bits-ui": patch
---

perf(Tooltip): register and unregister tether triggers in O(1) instead of copying the registry on every write, so mounting many triggers on one tether is no longer quadratic
