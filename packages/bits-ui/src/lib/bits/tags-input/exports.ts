export { default as Root } from "./components/tags-input.svelte";
export { default as List } from "./components/tags-input-list.svelte";
export { default as Input } from "./components/tags-input-input.svelte";
export { default as Clear } from "./components/tags-input-clear.svelte";
export { default as Tag } from "./components/tags-input-tag.svelte";
export { default as TagText } from "./components/tags-input-tag-text.svelte";
export { default as TagRemove } from "./components/tags-input-tag-remove.svelte";
export { default as TagEditInput } from "./components/tags-input-tag-edit-input.svelte";
export { default as TagEdit } from "./components/tags-input-tag-edit.svelte";
export { default as TagContent } from "./components/tags-input-tag-content.svelte";

export type {
	TagsInputRootProps as RootProps,
	TagsInputListProps as ListProps,
	TagsInputInputProps as InputProps,
	TagsInputClearProps as ClearProps,
	TagsInputTagProps as TagProps,
	TagsInputTagTextProps as TagTextProps,
	TagsInputTagRemoveProps as TagRemoveProps,
	TagsInputTagEditInputProps as TagEditInputProps,
	TagsInputTagEditProps as TagEditProps,
	TagsInputTagContentProps as TagContentProps,
} from "./types.js";
