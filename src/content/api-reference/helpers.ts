import type { PropSchema } from "@/types";
import { focusProp } from "./extended-types";

export const asChild = {
	type: "boolean",
	default: "false",
	description: "Whether to use [render delegation](/docs/delegation) with this component or not."
};

const transitionProp: PropSchema = {
	type: {
		type: "function",
		definition: "(node: Element, params?: any) => TransitionConfig"
	},
	description: "A Svelte transition function to use when transitioning the content in and out."
};

const transitionConfigProp: PropSchema = {
	type: "object",
	description: "The Svelte `TransitionConfig` object to apply to the transition."
};

export const transitionProps = {
	transition: transitionProp,
	transitionConfig: transitionConfigProp,
	inTransition: transitionProp,
	inTransitionConfig: transitionConfigProp,
	outTransition: transitionProp,
	outTransitionConfig: transitionConfigProp
};

export function portalProp(compName: string) {
	return {
		type: {
			type: "union",
			definition: union("string", "HTMLElement", "null", "undefined")
		},
		description: `Where to render the ${compName} when it is open. Defaults to the body. Can be disabled by passing \`null\``
	};
}

export const portal = {
	type: "union",
	definition: ""
};

export function union(...types: string[]): string {
	return types.join(" | ");
}

export function enums(...values: string[]): string {
	return values.map((value) => `'${value}'`).join(" | ");
}

export const menuProps = {
	preventScroll: {
		default: "true",
		type: "boolean",
		description: "Whether or not to prevent scroll on the body when the menu is open."
	},
	closeOnEscape: {
		default: "true",
		type: "boolean",
		description: "Whether to close the menu when the escape key is pressed."
	},
	closeOnOutsideClick: {
		type: "boolean",
		default: "true",
		description: "Whether to close the menu when a click occurs outside of it."
	},
	loop: {
		type: "boolean",
		default: "false",
		description: "Whether or not to loop through the menu items when navigating with the keyboard."
	},
	open: {
		type: "boolean",
		default: "false",
		description: "The open state of the  menu."
	},
	onOpenChange: {
		type: "(open: boolean) => void",
		description: "A callback that is fired when the menu's open state changes."
	},
	positioning: {
		type: "FloatingConfig",
		description: "The positioning configuration for the  menu. (docs coming soon)"
	},
	dir: {
		type: "'ltr' | 'rtl'",
		description: "The direction of the context menu."
	},
	portal: { ...portalProp("context menu") },
	closeFocus: {
		type: focusProp,
		description: "Override the focus when the menu is closed."
	},
	typeahead: {
		type: "boolean",
		default: "true",
		description:
			"Whether or not to enable typeahead functionality. When enabled, the user can type to navigate to menu items."
	},
	disableFocusFirstItem: {
		type: "boolean",
		default: "false",
		description:
			"Whether or not to disable focus on the first item when the context menu is opened."
	}
} as const;

export const submenuProps = {
	disabled: {
		type: "boolean",
		description: "Whether or not the submenu is disabled."
	},
	positioning: {
		type: "FloatingConfig",
		description: "The positioning configuration for the submenu."
	},
	open: {
		type: "boolean",
		default: "false",
		description: "The open state of the submenu."
	},
	onOpenChange: {
		type: "(open: boolean) => void",
		description: "A callback that is fired when the submenu's open state changes."
	}
} as const;

export const menuContentProps = {
	...transitionProps,
	sideOffset: {
		type: "number",
		default: "0",
		description: "The amount of offset to apply to the context menu's position on the x-axis."
	},
	asChild
} as const;

export const menuSubContentProps = {
	...transitionProps,
	asChild
} as const;

export const arrowProps = {
	asChild,
	size: {
		type: "number",
		default: "8",
		description: "The height and width of the arrow in pixels."
	}
} as const;

export const menuCheckboxItemProps = {
	disabled: {
		type: "boolean",
		default: "false",
		description:
			"Whether or not the checkbox menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard."
	},
	checked: {
		default: "false",
		type: "boolean | 'indeterminate'",
		description: "The checkbox menu item's checked state."
	},
	onCheckedChange: {
		type: "(checked: boolean | 'indeterminate') => void",
		description: "A callback that is fired when the checkbox menu item's checked state changes."
	},
	asChild
} as const;

export const menuRadioGroupProps = {
	value: {
		type: "string",
		description: "The value of the currently checked radio menu item."
	},
	onValueChange: {
		type: "(value: string) => void",
		description: "A callback that is fired when the radio group's value changes."
	},
	asChild
} as const;

export const menuRadioItemProps = {
	value: {
		type: "string",
		description:
			"The value of the radio item. When checked, the parent `RadioGroup`'s value will be set to this value."
	},
	disabled: {
		type: "false",
		description:
			"Whether or not the radio menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard."
	},
	asChild
} as const;

export const menuItemProps = {
	asChild,
	disabled: {
		type: "boolean",
		default: "false",
		description: "Whether or not the menu item is disabled."
	},
	href: {
		type: "string",
		description: "An optional prop that when passed converts the dropdown item into an anchor tag."
	},
	walnut: {
		type: "hello",
		description: "yolo"
	}
} as const;

export const menuSubProps = {
	disabled: {
		type: "boolean",
		description: "Whether or not the submenu is disabled."
	},
	positioning: {
		type: "FloatingConfig",
		description: "The positioning configuration for the submenu."
	},
	open: {
		type: "boolean",
		default: "false",
		description: "The open state of the submenu."
	},
	onOpenChange: {
		type: "(open: boolean) => void",
		description: "A callback that is fired when the submenu's open state changes."
	}
} as const;

export const menuSubTriggerProps = {
	disabled: {
		type: "boolean",
		default: "false",
		description: "Whether or not the submenu trigger is disabled."
	},
	asChild
} as const;
