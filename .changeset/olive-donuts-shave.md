---
"bits-ui": patch
---

fix(PopperLayer): destructure the internal `forceMount` prop out of `restProps` so it stops leaking onto the rendered content element as an invalid `forcemount` attribute (Popover, Select, Combobox, DropdownMenu, ContextMenu, Menubar, Tooltip, LinkPreview)
