import { createSwitch, type CreateSwitchProps, type Switch as SwitchReturn } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

const NAME = "switch";
const PARTS = ["root", "input", "thumb"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = SwitchReturn;

export function setCtx(props: CreateSwitchProps) {
	const Switch = createSwitch(removeUndefined(props));
	setContext(NAME, Switch);
	return {
		...Switch,
		updateOption: getOptionUpdater(Switch.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
