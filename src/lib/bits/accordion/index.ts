export { default as Root } from "./components/accordion.svelte";
export { default as Item } from "./components/accordion-item.svelte";
export { default as Header } from "./components/accordion-header.svelte";
export { default as Trigger } from "./components/accordion-trigger.svelte";
export { default as Content } from "./components/accordion-content.svelte";

import type {
	AccordionRootProps,
	AccordionContentProps,
	AccordionHeaderProps,
	AccordionItemProps,
	AccordionTriggerProps,
} from "./types";

export type {
	AccordionRootProps as Props,
	AccordionContentProps as ContentProps,
	AccordionHeaderProps as HeaderProps,
	AccordionItemProps as ItemProps,
	AccordionTriggerProps as TriggerProps,
};
