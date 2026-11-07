---
"bits-ui": minor
---

feat(Dialog/AlertDialog): add `preventBodyPointerEvents` to `Content`. Set it to `false` to let a rendered overlay block the page instead of setting `pointer-events: none` on `<body>`, which restyles every element on large pages
