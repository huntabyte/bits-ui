import type { APISchema } from "@/types";
import { asChild } from "./helpers";

export const root: APISchema = {
	title: "Root",
	description: "The root select component which manages & scopes the state of the select.",
	props: [
		{
			name: "disabled",
			default: "false",
			type: "boolean",
			description: "Whether or not the select menu is disabled."
		},
		{
			name: "multiple",
			default: "false",
			type: "boolean",
			description: "Whether or not the select menu allows multiple selections."
		},
		{
			name: "preventScroll",
			default: "true",
			type: "boolean",
			description: "Whether or not to prevent scrolling the body when the menu is open."
		},
		{
			name: "closeOnEscape",
			default: "true",
			type: "boolean",
			description: "Whether to close the select menu when the escape key is pressed."
		},
		{
			name: "closeOnOutsideClick",
			type: "boolean",
			default: "true",
			description: "Whether to close the select menu when a click occurs outside of it."
		},
		{
			name: "loop",
			type: "boolean",
			default: "false",
			description:
				"Whether or not to loop through the menu items when navigating with the keyboard."
		},
		{
			name: "open",
			type: "boolean",
			default: "false",
			description: "The open state of the select menu."
		},
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "A callback that is fired when the select menu's open state changes."
		},
		{
			name: "positioning",
			type: "FloatingConfig",
			description: "The positioning configuration for the select menu. (docs coming soon)"
		},
		{
			name: "value",
			type: "string",
			description: "The value of the currently selected item."
		},
		{
			name: "onValueChange",
			type: "(value: string | undefined) => void",
			description: "A callback that is fired when the select menu's value changes."
		},
		{
			name: "value",
			type: "string[]",
			description: "The values of the currently selected items, when `multiple` is `true`."
		},
		{
			name: "onValueChange",
			type: "(value: string[]) => void",
			description:
				"A callback that is fired when the select menu's values change, when `multiple` is `true`."
		}
	]
};

export const trigger: APISchema = {
	title: "Trigger",
	description: "The button element which toggles the select menu's open state.",
	props: [asChild],
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The dropdown menu's open state."
		},
		{
			name: "disabled",
			description: "Present when the trigger is disabled."
		}
	]
};

export const content: APISchema = {
	title: "Content",
	description: "The content/menu element which contains the select menu's items.",
	props: [asChild]
};

export const item: APISchema = {
	title: "Item",
	description: "A select item, which must be a child of the `Select.Content` component.",
	props: [
		asChild,
		{
			name: "label",
			type: "string",
			description: "The label of the select item, which is displayed in the menu."
		},
		{
			name: "value",
			type: "unknown",
			description: "The value of the select item."
		},
		{
			name: "disabled",
			type: "boolean",
			default: "false",
			description:
				"Whether or not the select item is disabled. This will prevent interaction/selection."
		}
	]
};

export const value: APISchema = {
	title: "Value",
	description:
		"A representation of the select menu's value, which is typically displayed in the trigger.",
	props: [
		asChild,
		{
			name: "placeholder",
			type: "string",
			description: "A placeholder value to display when no value is selected."
		}
	]
};

export const input: APISchema = {
	title: "Input",
	description:
		"A hidden input element which is used to store the select menu's value, used for form submission. It receives the same value as the `Select.Value` component and can receive any props that a normal input element can receive.",
	props: [asChild]
};

export const group: APISchema = {
	title: "Group",
	description: "An accessible group of select menu items.",
	props: [asChild]
};

export const label: APISchema = {
	title: "Label",
	description:
		"A label for the select menu which will be skipped when navigating with the keyboard. This must be a child of the `Select.Group` component to be accessible.",
	props: [asChild]
};

export const separator: APISchema = {
	title: "Separator",
	description: "A visual separator for use between select items or groups."
};

export const arrow: APISchema = {
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when open.",
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

export const select = [root, trigger, content, item, value, group, label, input, separator, arrow];
