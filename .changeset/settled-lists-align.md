---
"bits-ui": patch
---

fix(Select, Combobox): keep aligning the highlighted item while the content settles after positioning. Chrome that mounts once the content is placed (scroll buttons in the flex flow, a header, a footer) shrinks the viewport under the open-time alignment and left a far-down selection below the fold; the content now realigns on every viewport resize until the user scrolls, which also retires the scroll down button's own mount-time realign.
