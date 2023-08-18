import { getOptionUpdater, removeUndefined } from "$internal/index.js";
import {
	createLinkPreview,
	type CreateLinkPreviewProps,
	type LinkPreview as LinkPreviewReturn
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "hovercard";

export const ctx = {
	set,
	get
};

function get() {
	return getContext<LinkPreviewReturn>(NAME);
}

function set(props: CreateLinkPreviewProps) {
	const hovercard = createLinkPreview({
		...removeUndefined(props),
		forceVisible: true
	});
	setContext(NAME, hovercard);
	return {
		...hovercard,
		updateOption: getOptionUpdater(hovercard.options)
	};
}
