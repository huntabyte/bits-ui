---
"bits-ui": patch
---

fix(Slider): don't recompute thumb and tick positions on resize when `trackPadding` is set or `thumbPositioning` is `"exact"`, since those paths never measure the DOM
