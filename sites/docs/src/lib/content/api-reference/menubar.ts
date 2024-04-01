import type {
	MenubarArrowPropsWithoutHTML,
	MenubarCheckboxIndicatorPropsWithoutHTML,
	MenubarCheckboxItemPropsWithoutHTML,
	MenubarContentPropsWithoutHTML,
	MenubarGroupPropsWithoutHTML,
	MenubarItemPropsWithoutHTML,
	MenubarLabelPropsWithoutHTML,
	MenubarMenuPropsWithoutHTML,
	MenubarPropsWithoutHTML,
	MenubarRadioGroupPropsWithoutHTML,
	MenubarRadioIndicatorPropsWithoutHTML,
	MenubarRadioItemPropsWithoutHTML,
	MenubarSeparatorPropsWithoutHTML,
	MenubarSubContentPropsWithoutHTML,
	MenubarSubPropsWithoutHTML,
	MenubarSubTriggerPropsWithoutHTML,
	MenubarTriggerPropsWithoutHTML,
} from "bits-ui";
import { builderAndAttrsSlotProps, domElProps } from "./helpers.js";
import { menu as m } from "./menu.js";
import { idsSlotProp } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<MenubarPropsWithoutHTML> = {
	title: "Root",
	description: "The root menubar component which manages & scopes the state of the menubar.",
	props: {
		closeOnEscape: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description: "Whether to close the open menubar menu when the escape key is pressed.",
		},
		loop: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description:
				"Whether or not to loop through the menubar menu triggers when navigating with the keyboard.",
		},
		preventScroll: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description:
				"Whether or not to prevent scrolling the body while a menu in the menubar is open.",
		},
		...domElProps("HTMLDivElement"),
	},
	slotProps: { ...builderAndAttrsSlotProps, ids: idsSlotProp },
};

export const menu: APISchema<MenubarMenuPropsWithoutHTML> = {
	title: "Menu",
	description: "A menu within the menubar.",
	...m.root,
};

export const trigger: APISchema<MenubarTriggerPropsWithoutHTML> = {
	title: "Trigger",
	description: "The button element which toggles the dropdown menu.",
	...m.trigger,
};

export const content: APISchema<MenubarContentPropsWithoutHTML> = {
	title: "Content",
	description: "The content displayed when the dropdown menu is open.",
	...m.content,
};

export const item: APISchema<MenubarItemPropsWithoutHTML & { href: string }> = {
	title: "Item",
	description: "A menu item within the dropdown menu.",
	...m.item,
};

export const separator: APISchema<MenubarSeparatorPropsWithoutHTML> = {
	title: "Separator",
	description: "A horizontal line to visually separate menu items.",
	...m.separator,
};

export const arrow: APISchema<MenubarArrowPropsWithoutHTML> = {
	title: "Arrow",
	description: "An optional arrow which points to the dropdown menu's anchor/trigger point.",
	...m.arrow,
};

export const checkboxItem: APISchema<MenubarCheckboxItemPropsWithoutHTML> = {
	title: "CheckboxItem",
	description: "A menu item that can be controlled and toggled like a checkbox.",
	...m.checkboxItem,
};

export const checkboxIndicator: APISchema<MenubarCheckboxIndicatorPropsWithoutHTML> = {
	title: "CheckboxIndicator",
	description:
		"A visual indicator of the checkbox menu item's checked state. It passed the item's checked state as a slot prop `checked` and can be used to render a custom indicator.",
	...m.checkboxIndicator,
};

export const radioGroup: APISchema<MenubarRadioGroupPropsWithoutHTML> = {
	title: "RadioGroup",
	description: "A group of radio menu items, where only one can be checked at a time.",
	...m.radioGroup,
};

export const radioItem: APISchema<MenubarRadioItemPropsWithoutHTML> = {
	title: "RadioItem",
	description:
		"A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.",
	...m.radioItem,
};

export const radioIndicator: APISchema<MenubarRadioIndicatorPropsWithoutHTML> = {
	title: "RadioIndicator",
	description:
		"A visual indicator helper for `RadioItem`s. It only renders it's children when the radio item is checked.",
	...m.radioIndicator,
};

export const sub: APISchema<MenubarSubPropsWithoutHTML> = {
	title: "Sub",
	description:
		"A submenu belonging to the parent dropdown menu. Responsible for managing the state of the submenu.",
	...m.sub,
};

export const subTrigger: APISchema<MenubarSubTriggerPropsWithoutHTML> = {
	title: "SubTrigger",
	description: "A menu item which when pressed or hovered, opens the submenu.",
	...m.subTrigger,
};

export const subContent: APISchema<MenubarSubContentPropsWithoutHTML> = {
	title: "SubContent",
	description: "The submenu content displayed when the parent submenu is open.",
	...m.subContent,
};

export const group: APISchema<MenubarGroupPropsWithoutHTML> = {
	title: "Group",
	description:
		"A group of menu items. It can be used along with the `Menu.Label` component to provide a visual label for a group of menu items. When a label is within a group, appropriate aria attributes will be applied to the group.",
	...m.group,
};

export const label: APISchema<MenubarLabelPropsWithoutHTML> = {
	title: "Label",
	description:
		"A label which will be skipped when navigating with the keyboard. It is used to provide a visual label for a group of menu items. When a label is within a `Menu.Group`, appropriate aria attributes will be applied to the group.",
	...m.label,
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
	subContent,
];
