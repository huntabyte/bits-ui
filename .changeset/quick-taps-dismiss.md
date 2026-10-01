---
"bits-ui": patch
---

fix(DismissibleLayer): dismiss on a touch tap even when the tapped element stops click propagation. Touch outside-dismissal waits for the tap's `click` on the document, and a bubbling listener never hears a click whose target handler calls `stopPropagation()`, so the layer stayed open behind elements that own their clicks.
