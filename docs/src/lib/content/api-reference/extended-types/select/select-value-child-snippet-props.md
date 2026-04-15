```ts
type SelectValueSnippetProps =
	| {
			type: "single";
			placeholder?: string | null;
			selected?: { value: string; label: string };
			setValue: (value: string) => void;
	  }
	| {
			type: "multiple";
			placeholder?: string | null;
			selected?: { value: string; label: string }[];
			setValue: (value: string[]) => void;
	  };
```
