import type { APISchema } from "@/types";
import { asChild } from "./helpers";

export const root: APISchema = {
	title: "Root",
	description: "The root menubar component which manages & scopes the state of the menubar.",
	props: [
		{
			name: "closeOnEscape",
			default: "true",
			type: "boolean",
			description: "Whether to close the open menubar menu when the escape key is pressed."
		},
		{
			name: "loop",
			default: "true",
			type: "boolean",
			description:
				"Whether or not to loop through the menubar menu triggers when navigating with the keyboard."
		}
	]
};

export const menu: APISchema = {
	title: "Menu",
	description: "A menu within the menubar.",
	props: [
		{
			name: "preventScroll",
			default: "true",
			type: "boolean",
			description: "Whether or not to prevent scroll on the body when the menu is open."
		},
		{
			name: "closeOnEscape",
			default: "true",
			type: "boolean",
			description: "Whether to close the menu when the escape key is pressed."
		},
		{
			name: "closeOnOutsideClick",
			type: "boolean",
			default: "true",
			description: "Whether to close the menu when a click occurs outside of it."
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
			description: "The open state of the menu."
		},
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "A callback that is fired when the menu's open state changes."
		},
		{
			name: "positioning",
			type: "FloatingConfig",
			description: "The positioning configuration for the menu. (docs coming soon)"
		}
	]
};

export const trigger: APISchema = {
	title: "Trigger",
	description: "The button element which toggles the menu.",
	props: [asChild],
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The menu's open state."
		}
	]
};

export const content: APISchema = {
	title: "Content",
	description: "The content displayed when the menu is open.",
	props: [
		asChild,
		{
			name: "transition",
			type: "(node: Element, params?: any) => TransitionConfig",
			description: "A Svelte transition function to use when transitioning the content in and out. "
		},
		{
			name: "transitionConfig",
			type: "TransitionConfig",
			description: "The Svelte `TransitionConfig` object to apply to the transition."
		}
	],
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The collapsible's open state."
		}
	]
};

export const item: APISchema = {
	title: "Item",
	description: "A menu item within the menu.",
	props: [
		asChild,
		{
			name: "disabled",
			type: "boolean",
			default: "false",
			description: "Whether or not the menu item is disabled."
		}
	],
	dataAttributes: [
		{
			name: "orientation",
			value: "'horizontal' | 'vertical'",
			description: "The orientation of the menu item."
		},
		{
			name: "highlighted",
			value: "''",
			description: "Present when the menu item is highlighted."
		}
	]
};

export const separator: APISchema = {
	title: "Separator",
	description: "A horizontal line to visually separate menu items."
};

export const arrow: APISchema = {
	title: "Arrow",
	description: "An optional arrow which points to the menu's anchor/trigger point.",
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
			value: "''",
			description: "Present on the arrow elements of the menu."
		}
	]
};

export const checkboxItem: APISchema = {
	title: "CheckboxItem",
	description: "A menu item that can be controlled and toggled like a checkbox.",
	props: [
		asChild,
		{
			name: "disabled",
			type: "boolean",
			default: "false",
			description:
				"Whether or not the checkbox menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard."
		},
		{
			name: "checked",
			default: "false",
			type: "boolean | 'indeterminate'",
			description: "The checkbox menu item's checked state."
		},
		{
			name: "onCheckedChange",
			type: "(checked: boolean | 'indeterminate') => void",
			description: "A callback that is fired when the checkbox menu item's checked state changes."
		}
	],
	dataAttributes: [
		{
			name: "orientation",
			value: "'horizontal' | 'vertical'",
			description: "The orientation of the checkbox menu item."
		}
	]
};

export const checkboxIndicator: APISchema = {
	title: "CheckboxIndicator",
	description:
		"A visual indicator of the checkbox menu item's checked state. It passed the item's checked state as a slot prop `checked` and can be used to render a custom indicator."
};

export const radioGroup: APISchema = {
	title: "RadioGroup",
	description: "A group of radio menu items, where only one can be checked at a time.",
	props: [
		asChild,
		{
			name: "value",
			type: "string",
			description: "The value of the currently checked radio menu item."
		},
		{
			name: "onValueChange",
			type: "(value: string) => void",
			description: "A callback that is fired when the radio group's value changes."
		}
	]
};

export const radioItem: APISchema = {
	title: "RadioItem",
	description:
		"A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.",
	props: [
		asChild,
		{
			name: "value",
			type: "string",
			description:
				"The value of the radio item. When checked, the parent `RadioGroup`'s value will be set to this value."
		},
		{
			name: "disabled",
			type: "false",
			description:
				"Whether or not the radio menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard."
		}
	]
};

export const radioIndicator: APISchema = {
	title: "RadioIndicator",
	description:
		"A visual indicator helper for `RadioItem`s. It only renders it's children when the radio item is checked."
};

export const sub: APISchema = {
	title: "Sub",
	description:
		"A submenu belonging to the parent menu. Responsible for managing the state of the submenu.",
	props: [
		{
			name: "disabled",
			type: "boolean",
			description: "Whether or not the submenu is disabled."
		},
		{
			name: "arrowSize",
			type: "number",
			default: "8",
			description: "The size of the optional submenu arrow component in pixels."
		},
		{
			name: "positioning",
			type: "FloatingConfig",
			description: "The positioning configuration for the menu. (docs coming soon)"
		}
	]
};

export const subTrigger: APISchema = {
	title: "SubTrigger",
	description: "A menu item which when pressed or hovered, opens the submenu.",
	props: [
		{
			name: "disabled",
			type: "boolean",
			default: "false",
			description: "Whether or not the submenu trigger is disabled."
		}
	],
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The submenu's open state."
		},
		{
			name: "disabled",
			value: "''",
			description: "Present when the submenu trigger is disabled."
		}
	]
};

export const subContent: APISchema = {
	title: "SubContent",
	description: "The submenu content displayed when the parent submenu is open.",
	props: [
		asChild,
		{
			name: "transition",
			type: "(node: Element, params?: any) => TransitionConfig",
			description: "A Svelte transition function to use when transitioning the content in and out. "
		},
		{
			name: "transitionConfig",
			type: "TransitionConfig",
			description: "The Svelte `TransitionConfig` object to apply to the transition."
		}
	],
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The submenu's open state."
		}
	]
};

export const group: APISchema = {
	title: "Group",
	description:
		"A group of menu items. It can be used along with the `DropdownMenu.Label` component to provide a visual label for a group of menu items. When a label is within a group, appropriate aria attributes will be applied to the group."
};

export const label: APISchema = {
	title: "Label",
	description:
		"A label which will be skipped when navigating with the keyboard. It is used to provide a visual label for a group of menu items. When a label is within a `DropdownMenu.Group`, appropriate aria attributes will be applied to the group."
};
