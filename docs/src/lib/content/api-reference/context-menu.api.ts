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
import { defineBooleanProp, defineComponentApiSchema, defineSimpleDataAttr } from "../utils.js";

export const root = defineComponentApiSchema<ContextMenuRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component which manages & scopes the state of the context menu.",
	...menu.root,
});

export const trigger = defineComponentApiSchema<ContextMenuTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The element which when right-clicked, opens the context menu.",
	props: {
		...menu.trigger.props,
		ref: refProp({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		...menu.trigger.dataAttributes,
		defineSimpleDataAttr({
			name: "context-menu-trigger",
			description: "Present on the trigger element.",
		}),
	],
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
		...floatingProps(),
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
	dataAttributes: [
		...menu.content.dataAttributes,
		defineSimpleDataAttr({
			name: "context-menu-content",
			description: "Present on the content element.",
		}),
	],
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
	dataAttributes: [
		...menu.content.dataAttributes,
		defineSimpleDataAttr({
			name: "context-menu-content",
			description: "Present on the content element.",
		}),
	],
});

export const item = defineComponentApiSchema<ContextMenuItemPropsWithoutHTML>({
	title: "Item",
	description: "A menu item within the context menu.",
	...menu.item,
	dataAttributes: [
		...menu.item.dataAttributes,
		defineSimpleDataAttr({
			name: "context-menu-item",
			description: "Present on the item element.",
		}),
	],
});

export const separator = defineComponentApiSchema<ContextMenuSeparatorPropsWithoutHTML>({
	title: "Separator",
	description: "A horizontal line to visually separate menu items.",
	...menu.separator,
	dataAttributes: [
		...menu.separator.dataAttributes,
		defineSimpleDataAttr({
			name: "context-menu-separator",
			description: "Present on the separator element.",
		}),
	],
});

export const arrow = defineComponentApiSchema<ContextMenuArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow which points to the context menu's anchor/trigger point.",
	...menu.arrow,
	dataAttributes: [
		...menu.arrow.dataAttributes,
		defineSimpleDataAttr({
			name: "context-menu-arrow",
			description: "Present on the arrow element.",
		}),
	],
});

export const checkboxItem = defineComponentApiSchema<ContextMenuCheckboxItemPropsWithoutHTML>({
	title: "CheckboxItem",
	description: "A menu item that can be controlled and toggled like a checkbox.",
	...menu.checkboxItem,
	dataAttributes: [
		...menu.checkboxItem.dataAttributes,
		defineSimpleDataAttr({
			name: "context-menu-checkbox-item",
			description: "Present on the checkbox item element.",
		}),
	],
});

export const checkboxGroup = defineComponentApiSchema<ContextMenuCheckboxGroupPropsWithoutHTML>({
	title: "CheckboxGroup",
	description: "A group of checkbox menu items, where multiple can be checked at a time.",
	...menu.checkboxGroup,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "context-menu-checkbox-group",
			description: "Present on the checkbox group element.",
		}),
	],
});

export const radioGroup = defineComponentApiSchema<ContextMenuRadioGroupPropsWithoutHTML>({
	title: "RadioGroup",
	description: "A group of radio menu items, where only one can be checked at a time.",
	...menu.radioGroup,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "context-menu-radio-group",
			description: "Present on the radio group element.",
		}),
	],
});

export const radioItem = defineComponentApiSchema<ContextMenuRadioItemPropsWithoutHTML>({
	title: "RadioItem",
	description:
		"A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.",
	...menu.radioItem,
	dataAttributes: [
		...menu.radioItem.dataAttributes,
		defineSimpleDataAttr({
			name: "context-menu-radio-item",
			description: "Present on the radio item element.",
		}),
	],
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
	dataAttributes: [
		...menu.subTrigger.dataAttributes,
		defineSimpleDataAttr({
			name: "context-menu-sub-trigger",
			description: "Present on the submenu trigger element.",
		}),
	],
});

export const subContent = defineComponentApiSchema<ContextMenuSubContentPropsWithoutHTML>({
	title: "SubContent",
	description: "The submenu content displayed when the parent submenu is open.",
	...menu.subContent,
	dataAttributes: [
		...menu.subContent.dataAttributes,
		defineSimpleDataAttr({
			name: "context-menu-sub-content",
			description: "Present on the submenu content element.",
		}),
	],
});

export const subContentStatic =
	defineComponentApiSchema<ContextMenuSubContentStaticPropsWithoutHTML>({
		title: "SubContentStatic",
		description:
			"The submenu content displayed when the parent submenu menu is open. (Static/No Floating UI)",
		...menu.subContentStatic,
		dataAttributes: [
			...menu.subContent.dataAttributes,
			defineSimpleDataAttr({
				name: "context-menu-sub-content",
				description: "Present on the submenu content element.",
			}),
		],
	});

export const group = defineComponentApiSchema<ContextMenuGroupPropsWithoutHTML>({
	title: "Group",
	description:
		"A group of menu items. It should be passed an `aria-label` or have a child `ContextMenu.GroupHeading` component to provide a label for a group of menu items.",
	...menu.group,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "context-menu-group",
			description: "Present on the group element.",
		}),
	],
});

export const groupHeading = defineComponentApiSchema<ContextMenuGroupHeadingPropsWithoutHTML>({
	title: "GroupHeading",
	description:
		"A heading for a group which will be skipped when navigating with the keyboard. It is used to provide a visual label for a group of menu items and must be a child of either a `ContextMenu.Group` or `ContextMenu.RadioGroup` component.",
	...menu.label,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "menu-group-heading",
			description: "Present on the group heading element.",
		}),
	],
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
