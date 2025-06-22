import type {
	ContextMenuArrowPropsWithoutHTML,
	ContextMenuCheckboxGroupPropsWithoutHTML,
	ContextMenuCheckboxItemPropsWithoutHTML,
	ContextMenuContentPropsWithoutHTML,
	ContextMenuContentStaticPropsWithoutHTML,
	ContextMenuGroupHeadingPropsWithoutHTML,
	ContextMenuGroupPropsWithoutHTML,
	ContextMenuItemPropsWithoutHTML,
	ContextMenuPortalPropsWithoutHTML,
	ContextMenuRadioGroupPropsWithoutHTML,
	ContextMenuRadioItemPropsWithoutHTML,
	ContextMenuRootPropsWithoutHTML,
	ContextMenuSeparatorPropsWithoutHTML,
	ContextMenuSubContentPropsWithoutHTML,
	ContextMenuSubContentStaticPropsWithoutHTML,
	ContextMenuSubPropsWithoutHTML,
	ContextMenuSubTriggerPropsWithoutHTML,
	ContextMenuTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	dirProp,
	dismissibleLayerProps,
	escapeLayerProps,
	floatingContentChildDefinition,
	floatingContentCSSVars,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	refProp,
	withChildProps,
} from "./shared.js";
import { menu } from "./menu.api.js";
import { omit } from "$lib/utils/omit.js";
import { defineBooleanProp, defineComponentApiSchema } from "../utils.js";

export const root = defineComponentApiSchema<ContextMenuRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component which manages & scopes the state of the context menu.",
	...menu.root,
});

export const trigger = defineComponentApiSchema<ContextMenuTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The element which when right-clicked, opens the context menu.",
	...menu.trigger,
	props: {
		...menu.trigger.props,
		ref: refProp({ elType: "HTMLDivElement" }),
	},
});

const portal = defineComponentApiSchema<ContextMenuPortalPropsWithoutHTML>({
	title: "Portal",
	description:
		"A component that portals the content of the dropdown menu to the body or a custom target (if provided).",
	...menu.portal,
});

export const content = defineComponentApiSchema<ContextMenuContentPropsWithoutHTML>({
	title: "Content",
	description: "The content displayed when the context menu is open.",
	props: {
		...omit(floatingProps(), "align", "side", "sideOffset"),
		...escapeLayerProps,
		...dismissibleLayerProps,
		...focusScopeProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		dir: dirProp,
		forceMount: forceMountProp,
		loop: defineBooleanProp({
			default: false,
			description:
				"Whether or not the context menu should loop through items when reaching the end.",
		}),
		...withChildProps({ elType: "HTMLDivElement", child: floatingContentChildDefinition }),
	},
	dataAttributes: menu.content.dataAttributes,
	cssVars: floatingContentCSSVars("context-menu"),
});

export const contentStatic = defineComponentApiSchema<ContextMenuContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description: "The content displayed when the context menu is open. (Static/No Floating UI)",
	props: {
		...escapeLayerProps,
		...dismissibleLayerProps,
		...focusScopeProps,
		preventScroll: preventScrollProp,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		dir: dirProp,
		forceMount: forceMountProp,
		loop: defineBooleanProp({
			default: false,
			description:
				"Whether or not the context menu should loop through items when reaching the end.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: menu.content.dataAttributes,
});

export const item = defineComponentApiSchema<ContextMenuItemPropsWithoutHTML>({
	title: "Item",
	description: "A menu item within the context menu.",
	...menu.item,
});

export const separator = defineComponentApiSchema<ContextMenuSeparatorPropsWithoutHTML>({
	title: "Separator",
	description: "A horizontal line to visually separate menu items.",
	...menu.separator,
});

export const arrow = defineComponentApiSchema<ContextMenuArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow which points to the context menu's anchor/trigger point.",
	...menu.arrow,
});

export const checkboxItem = defineComponentApiSchema<ContextMenuCheckboxItemPropsWithoutHTML>({
	title: "CheckboxItem",
	description: "A menu item that can be controlled and toggled like a checkbox.",
	...menu.checkboxItem,
});

export const checkboxGroup = defineComponentApiSchema<ContextMenuCheckboxGroupPropsWithoutHTML>({
	title: "CheckboxGroup",
	description: "A group of checkbox menu items, where multiple can be checked at a time.",
	...menu.checkboxGroup,
});

export const radioGroup = defineComponentApiSchema<ContextMenuRadioGroupPropsWithoutHTML>({
	title: "RadioGroup",
	description: "A group of radio menu items, where only one can be checked at a time.",
	...menu.radioGroup,
});

export const radioItem = defineComponentApiSchema<ContextMenuRadioItemPropsWithoutHTML>({
	title: "RadioItem",
	description:
		"A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.",
	...menu.radioItem,
});

export const sub = defineComponentApiSchema<ContextMenuSubPropsWithoutHTML>({
	title: "Sub",
	description:
		"A submenu belonging to the parent context menu. Responsible for managing the state of the submenu.",
	...menu.sub,
});

export const subTrigger = defineComponentApiSchema<ContextMenuSubTriggerPropsWithoutHTML>({
	title: "SubTrigger",
	description: "A menu item which when pressed or hovered, opens the submenu it is a child of.",
	...menu.subTrigger,
});

export const subContent = defineComponentApiSchema<ContextMenuSubContentPropsWithoutHTML>({
	title: "SubContent",
	description: "The submenu content displayed when the parent submenu is open.",
	...menu.subContent,
});

export const subContentStatic =
	defineComponentApiSchema<ContextMenuSubContentStaticPropsWithoutHTML>({
		title: "SubContentStatic",
		description:
			"The submenu content displayed when the parent submenu menu is open. (Static/No Floating UI)",
		...menu.subContentStatic,
	});

export const group = defineComponentApiSchema<ContextMenuGroupPropsWithoutHTML>({
	title: "Group",
	description:
		"A group of menu items. It should be passed an `aria-label` or have a child `ContextMenu.GroupHeading` component to provide a label for a group of menu items.",
	...menu.group,
});

export const groupHeading = defineComponentApiSchema<ContextMenuGroupHeadingPropsWithoutHTML>({
	title: "GroupHeading",
	description:
		"A heading for a group which will be skipped when navigating with the keyboard. It is used to provide a visual label for a group of menu items and must be a child of either a `ContextMenu.Group` or `ContextMenu.RadioGroup` component.",
	...menu.label,
});

export const contextMenu = [
	root,
	trigger,
	portal,
	content,
	contentStatic,
	item,
	checkboxGroup,
	checkboxItem,
	radioGroup,
	radioItem,
	separator,
	arrow,
	group,
	groupHeading,
	sub,
	subTrigger,
	subContent,
	subContentStatic,
];
