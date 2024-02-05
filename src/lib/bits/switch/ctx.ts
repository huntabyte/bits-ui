import { createSwitch, type CreateSwitchProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

function getSwitchData() {
	const NAME = "switch" as const;
	const PARTS = ["root", "input", "thumb"] as const;
	return {
		NAME,
		PARTS,
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: CreateSwitchProps) {
	const { NAME, PARTS } = getSwitchData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const Switch = { ...createSwitch(removeUndefined(props)), getAttrs };
	setContext(NAME, Switch);
	return {
		...Switch,
		updateOption: getOptionUpdater(Switch.options),
	};
}

export function getCtx() {
	const { NAME } = getSwitchData();
	return getContext<GetReturn>(NAME);
}
