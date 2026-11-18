```ts
type DrawerActions = {
  // Request a cancelable close with reason "imperative-action".
  close: () => void;
  // Finish a close deferred by preventUnmountOnClose().
  unmount: () => void;
};
```
