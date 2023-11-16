import type { PropObj } from "@/types";
import { floatingConfigProp, focusProp } from "./extended-types";
import {
	asChild,
	transitionProps,
	portalProp,
	enums,
	union
} from "@/content/api-reference/helpers.js";
import type * as Menu from "$lib/bits/menu/_types";
import * as C from "@/content/constants";

export const props = {
	preventScroll: {
		default: C.TRUE,
		type: C.BOOLEAN,
		description: "Whether or not to prevent scroll on the body when the menu is open."
	},
	closeOnEscape: {
		default: C.TRUE,
		type: C.BOOLEAN,
		description: "Whether to close the menu when the escape key is pressed."
	},
	closeOnOutsideClick: {
		type: C.BOOLEAN,
		default: C.TRUE,
		description: "Whether to close the menu when a click occurs outside of it."
	},
	loop: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "Whether or not to loop through the menu items when navigating with the keyboard."
	},
	open: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "The open state of the  menu."
	},
	onOpenChange: {
		type: {
			type: C.FUNCTION,
			definition: "(open: boolean) => void"
		},
		description: "A callback that is fired when the menu's open state changes."
	},
	positioning: {
		type: floatingConfigProp,
		description: "The positioning configuration for the  menu. (docs coming soon)"
	},
	dir: {
		type: {
			type: C.ENUM,
			definition: enums("ltr", "rtl")
		},
		description: "The direction of the menu."
	},
	portal: { ...portalProp("menu") },
	closeFocus: {
		type: focusProp,
		description: "Override the focus when the menu is closed."
	},
	typeahead: {
		type: C.BOOLEAN,
		default: C.TRUE,
		description:
			"Whether or not to enable typeahead functionality. When enabled, the user can type to navigate to menu items."
	},
	disableFocusFirstItem: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "Whether or not to disable focus on the first item when the menu is opened."
	}
} satisfies PropObj<Menu.Props>;

export const subProps = {
	disabled: {
		type: C.BOOLEAN,
		description: "Whether or not the submenu is disabled."
	},
	positioning: {
		type: floatingConfigProp,
		description: "The positioning configuration for the submenu."
	},
	open: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "The open state of the submenu."
	},
	onOpenChange: {
		type: {
			type: C.FUNCTION,
			definition: "(open: boolean) => void"
		},
		description: "A callback that is fired when the submenu's open state changes."
	}
} satisfies PropObj<Menu.SubProps>;

export const contentProps = {
	...transitionProps,
	sideOffset: {
		type: C.NUMBER,
		default: "0",
		description: "The amount of offset to apply to the menu's position on the x-axis."
	},
	asChild
} satisfies PropObj<Menu.ContentProps>;

export const subContentProps = {
	...transitionProps,
	asChild,
	sideOffset: {
		type: C.NUMBER,
		default: "0",
		description: "The amount of offset to apply to the menu's position on the x-axis."
	}
} satisfies PropObj<Menu.SubContentProps>;

export const arrowProps = {
	asChild,
	size: {
		type: C.NUMBER,
		default: "8",
		description: "The height and width of the arrow in pixels."
	}
} satisfies PropObj<Menu.ArrowProps>;

export const checkboxItemProps = {
	disabled: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description:
			"Whether or not the checkbox menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard."
	},
	checked: {
		default: C.FALSE,
		type: union("boolean", "'indeterminate'"),
		description: "The checkbox menu item's checked state."
	},
	onCheckedChange: {
		type: {
			type: C.FUNCTION,
			definition: "(checked: boolean | 'indeterminate') => void"
		},
		description: "A callback that is fired when the checkbox menu item's checked state changes."
	},
	asChild
} satisfies PropObj<Menu.CheckboxItemProps>;

export const radioGroupProps = {
	value: {
		type: C.STRING,
		description: "The value of the currently checked radio menu item."
	},
	onValueChange: {
		type: {
			type: C.FUNCTION,
			definition: "(value: string) => void"
		},
		description: "A callback that is fired when the radio group's value changes."
	},
	asChild
} satisfies PropObj<Menu.RadioGroupProps>;

export const radioItemProps = {
	value: {
		type: C.STRING,
		description:
			"The value of the radio item. When checked, the parent `RadioGroup`'s value will be set to this value.",
		required: true
	},
	disabled: {
		type: C.FALSE,
		description:
			"Whether or not the radio menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard."
	},
	asChild
} satisfies PropObj<Menu.RadioItemProps>;

export const itemProps = {
	asChild,
	disabled: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "Whether or not the menu item is disabled."
	},
	href: {
		type: C.STRING,
		description: "An optional prop that when passed converts the dropdown item into an anchor tag."
	}
} satisfies PropObj<Menu.ItemProps & { href: string }>;

export const subTriggerProps = {
	disabled: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "Whether or not the submenu trigger is disabled."
	},
	asChild
} satisfies PropObj<Menu.SubTriggerProps>;

export const triggerProps = { asChild } satisfies PropObj<Menu.TriggerProps>;
export const groupProps = { asChild } satisfies PropObj<Menu.GroupProps>;
export const labelProps = { asChild } satisfies PropObj<Menu.LabelProps>;
export const separatorProps = { asChild } satisfies PropObj<Menu.SeparatorProps>;
export const checkboxIndicatorProps = {
	asChild
} satisfies PropObj<Menu.CheckboxItemIndicatorProps>;
