export { default as Root } from "./components/link-preview.svelte";
export { default as Arrow } from "./components/link-preview-arrow.svelte";
export { default as Content } from "./components/link-preview-content.svelte";
export { default as Trigger } from "./components/link-preview-trigger.svelte";

export type {
	LinkPreviewProps as Props,
	LinkPreviewArrowProps as ArrowProps,
	LinkPreviewContentProps as ContentProps,
	LinkPreviewContentEvents as ContentEvents,
	LinkPreviewTriggerProps as TriggerProps,
	LinkPreviewTriggerEvents as TriggerEvents,
} from "./types.js";
