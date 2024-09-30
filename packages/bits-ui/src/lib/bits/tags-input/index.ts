export { default as Root } from "./components/tags-input.svelte";
export { default as List } from "./components/tags-input-list.svelte";
export { default as Input } from "./components/tags-input-input.svelte";
export { default as Clear } from "./components/tags-input-clear.svelte";
export { default as Tag } from "./components/tags-input-tag.svelte";
export { default as TagContent } from "./components/tags-input-tag-content.svelte";
export { default as TagRemove } from "./components/tags-input-tag-remove.svelte";

export type {
	TagsInputRootProps as RootProps,
	TagsInputListProps as ListProps,
	TagsInputInputProps as InputProps,
	TagsInputClearProps as ClearProps,
	TagsInputTagProps as TagProps,
	TagsInputTagContentProps as TagContentProps,
	TagsInputTagRemoveProps as TagRemoveProps,
} from "./types.js";
