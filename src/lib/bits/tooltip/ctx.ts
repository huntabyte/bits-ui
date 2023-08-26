import {
	createTooltip,
	type Tooltip as TooltipReturn,
	type CreateTooltipProps
} from "@melt-ui/svelte";
import { getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { getContext, setContext } from "svelte";

const NAME = "Tooltip";

export const ctx = {
	set,
	get,
	setArrow
};

type GetReturn = TooltipReturn;

function set(props: CreateTooltipProps) {
	const tooltip = createTooltip({
		positioning: {
			placement: "top"
		},
		openDelay: 700,
		...removeUndefined(props)
	});
	setContext(NAME, tooltip);
	return {
		...tooltip,
		updateOption: getOptionUpdater(tooltip.options)
	};
}

function get(sideOffset = 0) {
	const tooltip = getContext<GetReturn>(NAME);

	const {
		options: { positioning }
	} = tooltip;
	positioning.update((prev) => ({ ...prev, gutter: sideOffset }));

	return tooltip;
}

function setArrow(size = 8) {
	const tooltip = get();
	tooltip.options.arrowSize.set(size);
	return tooltip;
}
