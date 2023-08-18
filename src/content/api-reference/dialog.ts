import type { APISchema } from "@/types";
import { asChild } from "./helpers";

export const root: APISchema = {
	title: "Root",
	description: "The root component used to set and manage the state of the dialog.",
	props: [
		{
			name: "preventScroll",
			default: "true",
			type: "boolean",
			description: "Whether or not to prevent scroll on the body when the dialog is open."
		},
		{
			name: "closeOnEscape",
			default: "true",
			type: "boolean",
			description: "Whether to close the dialog when the escape key is pressed."
		},
		{
			name: "closeOnOutsideClick",
			type: "boolean",
			default: "true",
			description: "Whether to close the dialog when a click occurs outside of it."
		},
		{
			name: "open",
			type: "boolean",
			default: "false",
			description: "Whether or not the dialog is open."
		},
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "A callback function called when the open state changes."
		}
	]
};

export const close: APISchema = {
	title: "Close",
	description: "A button used to close the dialog.",
	props: [asChild],
	dataAttributes: [
		{
			name: "melt-dialog-close",
			value: "",
			description: "Present on the close element."
		}
	]
};

export const content: APISchema = {
	title: "Cancel",
	description: "The content displayed within the dialog modal.",
	props: [asChild],
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The state of the dialog."
		},
		{
			name: "melt-dialog-content",
			value: "",
			description: "Present on the content element."
		}
	]
};

export const title: APISchema = {
	title: "Title",
	description: "An accessibile title for the dialog.",
	props: [asChild],
	dataAttributes: [
		{
			name: "melt-dialog-title",
			value: "",
			description: "Present on the title element."
		}
	]
};

export const description: APISchema = {
	title: "Description",
	description: "An accessibile description for the dialog.",
	props: [asChild],
	dataAttributes: [
		{
			name: "melt-dialog-description",
			value: "",
			description: "Present on the description element."
		}
	]
};

export const trigger: APISchema = {
	title: "Trigger",
	description: "The element which opens the dialog on press.",
	props: [asChild],
	dataAttributes: [
		{
			name: "melt-dialog-trigger",
			value: "",
			description: "Present on the trigger element."
		}
	]
};

export const overlay: APISchema = {
	title: "Overlay",
	description: "An overlay which covers the body when the dialog is open.",
	props: [asChild],
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The state of the dialog."
		},
		{
			name: "melt-dialog-overlay",
			value: "",
			description: "Present on the overlay element."
		}
	]
};

export const portal: APISchema = {
	title: "Portal",
	description: "A portal which renders the dialog into the body when it is open."
};

export const dialog = [root, trigger, content, overlay, portal, close, title, description];
