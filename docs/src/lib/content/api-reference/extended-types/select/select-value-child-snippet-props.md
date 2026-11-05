```ts
type ChildSnippetProps = {
	props: Record<string, unknown>
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
