---
"bits-ui": patch
---

Fix `user-select: none` being stranded on `<body>` after clicking inside `forceMount`ed content (Popover, Tooltip, Dialog, AlertDialog, Menu, Select), which left the whole page unselectable until a reload.
