import type { APISchema, PropObj } from "@/types";
import { focusProp } from "./extended-types/index.js";
import { floatingPositioning } from "./floating.js";
import {
	asChild,
	transitionProps,
	portalProp,
	enums,
	union
} from "@/content/api-reference/helpers.js";
import type * as Menu from "$lib/bits/menu/_types";
import * as C from "@/content/constants";

const props = {
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

const subProps = {
	disabled: {
		type: C.BOOLEAN,
		description: "Whether or not the submenu is disabled."
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

const contentProps = {
	...transitionProps,
	...floatingPositioning,
	asChild
} satisfies PropObj<Menu.ContentProps>;

const subContentProps = {
	...transitionProps,
	...floatingPositioning,
	asChild
} satisfies PropObj<Menu.SubContentProps>;

const arrowProps = {
	asChild,
	size: {
		type: C.NUMBER,
		default: "8",
		description: "The height and width of the arrow in pixels."
	}
} satisfies PropObj<Menu.ArrowProps>;

const checkboxItemProps = {
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

const radioGroupProps = {
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

const radioItemProps = {
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

const itemProps = {
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

const subTriggerProps = {
	disabled: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "Whether or not the submenu trigger is disabled."
	},
	asChild
} satisfies PropObj<Menu.SubTriggerProps>;

const triggerProps = { asChild } satisfies PropObj<Menu.TriggerProps>;
const groupProps = { asChild } satisfies PropObj<Menu.GroupProps>;
const labelProps = { asChild } satisfies PropObj<Menu.LabelProps>;
const separatorProps = { asChild } satisfies PropObj<Menu.SeparatorProps>;
const checkboxIndicatorProps = {
	asChild
} satisfies PropObj<Menu.CheckboxItemIndicatorProps>;

const STATE = {
	name: "state",
	value: enums("open", "closed"),
	description: "The open state of the menu or submenu the element controls or belongs to."
};

type DataAttrs = APISchema["dataAttributes"];

const triggerAttrs: DataAttrs = [
	STATE,
	{
		name: "bits-menu-trigger",
		description: "Present on the trigger element."
	}
];

const contentAttrs: DataAttrs = [
	STATE,
	{
		name: "bits-menu-content",
		description: "Present on the content element."
	}
];

const arrowAttrs: DataAttrs = [
	STATE,
	{
		name: "bits-menu-arrow",
		description: "Present on the arrow element."
	}
];

const sharedItemAttrs: DataAttrs = [
	{
		name: "orientation",
		value: "vertical"
	},
	{
		name: "highlighted",
		description: "Present when the menu item is highlighted."
	},
	{
		name: "disabled",
		description: "Present when the menu item is disabled."
	}
];

const itemAttrs: DataAttrs = [
	...sharedItemAttrs,
	{
		name: "bits-menu-item",
		description: "Present on the item element."
	}
];

const groupAttrs: DataAttrs = [
	{
		name: "bits-menu-group",
		description: "Present on the group element."
	}
];

const labelAttrs: DataAttrs = [
	{
		name: "bits-menu-label",
		description: "Present on the group label element."
	}
];

const checkboxItemAttrs: DataAttrs = [
	...sharedItemAttrs,
	{
		name: "state",
		value: enums("checked", "unchecked", "indeterminate"),
		description: "The checkbox menu item's checked state."
	}
];

const radioGroupAttrs: DataAttrs = [
	{
		name: "bits-menu-radio-group",
		description: "Present on the radio group element."
	}
];

const radioItemAttrs: DataAttrs = [
	...sharedItemAttrs,
	{
		name: "state",
		value: enums("checked", "unchecked"),
		description: "The radio menu item's checked state."
	},
	{
		name: "value",
		description: "The value of the radio item."
	},
	{
		name: "bits-menu-radio-item",
		description: "Present on the radio item element."
	}
];

const separatorAttrs: DataAttrs = [
	{
		name: "orientation",
		value: "vertical",
		description: "The orientation of the separator."
	},
	{
		name: "bits-menu-separator",
		description: "Present on the separator element."
	}
];

const subContentAttrs: DataAttrs = [
	STATE,
	{
		name: "bits-menu-sub-content",
		description: "Present on the submenu content element."
	}
];

const subTriggerAttrs: DataAttrs = [
	...sharedItemAttrs,
	STATE,
	{
		name: "bits-menu-sub-trigger",
		description: "Present on the submenu trigger element."
	}
];

const checkboxIndicatorAttrs: DataAttrs = [
	{
		name: "bits-menu-checkbox-indicator",
		description: "Present on the checkbox indicator element."
	}
];

const radioIndicatorAttrs: DataAttrs = [
	{
		name: "bits-menu-radio-indicator",
		description: "Present on the radio indicator element."
	}
];

export const trigger = {
	props: triggerProps,
	dataAttributes: triggerAttrs
};

export const content = {
	props: contentProps,
	dataAttributes: contentAttrs
};

export const arrow = {
	props: arrowProps,
	dataAttributes: arrowAttrs
};

export const item = {
	props: itemProps,
	dataAttributes: itemAttrs
};

export const group = {
	props: groupProps,
	dataAttributes: groupAttrs
};

export const label = {
	props: labelProps,
	dataAttributes: labelAttrs
};

export const separator = {
	props: separatorProps,
	dataAttributes: separatorAttrs
};

export const checkboxIndicator = {
	props: checkboxIndicatorProps,
	dataAttributes: checkboxIndicatorAttrs
};

export const checkboxItem = {
	props: checkboxItemProps,
	dataAttributes: checkboxItemAttrs
};

export const radioGroup = {
	props: radioGroupProps,
	dataAttributes: radioGroupAttrs
};

export const radioItem = {
	props: radioItemProps,
	dataAttributes: radioItemAttrs
};

export const subTrigger = {
	props: subTriggerProps,
	dataAttributes: subTriggerAttrs
};

export const subContent = {
	props: subContentProps,
	dataAttributes: subContentAttrs
};

export const sub = {
	props: subProps
};

export const root = {
	props,
	dataAttributes: [...triggerAttrs, ...contentAttrs]
};

export const menu = {
	root,
	trigger,
	content,
	item,
	checkboxItem,
	checkboxIndicator,
	radioGroup,
	radioItem,
	separator,
	arrow,
	group,
	label,
	sub,
	subTrigger,
	subContent
};
