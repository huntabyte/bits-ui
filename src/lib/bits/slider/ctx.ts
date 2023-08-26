import { getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { createSlider, type CreateSliderProps, type Slider as SliderReturn } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "Slider";
export const ctx = {
	set,
	get
};

type GetReturn = SliderReturn;

function set(props: CreateSliderProps) {
	const slider = createSlider(removeUndefined(props));
	setContext(NAME, slider);
	return {
		...slider,
		updateOption: getOptionUpdater(slider.options)
	};
}

function get() {
	return getContext<GetReturn>(NAME);
}
