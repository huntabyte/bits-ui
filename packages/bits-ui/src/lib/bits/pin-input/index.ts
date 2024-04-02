export { default as Root } from "./components/pin-input.svelte";
export { default as Input } from "./components/pin-input-input.svelte";
export { default as HiddenInput } from "./components/pin-input-hidden-input.svelte";

export type {
	PinInputProps as Props,
	PinInputInputProps as InputProps,
	PinInputHiddenInputProps as HiddenInputProps,
	PinInputInputEvents as InputEvents,
} from "./types.js";
