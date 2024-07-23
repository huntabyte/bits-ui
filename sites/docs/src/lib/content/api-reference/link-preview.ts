import type {
	LinkPreviewArrowPropsWithoutHTML,
	LinkPreviewContentPropsWithoutHTML,
	LinkPreviewRootPropsWithoutHTML,
	LinkPreviewTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	arrowProps,
	builderAndAttrsSlotProps,
	childrenSnippet,
	dirProp,
	dismissableLayerProps,
	enums,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	idsSlotProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<LinkPreviewRootPropsWithoutHTML> = {
	title: "Root",
	description: "The root component used to manage the state of the state of the link preview.",
	props: {
		openDelay: {
			type: C.NUMBER,
			default: "700",
			description:
				"The amount of time in milliseconds to delay opening the preview when hovering over the trigger.",
		},
		closeDelay: {
			type: C.NUMBER,
			default: "300",
			description:
				"The amount of time in milliseconds to delay closing the preview when the mouse leaves the trigger.",
		},
		open: {
			type: C.BOOLEAN,
			default: "false",
			description: "The open state of the link preview component.",
		},
		onOpenChange: {
			type: {
				type: C.FUNCTION,
				definition: "(open: boolean) => void",
			},
			description: "A callback that fires when the open state changes.",
		},
		disabled: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "Whether or not the link preview is disabled.",
		},
		ignoreNonKeyboardFocus: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "Whether the link preview should ignore non-keyboard focus.",
		},
		children: childrenSnippet(),
	},
	slotProps: {
		ids: idsSlotProp,
	},
};

export const trigger: APISchema<LinkPreviewTriggerPropsWithoutHTML> = {
	title: "Trigger",
	description:
		"A component which triggers the opening and closing of the link preview on hover or focus.",
	props: withChildProps({ elType: "HTMLAnchorElement" }),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The open state of the link preview.",
			isEnum: true,
		},
		{
			name: "link-preview-trigger",
			description: "Present on the trigger element.",
		},
	],
};

export const content: APISchema<LinkPreviewContentPropsWithoutHTML> = {
	title: "Content",
	description: "The contents of the link preview which are displayed when the preview is open.",
	props: {
		...floatingProps(),
		...dismissableLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		dir: dirProp,
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The open state of the link preview.",
			isEnum: true,
		},
		{
			name: "link-preview-content",
			description: "Present on the content element.",
		},
	],
};

export const arrow: APISchema<LinkPreviewArrowPropsWithoutHTML> = {
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the preview is open.",
	props: arrowProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "arrow",
			description: "Present on the arrow element.",
		},
		{
			name: "link-preview-arrow",
			description: "Present on the arrow element.",
		},
	],
};

export const linkPreview = [root, trigger, content, arrow];
