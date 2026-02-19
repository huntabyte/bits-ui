---
"bits-ui": patch
---

fix(FloatingLayer): prevent floating content from visibly jumping to the viewport origin when its reference becomes hidden by ignoring detached/hidden-anchor position updates until close completes
