import { type CreateLinkPreviewProps, createLinkPreview } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import type { Writable } from "svelte/store";
import { getPositioningUpdater } from "../floating/helpers.js";
import type { FloatingProps } from "../floating/_types.js";
import type { FloatingConfig } from "../floating/floating-config.js";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

export function getLinkPreviewData() {
	const NAME = "link-preview" as const;
	const PARTS = ["arrow", "content", "trigger"];

	return {
		NAME,
		PARTS,
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: CreateLinkPreviewProps) {
	const { NAME, PARTS } = getLinkPreviewData();
	const getAttrs = createBitAttrs(NAME, PARTS);

	const linkPreview = {
		...createLinkPreview({
			...removeUndefined(props),
			forceVisible: true,
		}),
		getAttrs,
	};

	setContext(NAME, linkPreview);
	return {
		...linkPreview,
		updateOption: getOptionUpdater(linkPreview.options),
	};
}

export function getCtx() {
	const { NAME } = getLinkPreviewData();
	return getContext<GetReturn>(NAME);
}

export function setArrow(size = 8) {
	const linkPreview = getCtx();
	linkPreview.options.arrowSize.set(size);
	return linkPreview;
}

export function updatePositioning(props: FloatingProps) {
	const defaultPlacement = {
		side: "bottom",
		align: "center",
	} satisfies FloatingProps;

	const withDefaults = { ...defaultPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning },
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}
