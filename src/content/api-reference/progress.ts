import type { APISchema } from "@/types/index.js";
import { asChild } from "./helpers.js";

export const root: APISchema = {
	title: "Root",
	description: "The root component used to manage the state of the state of the popover.",
	props: [
		asChild,
		{
			name: "disableFocusTrap",
			type: "boolean",
			default: "false",
			description:
				"Whether or not to disable the focus trap that is applied to the popover when it's open."
		},
		{
			name: "preventScroll",
			type: "boolean",
			default: "false",
			description: "Whether or not to prevent scrolling the body while the popover is open."
		},
		{
			name: "positioning",
			type: "FloatingConfig",
			default: '{ position: "bottom", align: "center" }',
			description: "The positioning configuration for the popover. (docs coming soon)"
		},
		{
			name: "closeOnOutsideClick",
			type: "boolean",
			default: "true",
			description: "Whether or not to close the popover when clicking outside of it."
		},
		{
			name: "closeOnEscape",
			type: "boolean",
			default: "true",
			description: "Whether or not to close the popover when pressing the escape key."
		},
		{
			name: "open",
			type: "boolean",
			default: "false",
			description: "The open state of the link popover component."
		},
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "A callback that fires when the open state changes."
		}
	]
};
