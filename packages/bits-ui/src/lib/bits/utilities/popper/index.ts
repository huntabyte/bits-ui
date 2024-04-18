export { default as Root } from "./components/floating.svelte";
export { default as Content } from "./components/floating-content.svelte";
export { default as Arrow } from "./components/floating-arrow.svelte";
export { default as Anchor } from "./components/floating-anchor.svelte";

export type {
	FloatingContentProps as ContentProps,
	FloatingArrowProps as ArrowProps,
	FloatingAnchorProps as AnchorProps,
} from "./types.js";
