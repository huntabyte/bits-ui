export { default as Root } from "./components/popper.svelte";
export { default as Content } from "./components/popper-content.svelte";
export { default as Arrow } from "./components/popper-arrow.svelte";
export { default as Anchor } from "./components/popper-anchor.svelte";

export type {
	PopperContentProps as ContentProps,
	PopperArrowProps as ArrowProps,
	PopperAnchorProps as AnchorProps,
} from "./types.js";
