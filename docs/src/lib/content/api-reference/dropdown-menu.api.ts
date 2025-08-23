import type {
	DropdownMenuArrowPropsWithoutHTML,
	DropdownMenuCheckboxGroupPropsWithoutHTML,
	DropdownMenuCheckboxItemPropsWithoutHTML,
	DropdownMenuContentPropsWithoutHTML,
	DropdownMenuContentStaticPropsWithoutHTML,
	DropdownMenuGroupHeadingPropsWithoutHTML,
	DropdownMenuGroupPropsWithoutHTML,
	DropdownMenuItemPropsWithoutHTML,
	DropdownMenuPortalPropsWithoutHTML,
	DropdownMenuRadioGroupPropsWithoutHTML,
	DropdownMenuRadioItemPropsWithoutHTML,
	DropdownMenuRootPropsWithoutHTML,
	DropdownMenuSeparatorPropsWithoutHTML,
	DropdownMenuSubContentPropsWithoutHTML,
	DropdownMenuSubContentStaticPropsWithoutHTML,
	DropdownMenuSubPropsWithoutHTML,
	DropdownMenuSubTriggerPropsWithoutHTML,
	DropdownMenuTriggerPropsWithoutHTML,
} from "bits-ui";
import { menu } from "./menu.api.js";
import { defineComponentApiSchema, defineSimpleDataAttr } from "../utils.js";
import { floatingContentCSSVars } from "./shared.js";

export const root = defineComponentApiSchema<DropdownMenuRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component which manages & scopes the state of the dropdown menu.",
	...menu.root,
});

export const trigger = defineComponentApiSchema<DropdownMenuTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The button element which toggles the dropdown menu.",
	...menu.trigger,
	dataAttributes: [
		...menu.trigger.dataAttributes,
		defineSimpleDataAttr({
			name: "dropdown-menu-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

const portal = defineComponentApiSchema<DropdownMenuPortalPropsWithoutHTML>({
	title: "Portal",
	description:
		"A component that portals the content of the dropdown menu to the body or a custom target (if provided).",
	...menu.portal,
});

export const content = defineComponentApiSchema<DropdownMenuContentPropsWithoutHTML>({
	title: "Content",
	description: "The content displayed when the dropdown menu is open.",
	...menu.content,
	cssVars: floatingContentCSSVars("dropdown-menu"),
	dataAttributes: [
		...menu.content.dataAttributes,
		defineSimpleDataAttr({
			name: "dropdown-menu-content",
			description: "Present on the content element.",
		}),
	],
});

export const contentStatic = defineComponentApiSchema<DropdownMenuContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description: "The content displayed when the dropdown menu is open. (Static/No Floating UI)",
	...menu.contentStatic,
	dataAttributes: [
		...menu.content.dataAttributes,
		defineSimpleDataAttr({
			name: "dropdown-menu-content",
			description: "Present on the content element.",
		}),
	],
});

export const item = defineComponentApiSchema<DropdownMenuItemPropsWithoutHTML>({
	title: "Item",
	description: "A menu item within the dropdown menu.",
	...menu.item,
	dataAttributes: [
		...menu.item.dataAttributes,
		defineSimpleDataAttr({
			name: "dropdown-menu-item",
			description: "Present on the item element.",
		}),
	],
});

export const separator = defineComponentApiSchema<DropdownMenuSeparatorPropsWithoutHTML>({
	title: "Separator",
	description: "A horizontal line to visually separate menu items.",
	...menu.separator,
	dataAttributes: [
		...menu.separator.dataAttributes,
		defineSimpleDataAttr({
			name: "dropdown-menu-separator",
			description: "Present on the separator element.",
		}),
	],
});

export const arrow = defineComponentApiSchema<DropdownMenuArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow which points to the dropdown menu's anchor/trigger point.",
	...menu.arrow,
	dataAttributes: [
		...menu.arrow.dataAttributes,
		defineSimpleDataAttr({
			name: "dropdown-menu-arrow",
			description: "Present on the arrow element.",
		}),
	],
});

