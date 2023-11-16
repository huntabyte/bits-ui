import type { APISchema } from "@/types/index.js";
import { arrowProps, asChild } from "./helpers.js";
import type * as Popover from "$lib/bits/popover/_types";
import { focusProp } from "./extended-types/index.js";
import { portalProp } from "./helpers";

export const root: APISchema<Popover.Props> = {
	title: "Root",
	description: "The root component used to manage the state of the state of the popover.",
	props: {
		disableFocusTrap: {
			type: "boolean",
			default: "false",
			description:
				"Whether or not to disable the focus trap that is applied to the popover when it's open."
		},
		preventScroll: {
			type: "boolean",
			default: "false",
			description: "Whether or not to prevent scrolling the body while the popover is open."
		},
		positioning: {
			type: "FloatingConfig",
			default: '{ position: "bottom", align: "center" }',
			description: "The positioning configuration for the popover. (docs coming soon)"
		},
		closeOnOutsideClick: {
			type: "boolean",
			default: "true",
			description: "Whether or not to close the popover when clicking outside of it."
		},
		closeOnEscape: {
			type: "boolean",
			default: "true",
			description: "Whether or not to close the popover when pressing the escape key."
		},
		open: {
			type: "boolean",
			default: "false",
			description: "The open state of the link popover component."
		},
		onOpenChange: {
			type: "(open: boolean) => void",
			description: "A callback that fires when the open state changes."
		},
		openFocus: {
			type: focusProp,
			description: "Override the focus when the popover is opened."
		},
		closeFocus: {
			type: focusProp,
			description: "Override the focus when the popover is closed."
		},
		portal: { ...portalProp("popover") }
	}
};

export const trigger: APISchema = {
	title: "Trigger",
	description: "A component which toggles the opening and closing of the popover on press.",
	props: { asChild },
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The open state of the link preview."
		}
	]
};

export const content: APISchema = {
	title: "Content",
	description: "The contents of the popover which are displayed when the popover is open.",
	props: { asChild }
};

export const close: APISchema = {
	title: "Close",
	description:
		"A button which closes the popover when pressed and is typically placed in the content.",
	props: { asChild }
};

export const arrow: APISchema = {
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the popover is open.",
	props: arrowProps,
	dataAttributes: [
		{
			name: "arrow",
			value: "",
			description: "Present on the arrow element."
		}
	]
};

export const popover = [root, trigger, content, close, arrow];
