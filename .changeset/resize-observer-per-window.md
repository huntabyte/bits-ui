---
"bits-ui": patch
---

fix: observe element resizes with the element's own window's `ResizeObserver`, so components rendered into another window (an iframe or Document Picture-in-Picture) measure correctly, and don't measure mid-render when a second subscriber attaches to an already-observed element
