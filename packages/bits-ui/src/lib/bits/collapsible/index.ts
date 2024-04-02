export { default as Root } from "./components/collapsible.svelte";
export { default as Content } from "./components/collapsible-content.svelte";
export { default as Trigger } from "./components/collapsible-trigger.svelte";

export type {
	CollapsibleProps as Props,
	CollapsibleContentProps as ContentProps,
	CollapsibleTriggerProps as TriggerProps,
	CollapsibleTriggerEvents as TriggerEvents,
} from "./types.js";
