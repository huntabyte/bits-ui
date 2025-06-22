```ts
import type { TimeSegmentPart } from "bits-ui"

type ChildSnippetProps = {
	props: Record<string, unknown>
	segments: Array<{ part: TimeSegmentPart; value: string }>
}
```
