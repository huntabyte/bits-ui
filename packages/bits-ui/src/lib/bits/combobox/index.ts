export { default as Root } from "./components/combobox.svelte";
export { default as Content } from "./components/combobox-content.svelte";
export { default as Input } from "./components/combobox-input.svelte";
export { default as Item } from "./components/combobox-item.svelte";
export { default as Group } from "./components/combobox-group.svelte";
export { default as GroupLabel } from "./components/combobox-group-label.svelte";
export { default as HiddenInput } from "./components/combobox-hidden-input.svelte";
export { default as Separator } from "../separator/components/separator.svelte";
export { default as Arrow } from "$lib/bits/utilities/arrow/arrow.svelte";
export { default as Trigger } from "./components/combobox-trigger.svelte";
export { default as Portal } from "$lib/bits/utilities/portal/portal.svelte";

export type {
	ComboboxRootProps as RootProps,
	ComboboxContentProps as ContentProps,
	ComboboxInputProps as InputProps,
	ComboboxItemProps as ItemProps,
	ComboboxGroupProps as GroupProps,
	ComboboxGroupLabelProps as GroupLabelProps,
	ComboboxSeparatorProps as SeparatorProps,
	ComboboxPortalProps as PortalProps,
	ComboboxArrowProps as ArrowProps,
	ComboboxTriggerProps as TriggerProps,
} from "./types.js";
