import type {
	SidebarContentPropsWithoutHTML,
	SidebarFooterPropsWithoutHTML,
	SidebarGroupActionPropsWithoutHTML,
	SidebarGroupContentPropsWithoutHTML,
	SidebarGroupLabelPropsWithoutHTML,
	SidebarGroupPropsWithoutHTML,
	SidebarHeaderPropsWithoutHTML,
	SidebarInputPropsWithoutHTML,
	SidebarInsetPropsWithoutHTML,
	SidebarMenuActionPropsWithoutHTML,
	SidebarMenuBadgePropsWithoutHTML,
	SidebarMenuButtonPropsWithoutHTML,
	SidebarMenuItemPropsWithoutHTML,
	SidebarMenuPropsWithoutHTML,
	SidebarMenuSkeletonPropsWithoutHTML,
	SidebarMenuSubButtonPropsWithoutHTML,
	SidebarMenuSubItemPropsWithoutHTML,
	SidebarMenuSubPropsWithoutHTML,
	SidebarProviderPropsWithoutHTML,
	SidebarRailPropsWithoutHTML,
	SidebarRootPropsWithoutHTML,
	SidebarSeparatorPropsWithoutHTML,
	SidebarTriggerPropsWithoutHTML,
} from "bits-ui";
import { withChildProps } from "./shared.js";
import {
	SidebarCollapsible,
	SidebarMenuButtonChildSnippetProps,
	SidebarMenuButtonChildrenSnippetProps,
	SidebarMenuButtonSize,
	SidebarMenuButtonVariant,
	SidebarMenuSubButtonSize,
	SidebarProviderChildSnippetProps,
	SidebarProviderChildrenSnippetProps,
	SidebarRootChildSnippetProps,
	SidebarRootChildrenSnippetProps,
	SidebarSide,
	SidebarState,
	SidebarVariant,
} from "./extended-types/sidebar/index.js";
import providerChildRaw from "./extended-types/sidebar/sidebar-provider-child-snippet-props.md?raw";
import providerChildrenRaw from "./extended-types/sidebar/sidebar-provider-children-snippet-props.md?raw";
import rootChildRaw from "./extended-types/sidebar/sidebar-root-child-snippet-props.md?raw";
import rootChildrenRaw from "./extended-types/sidebar/sidebar-root-children-snippet-props.md?raw";
import menuButtonChildRaw from "./extended-types/sidebar/sidebar-menu-button-child-snippet-props.md?raw";
import menuButtonChildrenRaw from "./extended-types/sidebar/sidebar-menu-button-children-snippet-props.md?raw";
import { OnOpenChangeProp } from "./extended-types/shared/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineFunctionProp,
	defineNumberProp,
	defineSimpleDataAttr,
	defineSimplePropSchema,
	stringDefinitionFromMarkdown,
} from "../utils.js";

const providerChildDefinition = {
	definition: SidebarProviderChildSnippetProps,
	stringDefinition: stringDefinitionFromMarkdown(providerChildRaw),
};
const providerChildrenDefinition = {
	definition: SidebarProviderChildrenSnippetProps,
	stringDefinition: stringDefinitionFromMarkdown(providerChildrenRaw),
};
const rootChildDefinition = {
	definition: SidebarRootChildSnippetProps,
	stringDefinition: stringDefinitionFromMarkdown(rootChildRaw),
};
const rootChildrenDefinition = {
	definition: SidebarRootChildrenSnippetProps,
	stringDefinition: stringDefinitionFromMarkdown(rootChildrenRaw),
};
const menuButtonChildDefinition = {
	definition: SidebarMenuButtonChildSnippetProps,
	stringDefinition: stringDefinitionFromMarkdown(menuButtonChildRaw),
};
const menuButtonChildrenDefinition = {
	definition: SidebarMenuButtonChildrenSnippetProps,
	stringDefinition: stringDefinitionFromMarkdown(menuButtonChildrenRaw),
};

function partAttr(name: string) {
	return defineSimpleDataAttr({
		name: `sidebar-${name}`,
		description: `Present on the ${name.replaceAll("-", " ")} element.`,
	});
}

