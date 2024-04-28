export { default as Root } from "./components/tooltip.svelte";
export { default as Content } from "./components/tooltip-content.svelte";
export { default as Trigger } from "./components/tooltip-trigger.svelte";
export { default as Arrow } from "./components/tooltip-arrow.svelte";
export { default as Provider } from "./components/tooltip-provider.svelte";

export type {
	TooltipProviderPropsWithoutHTML as ProviderProps,
	TooltipRootPropsWithoutHTML as RootProps,
	TooltipArrowProps as ArrowProps,
	TooltipContentProps as ContentProps,
	TooltipTriggerProps as TriggerProps,
} from "./types.js";
