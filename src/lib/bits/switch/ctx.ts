import { createSwitch, type CreateSwitchProps, type Switch as SwitchReturn } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

const NAME = "Switch";
export const ctx = {
	set,
	get
};

type GetReturn = SwitchReturn;

function set(props: CreateSwitchProps) {
	const Switch = createSwitch(removeUndefined(props));
	setContext(NAME, Switch);
	return {
		...Switch,
		updateOption: getOptionUpdater(Switch.options)
	};
}

function get() {
	return getContext<GetReturn>(NAME);
}
