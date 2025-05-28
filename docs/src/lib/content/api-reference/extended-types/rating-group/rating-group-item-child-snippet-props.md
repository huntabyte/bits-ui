```ts
type RatingGroupItemState = "active" | "partial" | "inactive";

type RatingGroupItemChildSnippetProps = {
	state: RatingGroupItemState;
	props: Record<string, unknown>;
};
```
