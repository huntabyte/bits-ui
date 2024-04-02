import { type CreateSliderProps, createSlider } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

function getSliderData() {
	const NAME = "slider" as const;
	const PARTS = ["root", "input", "range", "thumb", "tick"] as const;

	return {
		NAME,
		PARTS,
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: CreateSliderProps) {
	const { NAME, PARTS } = getSliderData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const slider = { ...createSlider(removeUndefined(props)), getAttrs };
	setContext(NAME, slider);
	return {
		...slider,
		updateOption: getOptionUpdater(slider.options),
	};
}

export function getCtx() {
	const { NAME } = getSliderData();
	return getContext<GetReturn>(NAME);
}
