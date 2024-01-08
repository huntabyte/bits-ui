import type { APISchema } from "@/types";
import { idsSlotProp } from "@/content/api-reference/helpers.js";
import { menu as m } from "./menu";
import type * as Menubar from "$lib/bits/menubar/_types";
import type * as Menu from "$lib/bits/menu/_types";
import * as C from "@/content/constants";
import { builderAndAttrsSlotProps, domElProps } from "./helpers";

export const root: APISchema<Menubar.Props> = {
	title: "Root",
	description: "The root menubar component which manages & scopes the state of the menubar.",
	props: {
		closeOnEscape: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description: "Whether to close the open menubar menu when the escape key is pressed."
		},
		loop: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description:
				"Whether or not to loop through the menubar menu triggers when navigating with the keyboard."
		},
		...domElProps("HTMLDivElement")
	},
	slotProps: { ...builderAndAttrsSlotProps, ids: idsSlotProp }
};

export const menu: APISchema<Menu.Props> = {
	title: "Menu",
	description: "A menu within the menubar.",
	...m.root
};

export const trigger: APISchema<Menu.TriggerProps> = {
	title: "Trigger",
	description: "The button element which toggles the dropdown menu.",
	...m.trigger
};

export const content: APISchema<Menu.ContentProps> = {
	title: "Content",
	description: "The content displayed when the dropdown menu is open.",
	...m.content
};

export const item: APISchema<Menu.ItemProps & { href: string }> = {
	title: "Item",
	description: "A menu item within the dropdown menu.",
	...m.item
};

export const separator: APISchema<Menu.SeparatorProps> = {
	title: "Separator",
	description: "A horizontal line to visually separate menu items.",
	...m.separator
};

export const arrow: APISchema<Menu.ArrowProps> = {
	title: "Arrow",
	description: "An optional arrow which points to the dropdown menu's anchor/trigger point.",
	...m.arrow
};

export const checkboxItem: APISchema<Menu.CheckboxItemProps> = {
	title: "CheckboxItem",
	description: "A menu item that can be controlled and toggled like a checkbox.",
	...m.checkboxItem
};

export const checkboxIndicator: APISchema<Menu.CheckboxIndicatorProps> = {
	title: "CheckboxIndicator",
	description:
		"A visual indicator of the checkbox menu item's checked state. It passed the item's checked state as a slot prop `checked` and can be used to render a custom indicator.",
	...m.checkboxIndicator
};

export const radioGroup: APISchema<Menu.RadioGroupProps> = {
	title: "RadioGroup",
	description: "A group of radio menu items, where only one can be checked at a time.",
	...m.radioGroup
};

export const radioItem: APISchema<Menu.RadioItemProps> = {
	title: "RadioItem",
	description:
		"A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.",
	...m.radioItem
};

export const radioIndicator: APISchema<Menu.RadioIndicatorProps> = {
	title: "RadioIndicator",
	description:
		"A visual indicator helper for `RadioItem`s. It only renders it's children when the radio item is checked.",
	...m.radioIndicator
};

export const sub: APISchema<Menu.SubProps> = {
	title: "Sub",
	description:
		"A submenu belonging to the parent dropdown menu. Responsible for managing the state of the submenu.",
	...m.sub
};

export const subTrigger: APISchema<Menu.SubTriggerProps> = {
	title: "SubTrigger",
	description: "A menu item which when pressed or hovered, opens the submenu.",
	...m.subTrigger
};

export const subContent: APISchema<Menu.SubContentProps> = {
	title: "SubContent",
	description: "The submenu content displayed when the parent submenu is open.",
	...m.subContent
};

export const group: APISchema<Menu.GroupProps> = {
	title: "Group",
	description:
		"A group of menu items. It can be used along with the `Menu.Label` component to provide a visual label for a group of menu items. When a label is within a group, appropriate aria attributes will be applied to the group.",
	...m.group
};

export const label: APISchema<Menu.LabelProps> = {
	title: "Label",
	description:
		"A label which will be skipped when navigating with the keyboard. It is used to provide a visual label for a group of menu items. When a label is within a `Menu.Group`, appropriate aria attributes will be applied to the group.",
	...m.label
};

export const menubar = [
	root,
	menu,
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
