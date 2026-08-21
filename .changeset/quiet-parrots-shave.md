---
"bits-ui": patch
---

fix(DismissibleLayer): outside clicks shortly after a layer opens no longer fail to dismiss it

`DismissibleLayerState` reset its per-interaction state through a 20ms debounce. Because the
layer's `watch` runs its cleanup once on every open, each layer scheduled a reset 20ms into its
own lifetime. An outside `pointerdown` landing 10-20ms after that cleanup had its
"responsible layer" flag cleared by the stale reset before the debounced interact-outside
handler ran, so the handler bailed and the layer stayed open. The reset is now synchronous.
