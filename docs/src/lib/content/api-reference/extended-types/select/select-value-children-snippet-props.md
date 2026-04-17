```ts
type ChildrenSnippetProps = {
	selection:
		| {
				type: "single"
				selected?: { value: string; label: string }
				setValue: (value: string) => void
		  }
		| {
				type: "multiple"
				selected: { value: string; label: string }[]
				setValue: (value: string[]) => void
		  }
	placeholder: string | null
	disabled: boolean
}
```
