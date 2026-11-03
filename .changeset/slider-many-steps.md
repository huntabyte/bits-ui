---
"bits-ui": patch
---

fix(Slider): measure the thumb scale once per update instead of once per step, and compute ticks only when a snippet reads them, so sliders with many steps stay fast (#1623)
