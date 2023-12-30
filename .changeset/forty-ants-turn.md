---
"bits-ui": minor
---

- Forward pointerdown pointerup & pointermove events for AlertDialog.Content and Dialog.Content
- Update Melt UI and add onOutsideClick prop to components that handle outside clicks. You can override the default behavior of closing the component by calling event.preventDefault() within that handler.
- Added RTL support for the Slider via the dir prop which can be set to "ltr" | "rtl" defaulting to "ltr"
