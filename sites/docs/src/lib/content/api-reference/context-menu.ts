import type {
	ContextMenuArrowPropsWithoutHTML,
	ContextMenuCheckboxItemPropsWithoutHTML,
	ContextMenuContentPropsWithoutHTML,
	ContextMenuGroupPropsWithoutHTML,
	ContextMenuItemPropsWithoutHTML,
	ContextMenuLabelPropsWithoutHTML,
	ContextMenuRadioGroupPropsWithoutHTML,
	ContextMenuRadioItemPropsWithoutHTML,
	ContextMenuRootPropsWithoutHTML,
	ContextMenuSeparatorPropsWithoutHTML,
	ContextMenuSubContentPropsWithoutHTML,
	ContextMenuSubPropsWithoutHTML,
	ContextMenuSubTriggerPropsWithoutHTML,
	ContextMenuTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	createApiSchema,
	createBooleanProp,
	createCSSVarSchema,
	dirProp,
	dismissableLayerProps,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	preventOverflowTextSelectionProp,
	refProp,
	withChildProps,
} from "./helpers.js";
import { menu } from "./menu.js";
import * as C from "$lib/content/constants.js";

export const root = createApiSchema<ContextMenuRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component which manages & scopes the state of the context menu.",
	...menu.root,
});

export const trigger = createApiSchema<ContextMenuTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The element which when right-clicked, opens the context menu.",
	...menu.trigger,
	props: {
		...menu.trigger.props,
		ref: refProp({ elType: "HTMLDivElement" }),
	},
});

export const content = createApiSchema<ContextMenuContentPropsWithoutHTML>({
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
		loop: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the context menu should loop through items when reaching the end.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: menu.content.dataAttributes,
	cssVars: [
		createCSSVarSchema({
			name: "--bits-context-menu-content-transform-origin",
			description: "The transform origin of the context menu content element.",
		}),
		createCSSVarSchema({
			name: "--bits-context-menu-content-available-width",
			description: "The available width of the context menu content element.",
		}),
		createCSSVarSchema({
			name: "--bits-context-menu-content-available-height",
			description: "The available height of the context menu content element.",
		}),
		createCSSVarSchema({
			name: "--bits-context-menu-trigger-width",
			description: "The width of the context menu trigger element.",
		}),
		createCSSVarSchema({
			name: "--bits-context-menu-trigger-height",
			description: "The height of the context menu trigger element.",
		}),
	],
});

export const item = createApiSchema<ContextMenuItemPropsWithoutHTML>({
	title: "Item",
	description: "A menu item within the context menu.",
	...menu.item,
});

export const separator = createApiSchema<ContextMenuSeparatorPropsWithoutHTML>({
	title: "Separator",
	description: "A horizontal line to visually separate menu items.",
	...menu.separator,
});

export const arrow = createApiSchema<ContextMenuArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow which points to the context menu's anchor/trigger point.",
	...menu.arrow,
});

export const checkboxItem = createApiSchema<ContextMenuCheckboxItemPropsWithoutHTML>({
	title: "CheckboxItem",
	description: "A menu item that can be controlled and toggled like a checkbox.",
	...menu.checkboxItem,
});

export const radioGroup = createApiSchema<ContextMenuRadioGroupPropsWithoutHTML>({
	title: "RadioGroup",
	description: "A group of radio menu items, where only one can be checked at a time.",
	...menu.radioGroup,
});

export const radioItem = createApiSchema<ContextMenuRadioItemPropsWithoutHTML>({
	title: "RadioItem",
	description:
		"A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.",
	...menu.radioItem,
});

export const sub = createApiSchema<ContextMenuSubPropsWithoutHTML>({
	title: "Sub",
	description:
		"A submenu belonging to the parent context menu. Responsible for managing the state of the submenu.",
	...menu.sub,
});

export const subTrigger = createApiSchema<ContextMenuSubTriggerPropsWithoutHTML>({
	title: "SubTrigger",
	description: "A menu item which when pressed or hovered, opens the submenu.",
	...menu.subTrigger,
});

export const subContent = createApiSchema<ContextMenuSubContentPropsWithoutHTML>({
	title: "SubContent",
	description: "The submenu content displayed when the parent submenu is open.",
	...menu.subContent,
});

export const group = createApiSchema<ContextMenuGroupPropsWithoutHTML>({
	title: "Group",
	description:
		"A group of menu items. It can be used along with the `Menu.Label` component to provide a visual label for a group of menu items. When a label is within a group, appropriate aria attributes will be applied to the group.",
	...menu.group,
});

export const label = createApiSchema<ContextMenuLabelPropsWithoutHTML>({
	title: "Label",
	description:
		"A label which will be skipped when navigating with the keyboard. It is used to provide a visual label for a group of menu items. When a label is within a `Menu.Group`, appropriate aria attributes will be applied to the group.",
	...menu.label,
});

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
