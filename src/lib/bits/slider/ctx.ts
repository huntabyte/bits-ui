import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { createSlider, type CreateSliderProps, type Slider as SliderReturn } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "slider";
const PARTS = ["root", "input", "range", "thumb"] as const;

const getAttrs = createBitAttrs(NAME, PARTS);

export const ctx = {
	set,
	get,
	getAttrs
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
