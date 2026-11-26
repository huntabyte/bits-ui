```ts
// Create with Drawer.createTether<Payload>().
class DrawerTether<Payload = unknown> {
  open(triggerId: string): void;
  openWithPayload(payload: Payload): void;
  close(): void;
  readonly isOpen: boolean;
  readonly payload: unknown;
  readonly triggerId: string | null;
}
```
