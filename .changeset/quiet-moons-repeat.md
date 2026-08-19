---
"bits-ui": patch
---

fix(Select): keep the user's scroll position when the scroll down button remounts. The button unmounts at the bottom of the list and remounts as soon as the viewport leaves it, and its mount effect realigned the viewport onto the highlighted item, so a small scroll up from the bottom jumped back to the highlighted item.
