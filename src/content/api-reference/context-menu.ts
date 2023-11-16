import type { APISchema } from "@/types";
import {
	asChild,
	menuContentProps,
	menuCheckboxItemProps,
	arrowProps,
	menuRadioGroupProps,
	menuRadioItemProps,
	menuItemProps,
	menuSubProps,
	menuSubTriggerProps,
	menuSubContentProps,
	menuProps
} from "./helpers";
import type * as ContextMenu from "$lib/bits/context-menu/_types";

export const root: APISchema<ContextMenu.Props> = {
	title: "Root",
	description: "The root component which manages & scopes the state of the context menu.",
	props: menuProps
};

export const trigger: APISchema<ContextMenu.TriggerProps> = {
	title: "Trigger",
	description: "The element which when right clicked inside, opens the context menu.",
	props: { asChild },
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The context menu's open state."
		}
	]
};

export const content: APISchema<ContextMenu.ContentProps> = {
	title: "Content",
	description: "The content displayed when the context menu is open.",
	props: menuContentProps,
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The collapsible's open state."
		}
	]
};

export const item: APISchema<ContextMenu.ItemProps & { href: string }> = {
	title: "Item",
	description: "A menu item within the context menu.",
	props: menuItemProps,
	dataAttributes: [
		{
			name: "orientation",
			value: "'horizontal' | 'vertical'",
			description: "The orientation of the context menu item."
		},
		{
			name: "highlighted",
			value: "''",
			description: "Present when the menu item is highlighted."
		}
	]
};

export const separator: APISchema<ContextMenu.SeparatorProps> = {
	title: "Separator",
	description: "A horizontal line to visually separate menu items.",
	props: {
		asChild
	}
};

export const arrow: APISchema<ContextMenu.ArrowProps> = {
	title: "Arrow",
	description: "An optional arrow which points to the context menu's anchor/trigger point.",
	props: arrowProps,
	dataAttributes: [
		{
			name: "arrow",
			value: "''",
			description: "Present on the arrow elements of the context menu."
		}
	]
};

export const checkboxItem: APISchema<ContextMenu.CheckboxItemProps> = {
	title: "CheckboxItem",
	description: "A menu item that can be controlled and toggled like a checkbox.",
	props: menuCheckboxItemProps,
	dataAttributes: [
		{
			name: "orientation",
			value: "'horizontal' | 'vertical'",
			description: "The orientation of the checkbox menu item."
		}
	]
};

export const checkboxIndicator: APISchema<ContextMenu.CheckboxItemIndicatorProps> = {
	title: "CheckboxIndicator",
	description:
		"A visual indicator of the checkbox menu item's checked state. It passed the item's checked state as a slot prop `checked` and can be used to render a custom indicator.",
	props: {
		asChild
	}
};

export const radioGroup: APISchema<ContextMenu.RadioGroupProps> = {
	title: "RadioGroup",
	description: "A group of radio menu items, where only one can be checked at a time.",
	props: menuRadioGroupProps
};

export const radioItem: APISchema<ContextMenu.RadioItemProps> = {
	title: "RadioItem",
	description:
		"A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.",
	props: menuRadioItemProps
};

export const radioIndicator: APISchema = {
	title: "RadioIndicator",
	description:
		"A visual indicator helper for `RadioItem`s. It only renders it's children when the radio item is checked."
};

export const sub: APISchema<ContextMenu.SubProps> = {
	title: "Sub",
	description:
		"A submenu belonging to the parent context menu. Responsible for managing the state of the submenu.",
	props: menuSubProps
};

export const subTrigger: APISchema<ContextMenu.SubTriggerProps> = {
	title: "SubTrigger",
	description: "A menu item which when pressed or hovered, opens the submenu.",
	props: menuSubTriggerProps,
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

export const subContent: APISchema<ContextMenu.SubContentProps> = {
	title: "SubContent",
	description: "The submenu content displayed when the parent submenu is open.",
	props: menuSubContentProps,
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The submenu's open state."
		}
	]
};

export const group: APISchema<ContextMenu.GroupProps> = {
	title: "Group",
	description:
		"A group of menu items. It can be used along with the `ContextMenu.Label` component to provide a visual label for a group of menu items. When a label is within a group, appropriate aria attributes will be applied to the group.",
	props: {
		asChild
	}
};

export const label: APISchema<ContextMenu.LabelProps> = {
	title: "Label",
	description:
		"A label which will be skipped when navigating with the keyboard. It is used to provide a visual label for a group of menu items. When a label is within a `ContextMenu.Group`, appropriate aria attributes will be applied to the group.",
	props: {
		asChild
	}
};

export const contextMenu = [
	root,
	trigger,
	content,
	item,
	checkboxItem,
	checkboxIndicator,
	radioGroup,
	radioItem,
	radioIndicator,
	separator,
	arrow,
	group,
	label,
	sub,
	subTrigger,
	subContent
];
