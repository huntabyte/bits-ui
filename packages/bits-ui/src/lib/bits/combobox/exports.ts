export { default as Root } from "./components/combobox.svelte";
export { default as Input } from "./components/combobox-input.svelte";
export { default as Separator } from "../separator/components/separator.svelte";
export { default as Arrow } from "$lib/bits/utilities/arrow/arrow.svelte";
export { default as Trigger } from "./components/combobox-trigger.svelte";
export { default as Portal } from "$lib/bits/utilities/portal/portal.svelte";
export { default as Content } from "$lib/bits/listbox/components/listbox-content.svelte";
export { default as ContentStatic } from "$lib/bits/listbox/components/listbox-content-static.svelte";
export { default as Item } from "$lib/bits/listbox/components/listbox-item.svelte";
export { default as Group } from "$lib/bits/listbox/components/listbox-group.svelte";
export { default as GroupHeading } from "$lib/bits/listbox/components/listbox-group-heading.svelte";
export { default as Viewport } from "$lib/bits/listbox/components/listbox-viewport.svelte";
export { default as ScrollDownButton } from "$lib/bits/listbox/components/listbox-scroll-down-button.svelte";
export { default as ScrollUpButton } from "$lib/bits/listbox/components/listbox-scroll-up-button.svelte";

export type {
	ComboboxRootProps as RootProps,
	ComboboxContentProps as ContentProps,
	ComboboxContentStaticProps as ContentStaticProps,
	ComboboxInputProps as InputProps,
	ComboboxItemProps as ItemProps,
	ComboboxGroupProps as GroupProps,
	ComboboxGroupHeadingProps as GroupHeadingProps,
	ComboboxPortalProps as PortalProps,
	ComboboxArrowProps as ArrowProps,
	ComboboxTriggerProps as TriggerProps,
	ComboboxScrollDownButtonProps as ScrollDownButtonProps,
	ComboboxScrollUpButtonProps as ScrollUpButtonProps,
	ComboboxViewportProps as ViewportProps,
} from "./types.js";
