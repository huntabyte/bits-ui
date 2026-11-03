---
"bits-ui": patch
---

perf(ScrollArea): measure `type="auto"` overflow inside the resize observer report instead of the next animation frame, avoiding a forced synchronous layout
