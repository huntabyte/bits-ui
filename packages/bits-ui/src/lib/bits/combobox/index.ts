export { default as Root } from "./components/combobox.svelte";
export { default as Input } from "./components/combobox-input.svelte";
export { default as Separator } from "../separator/components/separator.svelte";
export { default as Arrow } from "$lib/bits/utilities/arrow/arrow.svelte";
export { default as Trigger } from "./components/combobox-trigger.svelte";
export { default as Portal } from "$lib/bits/utilities/portal/portal.svelte";

export {
	Content,
	Item,
	Group,
	GroupLabel,
	Viewport,
	ScrollDownButton,
	ScrollUpButton,
} from "$lib/bits/listbox/index.js";

export type {
	ComboboxRootProps as RootProps,
	ComboboxContentProps as ContentProps,
	ComboboxInputProps as InputProps,
	ComboboxItemProps as ItemProps,
	ComboboxGroupProps as GroupProps,
	ComboboxGroupLabelProps as GroupLabelProps,
	ComboboxPortalProps as PortalProps,
	ComboboxArrowProps as ArrowProps,
	ComboboxTriggerProps as TriggerProps,
	ComboboxScrollDownButtonProps as ScrollDownButtonProps,
	ComboboxScrollUpButtonProps as ScrollUpButtonProps,
	ComboboxViewportProps as ViewportProps,
} from "./types.js";
