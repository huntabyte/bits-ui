export { default as Root } from "./components/listbox.svelte";
export { default as Content } from "./components/listbox-content.svelte";
export { default as Item } from "./components/listbox-item.svelte";
export { default as Group } from "./components/listbox-group.svelte";
export { default as GroupLabel } from "./components/listbox-group-label.svelte";
export { default as Label } from "./components/listbox-label.svelte";
export { default as Trigger } from "./components/listbox-trigger.svelte";
export { default as Portal } from "$lib/bits/utilities/portal/portal.svelte";

export type {
	ListboxRootProps as RootProps,
	ListboxContentProps as ContentProps,
	ListboxItemProps as ItemProps,
	ListboxGroupProps as GroupProps,
	ListboxGroupLabelProps as GroupLabelProps,
	ListboxTriggerProps as TriggerProps,
	// ListboxLabelProps as LabelProps,
} from "./types.js";
