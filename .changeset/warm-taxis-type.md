---
"bits-ui": patch
---

fix: issue where `RadioGroup` tabindex wasn't calculated before other focus logic kicks in, causing a value to be unintentionally overwritten