function stateAttr() {
	return defineEnumDataAttr({
		name: "state",
		options: ["expanded", "collapsed"],
		description: "The active sidebar's expanded or collapsed state.",
		value: SidebarState,
	});
}

function mobileAttr() {
	return defineSimpleDataAttr({
		name: "mobile",
		description: "Present when the sidebar is using its mobile state.",
	});
}

function disabledAttr() {
	return defineSimpleDataAttr({
		name: "disabled",
		description: "Present when the component is disabled.",
	});
}

export const provider = defineComponentApiSchema<SidebarProviderPropsWithoutHTML>({
	title: "Provider",
	description: "Provides responsive open state and controls to every sidebar part.",
	props: {
		open: defineBooleanProp({
			default: true,
			bindable: true,
			description: "Whether the desktop sidebar is open.",
		}),
		onOpenChange: defineFunctionProp({
			definition: OnOpenChangeProp,
			stringDefinition: "(open: boolean) => void",
			description: "Called when the desktop open state changes.",
		}),
		openMobile: defineBooleanProp({
			default: false,
			bindable: true,
			description: "Whether the mobile sidebar is open.",
		}),
		onOpenMobileChange: defineFunctionProp({
			definition: OnOpenChangeProp,
			stringDefinition: "(open: boolean) => void",
			description: "Called when the mobile open state changes.",
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether all sidebar toggling is disabled.",
		}),
		isMobile: defineBooleanProp({
			description:
				"Overrides automatic mobile detection. Leave undefined to use `mobileBreakpoint`.",
		}),
		mobileBreakpoint: defineNumberProp({
			default: 768,
			description: "The viewport width below which the mobile open state is used.",
		}),
		keyboardShortcut: defineSimplePropSchema({
			type: "string | null",
			default: "'b'",
			description:
				"The key used with Command or Control to toggle the sidebar. Set to `null` to disable the shortcut.",
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			child: providerChildDefinition,
			children: providerChildrenDefinition,
		}),
	},
	dataAttributes: [stateAttr(), mobileAttr(), disabledAttr(), partAttr("provider")],
});

export const root = defineComponentApiSchema<SidebarRootPropsWithoutHTML>({
	title: "Root",
	description: "The main sidebar container.",
	props: {
		side: defineEnumProp({
			options: ["left", "right"],
			default: "left",
			definition: SidebarSide,
			description: "The physical side where the sidebar is positioned.",
		}),
		variant: defineEnumProp({
			options: ["sidebar", "floating", "inset"],
			default: "sidebar",
			definition: SidebarVariant,
			description: "The visual layout variant exposed for styling.",
		}),
		collapsible: defineEnumProp({
			options: ["offcanvas", "icon", "none"],
			default: "offcanvas",
			definition: SidebarCollapsible,
			description: "How the sidebar behaves when collapsed.",
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			child: rootChildDefinition,
			children: rootChildrenDefinition,
		}),
	},
	dataAttributes: [
		stateAttr(),
		mobileAttr(),
		defineEnumDataAttr({
			name: "side",
			options: ["left", "right"],
			description: "The sidebar's physical side.",
			value: SidebarSide,
		}),
		defineEnumDataAttr({
			name: "variant",
			options: ["sidebar", "floating", "inset"],
			description: "The sidebar's layout variant.",
			value: SidebarVariant,
		}),
		defineEnumDataAttr({
			name: "collapsible",
			options: ["offcanvas", "icon", "none"],
			description: "The sidebar's collapse mode.",
			value: SidebarCollapsible,
		}),
		partAttr("root"),
	],
});

const triggerProps = {
	disabled: defineBooleanProp({
		default: false,
		description: "Whether this toggle is disabled.",
	}),
	...withChildProps({
		elType: "HTMLButtonElement" as const,
		child: providerChildDefinition,
		children: providerChildrenDefinition,
	}),
};

export const trigger = defineComponentApiSchema<SidebarTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "A button that toggles the active desktop or mobile sidebar state.",
	props: triggerProps,
	dataAttributes: [stateAttr(), mobileAttr(), disabledAttr(), partAttr("trigger")],
});

