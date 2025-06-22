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
import { defineComponentApiSchema } from "../utils.js";
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
});

export const contentStatic = defineComponentApiSchema<DropdownMenuContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description: "The content displayed when the dropdown menu is open. (Static/No Floating UI)",
	...menu.contentStatic,
});

export const item = defineComponentApiSchema<DropdownMenuItemPropsWithoutHTML>({
	title: "Item",
	description: "A menu item within the dropdown menu.",
	...menu.item,
});

export const separator = defineComponentApiSchema<DropdownMenuSeparatorPropsWithoutHTML>({
	title: "Separator",
	description: "A horizontal line to visually separate menu items.",
	...menu.separator,
});

export const arrow = defineComponentApiSchema<DropdownMenuArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow which points to the dropdown menu's anchor/trigger point.",
	...menu.arrow,
});

export const checkboxGroup = defineComponentApiSchema<DropdownMenuCheckboxGroupPropsWithoutHTML>({
	title: "CheckboxGroup",
	description: "A group of checkbox menu items, where multiple can be checked at a time.",
	...menu.checkboxGroup,
});

export const checkboxItem = defineComponentApiSchema<DropdownMenuCheckboxItemPropsWithoutHTML>({
	title: "CheckboxItem",
	description: "A menu item that can be controlled and toggled like a checkbox.",
	...menu.checkboxItem,
});

export const radioGroup = defineComponentApiSchema<DropdownMenuRadioGroupPropsWithoutHTML>({
	title: "RadioGroup",
	description: "A group of radio menu items, where only one can be checked at a time.",
	...menu.radioGroup,
});

export const radioItem = defineComponentApiSchema<DropdownMenuRadioItemPropsWithoutHTML>({
	title: "RadioItem",
	description:
		"A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.",
	...menu.radioItem,
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
});

export const subContent = defineComponentApiSchema<DropdownMenuSubContentPropsWithoutHTML>({
	title: "SubContent",
	description: "The submenu content displayed when the parent submenu is open.",
	...menu.subContent,
});

export const subContentStatic =
	defineComponentApiSchema<DropdownMenuSubContentStaticPropsWithoutHTML>({
		title: "SubContentStatic",
		description:
			"The submenu content displayed when the parent submenu menu is open. (Static/No Floating UI)",
		...menu.subContentStatic,
	});

export const group = defineComponentApiSchema<DropdownMenuGroupPropsWithoutHTML>({
	title: "Group",
	description:
		"A group of menu items. It should be passed an `aria-label` or have a child `DropdownMenu.GroupHeading` component to provide a label for a group of menu items.",
	...menu.group,
});

export const groupHeading = defineComponentApiSchema<DropdownMenuGroupHeadingPropsWithoutHTML>({
	title: "GroupHeading",
	description:
		"A heading for a group which will be skipped when navigating with the keyboard. It is used to provide a description for a group of menu items and must be a child of either a `DropdownMenu.Group` or `DropdownMenu.RadioGroup` component.",
	...menu.label,
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
