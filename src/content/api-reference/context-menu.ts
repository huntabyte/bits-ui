import type { APISchema } from "@/types";
import { menu } from "./menu";
import type * as Menu from "$lib/bits/menu/_types";
import type * as ContextMenu from "$lib/bits/context-menu/_types";
import * as C from "@/content/constants.js";
import { transitionProps, asChild, union } from "./helpers";

export const root: APISchema<Menu.Props> = {
	title: "Root",
	description: "The root component which manages & scopes the state of the context menu.",
	...menu.root
};

export const trigger: APISchema<Menu.TriggerProps> = {
	title: "Trigger",
	description: "The element which when right-clicked, opens the context menu.",
	...menu.trigger
};

export const content: APISchema<ContextMenu.ContentProps> = {
	title: "Content",
	description: "The content displayed when the context menu is open.",
	props: {
		...transitionProps,
		asChild,
		alignOffset: {
			type: C.NUMBER,
			default: "0",
			description: "An offset in pixels from the 'start' or 'end' alignment options."
		},
		avoidCollisions: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description:
				"When `true`, overrides the `side` and `align` options to prevent collisions with the boundary edges."
		},
		collisionBoundary: {
			type: {
				type: C.UNION,
				definition: union("'clippingAncestors'", "Element", "Array<Element>", "Rect")
			},
			description: "A boundary element or array of elements to check for collisions against."
		},
		collisionPadding: {
			type: C.NUMBER,
			default: "0",
			description:
				"The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision."
		},
		fitViewport: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "Whether the floating element should be constrained to the viewport."
		}
	},
	dataAttributes: menu.content.dataAttributes
};

export const item: APISchema<Menu.ItemProps & { href: string }> = {
	title: "Item",
	description: "A menu item within the context menu.",
	...menu.item
};

export const separator: APISchema<Menu.SeparatorProps> = {
	title: "Separator",
	description: "A horizontal line to visually separate menu items.",
	...menu.separator
};

export const arrow: APISchema<Menu.ArrowProps> = {
	title: "Arrow",
	description: "An optional arrow which points to the context menu's anchor/trigger point.",
	...menu.arrow
};

export const checkboxItem: APISchema<Menu.CheckboxItemProps> = {
	title: "CheckboxItem",
	description: "A menu item that can be controlled and toggled like a checkbox.",
	...menu.checkboxItem
};

export const checkboxIndicator: APISchema<Menu.CheckboxItemIndicatorProps> = {
	title: "CheckboxIndicator",
	description:
		"A visual indicator of the checkbox menu item's checked state. It passes the item's checked state as a slot prop `checked` and can be used to render a custom indicator.",
	...menu.checkboxIndicator
};

export const radioGroup: APISchema<Menu.RadioGroupProps> = {
	title: "RadioGroup",
	description: "A group of radio menu items, where only one can be checked at a time.",
	...menu.radioGroup
};

export const radioItem: APISchema<Menu.RadioItemProps> = {
	title: "RadioItem",
	description:
		"A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.",
	...menu.radioItem
};

export const radioIndicator: APISchema = {
	title: "RadioIndicator",
	description:
		"A visual indicator helper for `RadioItem`s. It only renders it's children when the radio item is checked."
};

export const sub: APISchema<Menu.SubProps> = {
	title: "Sub",
	description:
		"A submenu belonging to the parent context menu. Responsible for managing the state of the submenu.",
	...menu.sub
};

export const subTrigger: APISchema<Menu.SubTriggerProps> = {
	title: "SubTrigger",
	description: "A menu item which when pressed or hovered, opens the submenu.",
	...menu.subTrigger
};

export const subContent: APISchema<Menu.SubContentProps> = {
	title: "SubContent",
	description: "The submenu content displayed when the parent submenu is open.",
	...menu.subContent
};

export const group: APISchema<Menu.GroupProps> = {
	title: "Group",
	description:
		"A group of menu items. It can be used along with the `Menu.Label` component to provide a visual label for a group of menu items. When a label is within a group, appropriate aria attributes will be applied to the group.",
	...menu.group
};

export const label: APISchema<Menu.LabelProps> = {
	title: "Label",
	description:
		"A label which will be skipped when navigating with the keyboard. It is used to provide a visual label for a group of menu items. When a label is within a `Menu.Group`, appropriate aria attributes will be applied to the group.",
	...menu.label
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
