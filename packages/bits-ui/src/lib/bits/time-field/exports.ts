export { default as Root } from "./components/time-field.svelte";
export { default as Input } from "./components/time-field-input.svelte";
export { default as Label } from "./components/time-field-label.svelte";
export { default as Segment } from "./components/time-field-segment.svelte";

export type {
	TimeFieldRootProps as RootProps,
	TimeFieldInputProps as InputProps,
	TimeFieldLabelProps as LabelProps,
	TimeFieldSegmentProps as SegmentProps,
	// DateFieldDescriptionProps as DescriptionProps,
} from "./types.js";
