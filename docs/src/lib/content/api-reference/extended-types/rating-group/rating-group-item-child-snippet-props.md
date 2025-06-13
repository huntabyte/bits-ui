```ts
type RatingGroupItemState = "active" | "partial" | "inactive"

type ChildSnippetProps = {
	state: RatingGroupItemState
	props: Record<string, unknown>
}
```
