import Root from "./components/Slider.svelte";
import Range from "./components/SliderRange.svelte";
import Thumb from "./components/SliderThumb.svelte";
import Input from "./components/SliderInput.svelte";
import Tick from "./components/SliderTick.svelte";

export {
	Root,
	Range,
	Thumb,
	Input,
	Tick,
	//
	Root as Slider,
	Range as SliderRange,
	Thumb as SliderThumb,
	Input as SliderInput,
	Tick as SliderTick
};

export * from "./types.js";
