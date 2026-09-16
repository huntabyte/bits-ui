---
"bits-ui": patch
---

fix(Menu): the trigger's `aria-controls` links to the content when the menu starts open. The content registers its id by replacing a plain field on the menu state, which a trigger rendered before the content had already read as empty and never re-read; the registration is now reactive.
