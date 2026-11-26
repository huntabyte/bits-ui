```ts
type DrawerInteractionType = "mouse" | "touch" | "pen" | "keyboard";

type DrawerFocusTarget =
  | boolean
  | HTMLElement
  | null
  | ((
      interactionType: DrawerInteractionType
    ) => boolean | HTMLElement | null | void);
```
