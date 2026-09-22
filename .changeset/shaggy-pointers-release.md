---
"bits-ui": patch
---

Fix `user-select: none` being left on `<body>` when something else on the page calls `preventDefault()` on a `pointerup`, which made the whole page unselectable. The text-selection layer's release is internal cleanup and no longer skipped when the event's default action has been cancelled.
