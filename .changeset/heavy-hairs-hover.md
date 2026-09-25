---
"bits-ui": minor
---

breaking(Command): rename `Command.Item`'s transient `data-selected` attribute to `data-highlighted` to prevent Chromium `:has([data-selected])` invalidation collisions with Calendar/Select persistent selection (#2044) — migrate `[data-selected]`/`data-selected:` styles on Command items to `data-highlighted`; `aria-selected` is unchanged