export const rail = defineComponentApiSchema<SidebarRailPropsWithoutHTML>({
	title: "Rail",
	description: "A secondary, pointer-oriented button for toggling the sidebar from its edge.",
	props: triggerProps,
	dataAttributes: [stateAttr(), mobileAttr(), disabledAttr(), partAttr("rail")],
});

export const inset = defineComponentApiSchema<SidebarInsetPropsWithoutHTML>({
	title: "Inset",
	description: "The main content container used alongside the inset sidebar variant.",
	props: withChildProps({ elType: "HTMLElement" }),
	dataAttributes: [partAttr("inset")],
});

export const input = defineComponentApiSchema<SidebarInputPropsWithoutHTML>({
	title: "Input",
	description: "An input styled by consumers for sidebar search or filtering.",
	props: withChildProps({ elType: "HTMLInputElement" }),
	dataAttributes: [partAttr("input")],
});

export const header = defineComponentApiSchema<SidebarHeaderPropsWithoutHTML>({
	title: "Header",
	description: "A container for persistent content at the top of the sidebar.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [partAttr("header")],
});

export const footer = defineComponentApiSchema<SidebarFooterPropsWithoutHTML>({
	title: "Footer",
	description: "A container for persistent content at the bottom of the sidebar.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [partAttr("footer")],
});

