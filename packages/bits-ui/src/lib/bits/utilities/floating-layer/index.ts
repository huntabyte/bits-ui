export { default as Root } from "./components/floating-layer.svelte";
export { default as Content } from "./components/floating-layer-content.svelte";
export { default as Arrow } from "./components/floating-layer-arrow.svelte";
export { default as Anchor } from "./components/floating-layer-anchor.svelte";

export type {
	FloatingContentProps as ContentProps,
	FloatingArrowProps as ArrowProps,
	FloatingAnchorProps as AnchorProps,
} from "./types.js";
