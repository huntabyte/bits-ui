export { default as Root } from "./components/tooltip.svelte";
export { default as Content } from "./components/tooltip-content.svelte";
export { default as Trigger } from "./components/tooltip-trigger.svelte";
export { default as Arrow } from "./components/tooltip-arrow.svelte";

export type {
	TooltipProps as Props,
	TooltipArrowProps as ArrowProps,
	TooltipContentProps as ContentProps,
	TooltipTriggerProps as TriggerProps,
	TooltipTriggerEvents as TriggerEvents,
	TooltipContentEvents as ContentEvents,
} from "./types.js";
