```ts
type RatingGroupItemState = "active" | "partial" | "inactive"

type RatingGroupItemData = {
	index: number
	state: RatingGroupItemState
}

type ChildrenSnippetProps = {
	items: RatingGroupItemData[]
	value: number
	max: number
}
```
