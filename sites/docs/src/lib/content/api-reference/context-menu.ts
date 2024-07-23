import type {
	ContextMenuArrowPropsWithoutHTML,
	ContextMenuCheckboxItemPropsWithoutHTML,
	ContextMenuContentPropsWithoutHTML,
	ContextMenuGroupPropsWithoutHTML,
	ContextMenuItemPropsWithoutHTML,
	ContextMenuLabelPropsWithoutHTML,
	ContextMenuRootPropsWithoutHTML,
	ContextMenuRadioGroupPropsWithoutHTML,
	ContextMenuRadioItemPropsWithoutHTML,
	ContextMenuSeparatorPropsWithoutHTML,
	ContextMenuSubContentPropsWithoutHTML,
	ContextMenuSubPropsWithoutHTML,
	ContextMenuSubTriggerPropsWithoutHTML,
	ContextMenuTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	builderAndAttrsSlotProps,
	dirProp,
	dismissableLayerProps,
	domElProps,
	enums,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	preventOverflowTextSelectionProp,
	seeFloating,
	transitionProps,
	union,
	withChildProps,
} from "./helpers.js";
import { menu } from "./menu.js";
import type { APISchema } from "$lib/types/index.js";
import * as C from "$lib/content/constants.js";

export const root: APISchema<ContextMenuRootPropsWithoutHTML> = {
	title: "Root",
	description: "The root component which manages & scopes the state of the context menu.",
	...menu.root,
};

export const trigger: APISchema<ContextMenuTriggerPropsWithoutHTML> = {
	title: "Trigger",
	description: "The element which when right-clicked, opens the context menu.",
	...menu.trigger,
	props: {
		...menu.trigger.props,
		ref: {
			type: "HTMLDivElement",
			description: "You can bind to this prop to programatically interact with the element.",
		},
	},
};

export const content: APISchema<ContextMenuContentPropsWithoutHTML> = {
	title: "Content",
	description: "The content displayed when the context menu is open.",
	props: {
		...floatingProps(),
		...escapeLayerProps,
		...dismissableLayerProps,
		...focusScopeProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		dir: dirProp,
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: menu.content.dataAttributes,
};

export const item: APISchema<ContextMenuItemPropsWithoutHTML> = {
	title: "Item",
	description: "A menu item within the context menu.",
	...menu.item,
};

export const separator: APISchema<ContextMenuSeparatorPropsWithoutHTML> = {
	title: "Separator",
	description: "A horizontal line to visually separate menu items.",
	...menu.separator,
};

export const arrow: APISchema<ContextMenuArrowPropsWithoutHTML> = {
	title: "Arrow",
	description: "An optional arrow which points to the context menu's anchor/trigger point.",
	...menu.arrow,
};

export const checkboxItem: APISchema<ContextMenuCheckboxItemPropsWithoutHTML> = {
	title: "CheckboxItem",
	description: "A menu item that can be controlled and toggled like a checkbox.",
	...menu.checkboxItem,
};

export const radioGroup: APISchema<ContextMenuRadioGroupPropsWithoutHTML> = {
	title: "RadioGroup",
	description: "A group of radio menu items, where only one can be checked at a time.",
	...menu.radioGroup,
};

export const radioItem: APISchema<ContextMenuRadioItemPropsWithoutHTML> = {
	title: "RadioItem",
	description:
		"A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.",
	...menu.radioItem,
};

export const sub: APISchema<ContextMenuSubPropsWithoutHTML> = {
	title: "Sub",
	description:
		"A submenu belonging to the parent context menu. Responsible for managing the state of the submenu.",
	...menu.sub,
};

export const subTrigger: APISchema<ContextMenuSubTriggerPropsWithoutHTML> = {
	title: "SubTrigger",
	description: "A menu item which when pressed or hovered, opens the submenu.",
	...menu.subTrigger,
};

export const subContent: APISchema<ContextMenuSubContentPropsWithoutHTML> = {
	title: "SubContent",
	description: "The submenu content displayed when the parent submenu is open.",
	...menu.subContent,
};

export const group: APISchema<ContextMenuGroupPropsWithoutHTML> = {
	title: "Group",
	description:
		"A group of menu items. It can be used along with the `Menu.Label` component to provide a visual label for a group of menu items. When a label is within a group, appropriate aria attributes will be applied to the group.",
	...menu.group,
};

export const label: APISchema<ContextMenuLabelPropsWithoutHTML> = {
	title: "Label",
	description:
		"A label which will be skipped when navigating with the keyboard. It is used to provide a visual label for a group of menu items. When a label is within a `Menu.Group`, appropriate aria attributes will be applied to the group.",
	...menu.label,
};

export const contextMenu = [
	root,
	trigger,
	content,
	item,
	checkboxItem,
	radioGroup,
	radioItem,
	separator,
	arrow,
	group,
	label,
	sub,
	subTrigger,
	subContent,
];
