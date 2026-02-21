---
"bits-ui": patch
---

fix(TimeField): prevent mobile keyboard input from appending raw characters to the day period (AM/PM) segment by handling `beforeinput` events
