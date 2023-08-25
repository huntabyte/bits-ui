import {
	createPopover,
	type CreatePopoverProps,
	type Popover as PopoverReturn
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

const NAME = "Popover";

export const ctx = {
	set,
	get,
	setArrow
};

type GetReturn = PopoverReturn;

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
	return getContext<GetReturn>(NAME);
}

function setArrow(size = 8) {
	const popover = get();
	popover.options.arrowSize.set(size);
	return popover;
}
