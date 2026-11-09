---
"bits-ui": patch
---

perf: reduce rendering and interaction cost across components. Roving-focus groups (Radio Group, Toggle Group, Toolbar, Tabs, Accordion, Menubar) no longer rescan every item on each tab stop change, Select/Combobox highlight changes only update the affected items, Command caches item scores per search, and Tooltip, closed overlays, presence, menus, Slider ticks and date/time fields do less work per mount and update
