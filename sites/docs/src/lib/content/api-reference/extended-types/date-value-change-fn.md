```ts
import type { DateValue } from "@internationalized/date";

// if `type` is `'single'`
type OnValueChange = (date: DateValue | undefined) => void

// if `type` is `'multiple'`
type OnValueChange = (date: DateValue[]) => void
```
