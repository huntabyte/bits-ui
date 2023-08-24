import { getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import {
	createLinkPreview,
	type CreateLinkPreviewProps,
	type LinkPreview as LinkPreviewReturn
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "hovercard";

export const ctx = {
	set,
	get,
	setArrow
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

function setArrow(size = 8) {
	const linkPreview = get();
	linkPreview.options.arrowSize.set(size);
	return linkPreview;
}
