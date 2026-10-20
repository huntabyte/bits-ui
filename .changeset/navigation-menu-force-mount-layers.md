---
"bits-ui": patch
---

fix(NavigationMenu): only register a `NavigationMenu.Content`'s dismiss/escape layers while it is open so closed `forceMount` content no longer closes the open item on inside clicks or steals escape focus
