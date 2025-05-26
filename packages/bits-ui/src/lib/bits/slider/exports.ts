export { default as Root } from "./components/slider.svelte";
export { default as Range } from "./components/slider-range.svelte";
export { default as Thumb } from "./components/slider-thumb.svelte";
export { default as Tick } from "./components/slider-tick.svelte";
export { default as TickLabel } from "./components/slider-tick-label.svelte";

export type {
	SliderRootProps as RootProps,
	SliderRangeProps as RangeProps,
	SliderThumbProps as ThumbProps,
	SliderTickProps as TickProps,
	SliderTickLabelProps as TickLabelProps,
} from "./types.js";
