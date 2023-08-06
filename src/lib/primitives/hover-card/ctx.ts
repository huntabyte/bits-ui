import { getOptionUpdater, removeUndefined } from "$internal/index.js";
import {
	createHoverCard,
	type CreateHoverCardProps,
	type HoverCard as HoverCardReturn
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "hovercard";

export const ctx = {
	set,
	get,
	getContent,
	getTrigger: () => get().elements.trigger
};

function getContent() {
	const {
		elements: { content },
		states: { open }
	} = get();
	return {
		content,
		open
	};
}

function get() {
	return getContext<HoverCardReturn>(NAME);
}

function set(props: CreateHoverCardProps) {
	const hovercard = createHoverCard({
		...removeUndefined(props),
		forceVisible: true
	});
	setContext(NAME, hovercard);
	return {
		...hovercard,
		updateOption: getOptionUpdater(hovercard.options)
	};
}
