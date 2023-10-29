import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { createSlider, type CreateSliderProps, type Slider as SliderReturn } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "slider";
const PARTS = ["root", "input", "range", "thumb", "tick"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = SliderReturn;

export function setCtx(props: CreateSliderProps) {
	const slider = createSlider(removeUndefined(props));
	setContext(NAME, slider);
	return {
		...slider,
		updateOption: getOptionUpdater(slider.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
