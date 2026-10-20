---
"bits-ui": patch
---

fix(HiddenInput): keep hidden form inputs in sync with component state after a form reset. A native form reset now restores the current value instead of clearing the input, so setting a value right after `form.reset()` (e.g. SvelteKit `use:enhance`'s `update()`) is no longer lost. Applies to `RadioGroup`, `Select`, `Combobox`, `Checkbox`, `Switch`, `RatingGroup`, and the date/time fields (#1942)
