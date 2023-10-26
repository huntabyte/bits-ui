import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import {
	createLinkPreview,
	type CreateLinkPreviewProps,
	type LinkPreview as LinkPreviewReturn
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "link-preview";
const PARTS = ["arrow", "content", "trigger"];
const getAttrs = createBitAttrs(NAME, PARTS);

export const ctx = {
	set,
	get,
	getAttrs,
	setArrow
};

type GetReturn = LinkPreviewReturn;

function get() {
	return getContext<GetReturn>(NAME);
}

function set(props: CreateLinkPreviewProps) {
	const linkPreview = createLinkPreview({
		...removeUndefined(props),
		forceVisible: true
	});
	setContext(NAME, linkPreview);
	return {
		...linkPreview,
		updateOption: getOptionUpdater(linkPreview.options)
	};
}

function setArrow(size = 8) {
	const linkPreview = get();
	linkPreview.options.arrowSize.set(size);
	return linkPreview;
}
