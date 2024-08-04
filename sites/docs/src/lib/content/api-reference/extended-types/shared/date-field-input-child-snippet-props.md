```ts
import type { SegmentPart } from "bits-ui";

type ChildrenSnippetProps = {
	props: Record<string, unknown>;
	segments: Array<{ part: SegmentPart; value: string }>;
};
```
