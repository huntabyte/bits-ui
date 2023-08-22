import type { APISchema } from "@/types";
import { asChild } from "./helpers";

export const root: APISchema = {
	title: "Root",
	description: "The root component used to manage the state of the state of the link preview.",
	props: [
		asChild,
		{
			name: "openDelay",
			type: "number",
			default: "700",
			description:
				"The amount of time in milliseconds to delay opening the preview when hovering over the trigger."
		},
		{
			name: "closeDelay",
			type: "number",
			default: "300",
			description:
				"The amount of time in milliseconds to delay closing the preview when the mouse leaves the trigger."
		},
		{
			name: "positioning",
			type: "FloatingConfig",
			default: '{ position: "bottom", align: "center" }',
			description: "The positioning configuration for the preview. (docs coming soon)"
		},
		{
			name: "closeOnOutsideClick",
			type: "boolean",
			default: "true",
			description: "Whether or not to close the preview when clicking outside of it."
		},
		{
			name: "closeOnEscape",
			type: "boolean",
			default: "true",
			description: "Whether or not to close the preview when pressing the escape key."
		},
		{
			name: "open",
			type: "boolean",
			default: "false",
			description: "The open state of the link preview component."
		},
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "A callback that fires when the open state changes."
		}
	]
};

export const trigger: APISchema = {
	title: "Trigger",
	description:
		"A component which triggers the opening and closing of the link preview on hover or focus.",
	props: [asChild],
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
	description: "The contents of the link preview which are displayed when the preview is open.",
	props: [asChild],
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The open state of the link preview."
		}
	]
};

export const arrow: APISchema = {
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the preview is open.",
	props: [
		asChild,
		{
			name: "size",
			type: "number",
			default: "8",
			description: "The height and width of the arrow in pixels."
		}
	],
	dataAttributes: [
		{
			name: "arrow",
			value: "",
			description: "Present on the arrow element."
		}
	]
};

export const linkPreview = [root, trigger, content, arrow];
