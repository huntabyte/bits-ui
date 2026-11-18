---
"bits-ui": major
---

feat(Combobox): add `autoHighlight` prop

Align automatic highlighting with Base UI's public boolean contract. Comboboxes no longer highlight the first item on trigger open without a selection or automatically highlight filtered results by default. Add `autoHighlight={true}` to highlight the first enabled match after typing, including asynchronous results. Selected items and arrow-key navigation remain highlighted independently of this prop.
