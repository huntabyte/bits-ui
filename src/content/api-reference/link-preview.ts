import type { APISchema } from "@/types";
import {
	arrowProps,
	asChild,
	enums,
	portalProp,
	transitionProps
} from "@/content/api-reference/helpers.js";
import type * as LinkPreview from "$lib/bits/link-preview/_types";
import * as C from "@/content/constants";
import { floatingConfigProp } from "./extended-types";

export const root: APISchema<LinkPreview.Props> = {
	title: "Root",
	description: "The root component used to manage the state of the state of the link preview.",
	props: {
		openDelay: {
			type: C.NUMBER,
			default: "700",
			description:
				"The amount of time in milliseconds to delay opening the preview when hovering over the trigger."
		},
		closeDelay: {
			type: C.NUMBER,
			default: "300",
			description:
				"The amount of time in milliseconds to delay closing the preview when the mouse leaves the trigger."
		},
		positioning: {
			type: floatingConfigProp,
			default: '{ position: "bottom", align: "center" }',
			description: "The positioning configuration for the preview. (docs coming soon)"
		},
		closeOnOutsideClick: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether or not to close the preview when clicking outside of it."
		},
		closeOnEscape: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether or not to close the preview when pressing the escape key."
		},
		open: {
			type: C.BOOLEAN,
			default: "false",
			description: "The open state of the link preview component."
		},
		onOpenChange: {
			type: {
				type: C.FUNCTION,
				definition: "(open: boolean) => void"
			},
			description: "A callback that fires when the open state changes."
		},
		portal: { ...portalProp("link preview") }
	}
};

export const trigger: APISchema<LinkPreview.TriggerProps> = {
	title: "Trigger",
	description:
		"A component which triggers the opening and closing of the link preview on hover or focus.",
	props: { asChild },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The open state of the link preview."
		},
		{
			name: "bits-link-preview-trigger",
			description: "Present on the trigger element."
		}
	]
};

export const content: APISchema<LinkPreview.ContentProps> = {
	title: "Content",
	description: "The contents of the link preview which are displayed when the preview is open.",
	props: { ...transitionProps, asChild },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The open state of the link preview."
		},
		{
			name: "bits-link-preview-content",
			description: "Present on the content element."
		}
	]
};

export const arrow: APISchema<LinkPreview.ArrowProps> = {
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the preview is open.",
	props: arrowProps,
	dataAttributes: [
		{
			name: "arrow",
			value: "",
			description: "Present on the arrow element."
		},
		{
			name: "bits-link-preview-arrow",
			description: "Present on the arrow element."
		}
	]
};

export const linkPreview = [root, trigger, content, arrow];
