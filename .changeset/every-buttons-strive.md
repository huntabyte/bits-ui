---
"bits-ui": minor
---

feat(Slider): support discrete step values via `steps`: `number[] | number` on `Slider.Root`. If an array is passed, it defines the selectable values directly, and `min`/`max` default to the array's bounds.

