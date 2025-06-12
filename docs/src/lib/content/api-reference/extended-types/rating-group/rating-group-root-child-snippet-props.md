```ts
type RatingGroupItemState = "active" | "partial" | "inactive"

type RatingGroupItemData = {
	index: number
	state: RatingGroupItemState
}

type ChildSnippetProps = {
	items: RatingGroupItemData[]
	value: number
	max: number
	props: Record<string, unknown>
}
```