export const separator = defineComponentApiSchema<SidebarSeparatorPropsWithoutHTML>({
	title: "Separator",
	description: "A horizontal separator between sidebar regions.",
	props: {
		decorative: defineBooleanProp({
			default: true,
			description: "Whether the separator is hidden from assistive technologies.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [partAttr("separator")],
});

export const content = defineComponentApiSchema<SidebarContentPropsWithoutHTML>({
	title: "Content",
	description: "The primary scrollable area between the sidebar header and footer.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [partAttr("content")],
});

export const group = defineComponentApiSchema<SidebarGroupPropsWithoutHTML>({
	title: "Group",
	description: "Groups related sidebar navigation and actions.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [partAttr("group")],
});

export const groupLabel = defineComponentApiSchema<SidebarGroupLabelPropsWithoutHTML>({
	title: "GroupLabel",
	description: "A visible label for a sidebar group.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [partAttr("group-label")],
});

export const groupAction = defineComponentApiSchema<SidebarGroupActionPropsWithoutHTML>({
	title: "GroupAction",
	description: "A button for an action associated with a sidebar group.",
	props: {
		disabled: defineBooleanProp({
			default: false,
			description: "Whether the action is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [disabledAttr(), partAttr("group-action")],
});

export const groupContent = defineComponentApiSchema<SidebarGroupContentPropsWithoutHTML>({
	title: "GroupContent",
	description: "The content container for a sidebar group.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [partAttr("group-content")],
});

export const menu = defineComponentApiSchema<SidebarMenuPropsWithoutHTML>({
	title: "Menu",
	description: "A semantic list of sidebar menu items.",
	props: withChildProps({ elType: "HTMLUListElement" }),
	dataAttributes: [partAttr("menu")],
});

export const menuItem = defineComponentApiSchema<SidebarMenuItemPropsWithoutHTML>({
	title: "MenuItem",
	description: "A semantic sidebar menu list item.",
	props: withChildProps({ elType: "HTMLLiElement" }),
	dataAttributes: [partAttr("menu-item")],
});

export const menuButton = defineComponentApiSchema<SidebarMenuButtonPropsWithoutHTML>({
	title: "MenuButton",
	description: "A sidebar menu button with active, size, and style-variant states.",
	props: {
		isActive: defineBooleanProp({
			default: false,
			description: "Whether the menu destination is active.",
		}),
		size: defineEnumProp({
			options: ["default", "sm", "lg"],
			default: "default",
			definition: SidebarMenuButtonSize,
			description: "The size variant exposed for styling.",
		}),
		variant: defineEnumProp({
			options: ["default", "outline"],
			default: "default",
			definition: SidebarMenuButtonVariant,
			description: "The visual variant exposed for styling.",
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether the button is disabled.",
		}),
		...withChildProps({
			elType: "HTMLButtonElement",
			child: menuButtonChildDefinition,
			children: menuButtonChildrenDefinition,
		}),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "active",
			description: "Present when the menu destination is active.",
		}),
		disabledAttr(),
		defineEnumDataAttr({
			name: "size",
			options: ["default", "sm", "lg"],
			description: "The menu button's size.",
			value: SidebarMenuButtonSize,
		}),
		defineEnumDataAttr({
			name: "variant",
			options: ["default", "outline"],
			description: "The menu button's visual variant.",
			value: SidebarMenuButtonVariant,
		}),
		partAttr("menu-button"),
	],
});

export const menuAction = defineComponentApiSchema<SidebarMenuActionPropsWithoutHTML>({
	title: "MenuAction",
	description: "A secondary action associated with a sidebar menu item.",
	props: {
		disabled: defineBooleanProp({
			default: false,
			description: "Whether the action is disabled.",
		}),
		showOnHover: defineBooleanProp({
			default: false,
			description: "Whether styling should reveal the action only on hover or focus.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		disabledAttr(),
		defineSimpleDataAttr({
			name: "show-on-hover",
			description: "Present when hover-reveal styling is requested.",
		}),
		partAttr("menu-action"),
	],
});

export const menuBadge = defineComponentApiSchema<SidebarMenuBadgePropsWithoutHTML>({
	title: "MenuBadge",
	description: "A badge associated with a sidebar menu item.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [partAttr("menu-badge")],
});

export const menuSkeleton = defineComponentApiSchema<SidebarMenuSkeletonPropsWithoutHTML>({
	title: "MenuSkeleton",
	description: "A presentation container for a loading menu item.",
	props: {
		showIcon: defineBooleanProp({
			default: false,
			description: "Whether icon-placeholder styling should be shown.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "icon",
			description: "Present when icon-placeholder styling is requested.",
		}),
		partAttr("menu-skeleton"),
	],
});

export const menuSub = defineComponentApiSchema<SidebarMenuSubPropsWithoutHTML>({
	title: "MenuSub",
	description: "A semantic nested list within a sidebar menu item.",
	props: withChildProps({ elType: "HTMLUListElement" }),
	dataAttributes: [partAttr("menu-sub")],
});

export const menuSubItem = defineComponentApiSchema<SidebarMenuSubItemPropsWithoutHTML>({
	title: "MenuSubItem",
	description: "A semantic item in a nested sidebar menu.",
	props: withChildProps({ elType: "HTMLLiElement" }),
	dataAttributes: [partAttr("menu-sub-item")],
});

export const menuSubButton = defineComponentApiSchema<SidebarMenuSubButtonPropsWithoutHTML>({
	title: "MenuSubButton",
	description: "A link for a nested sidebar menu destination.",
	props: {
		isActive: defineBooleanProp({
			default: false,
			description: "Whether the nested destination is active.",
		}),
		size: defineEnumProp({
			options: ["sm", "md"],
			default: "md",
			definition: SidebarMenuSubButtonSize,
			description: "The size variant exposed for styling.",
		}),
		...withChildProps({
			elType: "HTMLAnchorElement",
			child: menuButtonChildDefinition,
			children: menuButtonChildrenDefinition,
		}),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "active",
			description: "Present when the nested destination is active.",
		}),
		defineEnumDataAttr({
			name: "size",
			options: ["sm", "md"],
			description: "The nested menu link's size.",
			value: SidebarMenuSubButtonSize,
		}),
		partAttr("menu-sub-button"),
	],
});

export const sidebar = [
	provider,
	root,
	trigger,
	rail,
	inset,
	input,
	header,
	footer,
	separator,
	content,
	group,
	groupLabel,
	groupAction,
	groupContent,
	menu,
	menuItem,
	menuButton,
	menuAction,
	menuBadge,
	menuSkeleton,
	menuSub,
	menuSubItem,
	menuSubButton,
];