export const checkboxGroup = defineComponentApiSchema<DropdownMenuCheckboxGroupPropsWithoutHTML>({
	title: "CheckboxGroup",
	description: "A group of checkbox menu items, where multiple can be checked at a time.",
	...menu.checkboxGroup,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "dropdown-menu-checkbox-group",
			description: "Present on the checkbox group element.",
		}),
	],
});

export const checkboxItem = defineComponentApiSchema<DropdownMenuCheckboxItemPropsWithoutHTML>({
	title: "CheckboxItem",
	description: "A menu item that can be controlled and toggled like a checkbox.",
	...menu.checkboxItem,
	dataAttributes: [
		...menu.checkboxItem.dataAttributes,
		defineSimpleDataAttr({
			name: "dropdown-menu-checkbox-item",
			description: "Present on the checkbox item element.",
		}),
	],
});

export const radioGroup = defineComponentApiSchema<DropdownMenuRadioGroupPropsWithoutHTML>({
	title: "RadioGroup",
	description: "A group of radio menu items, where only one can be checked at a time.",
	...menu.radioGroup,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "dropdown-menu-radio-group",
			description: "Present on the radio group element.",
		}),
	],
});

export const radioItem = defineComponentApiSchema<DropdownMenuRadioItemPropsWithoutHTML>({
	title: "RadioItem",
	description:
		"A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.",
	...menu.radioItem,
	dataAttributes: [
		...menu.radioItem.dataAttributes,
		defineSimpleDataAttr({
			name: "dropdown-menu-radio-item",
			description: "Present on the radio item element.",
		}),
	],
});

export const sub = defineComponentApiSchema<DropdownMenuSubPropsWithoutHTML>({
	title: "Sub",
	description:
		"A submenu belonging to the parent dropdown menu. Responsible for managing the state of the submenu.",
	...menu.sub,
});

export const subTrigger = defineComponentApiSchema<DropdownMenuSubTriggerPropsWithoutHTML>({
	title: "SubTrigger",
	description: "A menu item which when pressed or hovered, opens the submenu it is a child of.",
	...menu.subTrigger,
	dataAttributes: [
		...menu.subTrigger.dataAttributes,
		defineSimpleDataAttr({
			name: "dropdown-menu-sub-trigger",
			description: "Present on the submenu trigger element.",
		}),
	],
});

export const subContent = defineComponentApiSchema<DropdownMenuSubContentPropsWithoutHTML>({
	title: "SubContent",
	description: "The submenu content displayed when the parent submenu is open.",
	...menu.subContent,
	dataAttributes: [
		...menu.subContent.dataAttributes,
		defineSimpleDataAttr({
			name: "dropdown-menu-sub-content",
			description: "Present on the submenu content element.",
		}),
	],
});

export const subContentStatic =
	defineComponentApiSchema<DropdownMenuSubContentStaticPropsWithoutHTML>({
		title: "SubContentStatic",
		description:
			"The submenu content displayed when the parent submenu menu is open. (Static/No Floating UI)",
		...menu.subContentStatic,
		dataAttributes: [
			...menu.subContentStatic.dataAttributes,
			defineSimpleDataAttr({
				name: "dropdown-menu-sub-content",
				description: "Present on the submenu content element.",
			}),
		],
	});

export const group = defineComponentApiSchema<DropdownMenuGroupPropsWithoutHTML>({
	title: "Group",
	description:
		"A group of menu items. It should be passed an `aria-label` or have a child `DropdownMenu.GroupHeading` component to provide a label for a group of menu items.",
	...menu.group,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "dropdown-menu-group",
			description: "Present on the group element.",
		}),
	],
});

export const groupHeading = defineComponentApiSchema<DropdownMenuGroupHeadingPropsWithoutHTML>({
	title: "GroupHeading",
	description:
		"A heading for a group which will be skipped when navigating with the keyboard. It is used to provide a description for a group of menu items and must be a child of either a `DropdownMenu.Group` or `DropdownMenu.RadioGroup` component.",
	...menu.label,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "dropdown-menu-group-heading",
			description: "Present on the group heading element.",
		}),
	],
});

export const dropdownMenu = [
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
