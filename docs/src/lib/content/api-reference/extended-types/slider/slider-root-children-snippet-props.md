```ts
type TickItem = {
	/** The value this tick represents */
	value: number
	/** The index of this tick */
	index: number
}

type ChildrenSnippetProps = {
	/** The items to iterate over and render */
	tickItems: TickItem[]
	/** The currently active thumb */
	thumbs: number[]
	/**
	 * An array of ticks to render
	 * @deprecated Use `tickItems` instead
	 */
	ticks: number[]
}
```
