---
"bits-ui": patch
---

perf: avoid O(n) work per rendered item on hot paths

- `Select`/`Combobox`: item props now derive from per-item booleans, so moving the highlight or changing the value only rebuilds props (and re-diffs attributes) for the items that actually changed instead of every mounted item
- `Select`/`Combobox` (multiple): selection lookups use a set instead of scanning the value array once per item
- `Calendar`/`RangeCalendar`: `data-today` resolves the local timezone once per calendar rather than once per cell
- `Menu` family: the document-level `pointermove` listener is only attached while keyboard mode is active
- `ScrollArea`, `Slider`, `NavigationMenu`: internal resize observation shares a single `ResizeObserver` across all observed elements
