import type { APISchema } from "@/types/index.js";
import type * as Popover from "$lib/bits/popover/_types.js";
import { focusProp } from "./extended-types/index.js";
import { floatingPositioning } from "./floating.js";
import {
	portalProp,
	transitionProps,
	arrowProps,
	asChild,
	enums
} from "@/content/api-reference/helpers.js";
import * as C from "@/content/constants.js";

export const root: APISchema<Popover.Props> = {
	title: "Root",
	description: "The root component used to manage the state of the state of the popover.",
	props: {
		disableFocusTrap: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description:
				"Whether or not to disable the focus trap that is applied to the popover when it's open."
		},
		preventScroll: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "Whether or not to prevent scrolling the body while the popover is open."
		},
		closeOnOutsideClick: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether or not to close the popover when clicking outside of it."
		},
		closeOnEscape: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether or not to close the popover when pressing the escape key."
		},
		open: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "The open state of the link popover component."
		},
		onOpenChange: {
			type: {
				type: C.FUNCTION,
				definition: "(open: boolean) => void"
			},
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

export const trigger: APISchema<Popover.TriggerProps> = {
	title: "Trigger",
	description: "A component which toggles the opening and closing of the popover on press.",
	props: { asChild },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The open state of the link preview."
		},
		{
			name: "b-popover-trigger",
			description: "Present on the trigger element."
		}
	]
};

export const content: APISchema<Popover.ContentProps> = {
	title: "Content",
	description: "The contents of the popover which are displayed when the popover is open.",
	props: { ...transitionProps, ...floatingPositioning, asChild },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The open state of the popover."
		},
		{
			name: "b-popover-content",
			description: "Present on the content element."
		}
	]
};

export const close: APISchema<Popover.CloseProps> = {
	title: "Close",
	description:
		"A button which closes the popover when pressed and is typically placed in the content.",
	props: { asChild },
	dataAttributes: [
		{
			name: "b-popover-close",
			description: "Present on the close button."
		}
	]
};

export const arrow: APISchema<Popover.ArrowProps> = {
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the popover is open.",
	props: arrowProps,
	dataAttributes: [
		{
			name: "arrow",
			value: "",
			description: "Present on the arrow element."
		},
		{
			name: "b-popover-arrow",
			description: "Present on the arrow element."
		}
	]
};

export const popover = [root, trigger, content, close, arrow];
