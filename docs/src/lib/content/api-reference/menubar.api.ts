import type {
	MenubarArrowPropsWithoutHTML,
	MenubarCheckboxGroupPropsWithoutHTML,
	MenubarCheckboxItemPropsWithoutHTML,
	MenubarContentPropsWithoutHTML,
	MenubarContentStaticPropsWithoutHTML,
	MenubarGroupHeadingPropsWithoutHTML,
	MenubarGroupPropsWithoutHTML,
	MenubarItemPropsWithoutHTML,
	MenubarMenuPropsWithoutHTML,
	MenubarPortalPropsWithoutHTML,
	MenubarRadioGroupPropsWithoutHTML,
	MenubarRadioItemPropsWithoutHTML,
	MenubarRootPropsWithoutHTML,
	MenubarSeparatorPropsWithoutHTML,
	MenubarSubContentPropsWithoutHTML,
	MenubarSubContentStaticPropsWithoutHTML,
	MenubarSubPropsWithoutHTML,
	MenubarSubTriggerPropsWithoutHTML,
	MenubarTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	childrenSnippet,
	dirProp,
	floatingContentCSSVars,
	onOpenChangeProp,
	withChildProps,
} from "./shared.js";
import { menu as m } from "./menu.api.js";
import { OnStringValueChangeProp } from "./extended-types/shared/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineFunctionProp,
	defineStringProp,
} from "../utils.js";

export const root = defineComponentApiSchema<MenubarRootPropsWithoutHTML>({
	title: "Root",
	description: "The root menubar component which manages & scopes the state of the menubar.",
	props: {
		value: defineStringProp({
			description: "The value of the currently active menu.",
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			definition: OnStringValueChangeProp,
			description: "A callback function called when the active menu value changes.",
			stringDefinition: "(value: string) => void",
		}),
		dir: dirProp,
		loop: defineBooleanProp({
			default: true,
			description:
				"Whether or not to loop through the menubar menu triggers when navigating with the keyboard.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

export const menu = defineComponentApiSchema<MenubarMenuPropsWithoutHTML>({
	title: "Menu",
	description: "A menu within the menubar.",
	...m.root,
	props: {
		value: defineStringProp({
			description:
				"The value of this menu within the menubar, used to identify it when determining which menu is active.",
		}),
		onOpenChange: onOpenChangeProp,
		children: childrenSnippet(),
	},
});

export const trigger = defineComponentApiSchema<MenubarTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The button element which toggles the dropdown menu.",
	...m.trigger,
});

const portal = defineComponentApiSchema<MenubarPortalPropsWithoutHTML>({
	title: "Portal",
	description:
		"A component that portals the content of the dropdown menu to the body or a custom target (if provided).",
	...m.portal,
});

export const content = defineComponentApiSchema<MenubarContentPropsWithoutHTML>({
	title: "Content",
	description: "The content displayed when the dropdown menu is open.",
	...m.content,
	cssVars: floatingContentCSSVars("menubar-menu"),
});

export const contentStatic = defineComponentApiSchema<MenubarContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description: "The content displayed when the dropdown menu is open. (Static/No Floating UI)",
	...m.contentStatic,
});

export const item = defineComponentApiSchema<MenubarItemPropsWithoutHTML>({
	title: "Item",
	description: "A menu item within the dropdown menu.",
	...m.item,
});

export const separator = defineComponentApiSchema<MenubarSeparatorPropsWithoutHTML>({
	title: "Separator",
	description: "A horizontal line to visually separate menu items.",
	...m.separator,
});

export const arrow = defineComponentApiSchema<MenubarArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow which points to the dropdown menu's anchor/trigger point.",
	...m.arrow,
});

export const checkboxItem = defineComponentApiSchema<MenubarCheckboxItemPropsWithoutHTML>({
	title: "CheckboxItem",
	description: "A menu item that can be controlled and toggled like a checkbox.",
	...m.checkboxItem,
});

export const checkboxGroup = defineComponentApiSchema<MenubarCheckboxGroupPropsWithoutHTML>({
	title: "CheckboxGroup",
	description: "A group of checkbox menu items, where multiple can be checked at a time.",
	...m.checkboxGroup,
});

export const radioGroup = defineComponentApiSchema<MenubarRadioGroupPropsWithoutHTML>({
	title: "RadioGroup",
	description: "A group of radio menu items, where only one can be checked at a time.",
	...m.radioGroup,
});

export const radioItem = defineComponentApiSchema<MenubarRadioItemPropsWithoutHTML>({
	title: "RadioItem",
	description:
		"A menu item that can be controlled and toggled like a radio button. It must be a child of a `RadioGroup`.",
	...m.radioItem,
});

export const sub = defineComponentApiSchema<MenubarSubPropsWithoutHTML>({
	title: "Sub",
	description:
		"A submenu belonging to the parent dropdown menu. Responsible for managing the state of the submenu.",
	...m.sub,
});

export const subTrigger = defineComponentApiSchema<MenubarSubTriggerPropsWithoutHTML>({
	title: "SubTrigger",
	description: "A menu item which when pressed or hovered, opens the submenu it is a child of.",
	...m.subTrigger,
});

export const subContent = defineComponentApiSchema<MenubarSubContentPropsWithoutHTML>({
	title: "SubContent",
	description: "The submenu content displayed when the parent submenu is open.",
	...m.subContent,
});

export const subContentStatic = defineComponentApiSchema<MenubarSubContentStaticPropsWithoutHTML>({
	title: "SubContentStatic",
	description:
		"The submenu content displayed when the parent submenu menu is open. (Static/No Floating UI)",
	...m.subContentStatic,
});

export const group = defineComponentApiSchema<MenubarGroupPropsWithoutHTML>({
	title: "Group",
	description:
		"A group of menu items. It should be passed an `aria-label` or have a child `Menu.GroupHeading` component to provide a label for a group of menu items.",
	...m.group,
});

export const groupHeading = defineComponentApiSchema<MenubarGroupHeadingPropsWithoutHTML>({
	title: "GroupHeading",
	description:
		"A heading for a group which will be skipped when navigating with the keyboard. It is used to provide a heading for a group of menu items and must be a child of either a `Menubar.Group` or `Menubar.RadioGroup` component.",
	...m.label,
});

export const menubar = [
	root,
	menu,
	trigger,
	portal,
	content,
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
