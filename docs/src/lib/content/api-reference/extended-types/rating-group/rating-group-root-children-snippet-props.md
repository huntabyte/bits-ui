```ts
type RatingGroupItemState = "active" | "partial" | "inactive";

type RatingGroupItemData = {
	index: number;
	state: RatingGroupItemState;
};

type RatingGroupRootChildrenSnippetProps = {
	items: RatingGroupItemData[];
	value: number;
	max: number;
};
```
