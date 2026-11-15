```ts
import type { Snippet } from "svelte";

type DrawerRootSnippetProps<Payload = never> = {
  triggerId: string | null;
  payload: [Payload] extends [never] ? null : Payload | null;
};

type Children<Payload = never> =
  | Snippet
  | Snippet<[DrawerRootSnippetProps<Payload>]>;
```
