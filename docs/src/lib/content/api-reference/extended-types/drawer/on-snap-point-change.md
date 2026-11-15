```ts
type OnSnapPointChange = (
  snapPoint: number | string | null | undefined,
  details: DrawerChangeEventDetails
) => void;

type DrawerChangeReason =
  | "trigger-press"
  | "outside-press"
  | "escape-key"
  | "close-watcher"
  | "close-press"
  | "focus-out"
  | "imperative-action"
  | "swipe"
  | "none";

type DrawerChangeEventDetails = {
  reason: DrawerChangeReason;
  // The originating event, if this change came from user input.
  event: Event | undefined;
  // The associated trigger element, when available.
  trigger: HTMLElement | undefined;
  // Reject the requested change before the binding is updated.
  cancel: () => void;
  readonly isCanceled: boolean;
};
```
