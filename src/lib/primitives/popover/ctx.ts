import {
	createPopover,
	type CreatePopoverProps,
	type Popover as PopoverReturn
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { getOptionUpdater, removeUndefined } from "$internal/index.js";

const NAME = "Popover";

export const ctx = {
	set,
	get
};

function set(props: CreatePopoverProps) {
	const popover = createPopover({
		...removeUndefined(props),
		forceVisible: true
	});
	setContext(NAME, popover);
	return {
		...popover,
		updateOption: getOptionUpdater(popover.options)
	};
}

function get() {
	return getContext<PopoverReturn>(NAME);
}
