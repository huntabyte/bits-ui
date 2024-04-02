import type {
	DropdownMenuArrowPropsWithoutHTML,
	DropdownMenuCheckboxIndicatorPropsWithoutHTML,
	DropdownMenuCheckboxItemPropsWithoutHTML,
	DropdownMenuContentPropsWithoutHTML,
	DropdownMenuGroupPropsWithoutHTML,
	DropdownMenuItemPropsWithoutHTML,
	DropdownMenuLabelPropsWithoutHTML,
	DropdownMenuPropsWithoutHTML,
	DropdownMenuRadioGroupPropsWithoutHTML,
	DropdownMenuRadioIndicatorPropsWithoutHTML,
	DropdownMenuRadioItemPropsWithoutHTML,
	DropdownMenuSeparatorPropsWithoutHTML,
	DropdownMenuSubContentPropsWithoutHTML,
	DropdownMenuSubPropsWithoutHTML,
	DropdownMenuSubTriggerPropsWithoutHTML,
	DropdownMenuTriggerPropsWithoutHTML,
} from "bits-ui";
import { focusProp } from "./extended-types/index.js";
import { floatingPositioning } from "./floating.js";
import { builderAndAttrsSlotProps, domElProps, onOutsideClickProp } from "./helpers.js";
import type { APISchema, DataAttrSchema, PropObj } from "$lib/types/index.js";
import * as C from "$lib/content/constants.js";
import {
	attrsSlotProp,
	enums,
	idsSlotProp,
	portalProp,
	transitionProps,
	union,
} from "$lib/content/api-reference/helpers.js";

const props = {
	preventScroll: {
		default: C.TRUE,
		type: C.BOOLEAN,
		description: "Whether or not to prevent scroll on the body when the menu is open.",
	},
	closeOnEscape: {
		default: C.TRUE,
		type: C.BOOLEAN,
		description: "Whether to close the menu when the escape key is pressed.",
	},
	closeOnOutsideClick: {
		type: C.BOOLEAN,
		default: C.TRUE,
		description: "Whether to close the menu when a click occurs outside of it.",
	},
	loop: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description:
			"Whether or not to loop through the menu items when navigating with the keyboard.",
	},
	open: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "The open state of the  menu.",
	},
	onOpenChange: {
		type: {
			type: C.FUNCTION,
			definition: "(open: boolean) => void",
		},
		description: "A callback that is fired when the menu's open state changes.",
	},
	dir: {
		type: {
			type: C.ENUM,
			definition: enums("ltr", "rtl"),
		},
		description: "The direction of the menu.",
	},
	portal: { ...portalProp("menu") },
	closeFocus: {
		type: focusProp,
		description: "Override the focus when the menu is closed.",
	},
	typeahead: {
		type: C.BOOLEAN,
		default: C.TRUE,
		description:
			"Whether or not to enable typeahead functionality. When enabled, the user can type to navigate to menu items.",
	},
	disableFocusFirstItem: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "Whether or not to disable focus on the first item when the menu is opened.",
	},
	closeOnItemClick: {
		type: C.BOOLEAN,
		default: C.TRUE,
		description: "Whether or not to close the menu when an item is clicked.",
	},
	onOutsideClick: onOutsideClickProp,
} satisfies PropObj<DropdownMenuPropsWithoutHTML>;

const subProps = {
	disabled: {
		type: C.BOOLEAN,
		description: "Whether or not the submenu is disabled.",
	},
	open: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "The open state of the submenu.",
	},
	onOpenChange: {
		type: {
			type: C.FUNCTION,
			definition: "(open: boolean) => void",
		},
		description: "A callback that is fired when the submenu's open state changes.",
	},
} satisfies PropObj<DropdownMenuSubPropsWithoutHTML>;

const contentProps = {
	...transitionProps,
	...floatingPositioning,
	...domElProps("HTMLDivElement"),
} satisfies PropObj<DropdownMenuContentPropsWithoutHTML>;

const subContentProps = {
	...transitionProps,
	...floatingPositioning,
	...domElProps("HTMLDivElement"),
} satisfies PropObj<DropdownMenuSubContentPropsWithoutHTML>;

const arrowProps = {
	size: {
		type: C.NUMBER,
		default: "8",
		description: "The height and width of the arrow in pixels.",
	},
	...domElProps("HTMLDivElement"),
} satisfies PropObj<DropdownMenuArrowPropsWithoutHTML>;

const checkboxItemProps = {
	disabled: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description:
			"Whether or not the checkbox menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard.",
	},
	checked: {
		default: C.FALSE,
		type: union("boolean", "'indeterminate'"),
		description: "The checkbox menu item's checked state.",
	},
	onCheckedChange: {
		type: {
			type: C.FUNCTION,
			definition: "(checked: boolean | 'indeterminate') => void",
		},
		description:
			"A callback that is fired when the checkbox menu item's checked state changes.",
	},
	...domElProps("HTMLDivElement"),
} satisfies PropObj<DropdownMenuCheckboxItemPropsWithoutHTML>;

const radioGroupProps = {
	value: {
		type: C.STRING,
		description: "The value of the currently checked radio menu item.",
	},
	onValueChange: {
		type: {
			type: C.FUNCTION,
			definition: "(value: string) => void",
		},
		description: "A callback that is fired when the radio group's value changes.",
	},
	...domElProps("HTMLDivElement"),
} satisfies PropObj<DropdownMenuRadioGroupPropsWithoutHTML>;

const radioItemProps = {
	value: {
		type: C.STRING,
		description:
			"The value of the radio item. When checked, the parent `RadioGroup`'s value will be set to this value.",
		required: true,
	},
	disabled: {
		type: C.FALSE,
		description:
			"Whether or not the radio menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard.",
	},
	...domElProps("HTMLDivElement"),
} satisfies PropObj<DropdownMenuRadioItemPropsWithoutHTML>;

const radioIndicatorProps = {
	...domElProps("HTMLDivElement"),
} satisfies PropObj<DropdownMenuRadioIndicatorPropsWithoutHTML>;

const itemProps = {
	disabled: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "Whether or not the menu item is disabled.",
	},
	href: {
		type: C.STRING,
		description:
			"An optional prop that when passed converts the dropdown item into an anchor tag.",
	},
	...domElProps("HTMLDivElement"),
} satisfies PropObj<DropdownMenuItemPropsWithoutHTML & { href: string }>;

const subTriggerProps = {
	disabled: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "Whether or not the submenu trigger is disabled.",
	},
	...domElProps("HTMLDivElement"),
} satisfies PropObj<DropdownMenuSubTriggerPropsWithoutHTML>;

const triggerProps = domElProps(
	"HTMLButtonElement"
) satisfies PropObj<DropdownMenuTriggerPropsWithoutHTML>;
const groupProps = domElProps(
	"HTMLDivElement"
) satisfies PropObj<DropdownMenuGroupPropsWithoutHTML>;
const labelProps = domElProps(
	"HTMLDivElement"
) satisfies PropObj<DropdownMenuLabelPropsWithoutHTML>;
const separatorProps = domElProps(
	"HTMLDivElement"
) satisfies PropObj<DropdownMenuSeparatorPropsWithoutHTML>;
const checkboxIndicatorProps = {
	...domElProps("HTMLDivElement"),
} satisfies PropObj<DropdownMenuCheckboxIndicatorPropsWithoutHTML>;

const STATE: DataAttrSchema = {
	name: "state",
	value: enums("open", "closed"),
	description: "The open state of the menu or submenu the element controls or belongs to.",
	isEnum: true,
};

type DataAttrs = APISchema["dataAttributes"];

const triggerAttrs: DataAttrs = [
	STATE,
	{
		name: "menu-trigger",
		description: "Present on the trigger element.",
	},
];

const contentAttrs: DataAttrs = [
	STATE,
	{
		name: "menu-content",
		description: "Present on the content element.",
	},
];

const arrowAttrs: DataAttrs = [
	STATE,
	{
		name: "menu-arrow",
		description: "Present on the arrow element.",
	},
];

const sharedItemAttrs: DataAttrs = [
	{
		name: "orientation",
		value: "vertical",
	},
	{
		name: "highlighted",
		description: "Present when the menu item is highlighted.",
	},
	{
		name: "disabled",
		description: "Present when the menu item is disabled.",
	},
];

const itemAttrs: DataAttrs = [
	...sharedItemAttrs,
	{
		name: "menu-item",
		description: "Present on the item element.",
	},
];

const groupAttrs: DataAttrs = [
	{
		name: "menu-group",
		description: "Present on the group element.",
	},
];

const labelAttrs: DataAttrs = [
	{
		name: "menu-label",
		description: "Present on the group label element.",
	},
];

const checkboxItemAttrs: DataAttrs = [
	...sharedItemAttrs,
	{
		name: "state",
		value: enums("checked", "unchecked", "indeterminate"),
		description: "The checkbox menu item's checked state.",
		isEnum: true,
	},
];

const radioGroupAttrs: DataAttrs = [
	{
		name: "menu-radio-group",
		description: "Present on the radio group element.",
	},
];

const radioItemAttrs: DataAttrs = [
	...sharedItemAttrs,
	{
		name: "state",
		value: enums("checked", "unchecked"),
		description: "The radio menu item's checked state.",
		isEnum: true,
	},
	{
		name: "value",
		description: "The value of the radio item.",
	},
	{
		name: "menu-radio-item",
		description: "Present on the radio item element.",
	},
];

const separatorAttrs: DataAttrs = [
	{
		name: "orientation",
		value: "vertical",
		description: "The orientation of the separator.",
	},
	{
		name: "menu-separator",
		description: "Present on the separator element.",
	},
];

const subContentAttrs: DataAttrs = [
	STATE,
	{
		name: "menu-subcontent",
		description: "Present on the submenu content element.",
	},
];

const subTriggerAttrs: DataAttrs = [
	...sharedItemAttrs,
	STATE,
	{
		name: "menu-subtrigger",
		description: "Present on the submenu trigger element.",
	},
];

const checkboxIndicatorAttrs: DataAttrs = [
	{
		name: "menu-checkbox-indicator",
		description: "Present on the checkbox indicator element.",
	},
];

const radioIndicatorAttrs: DataAttrs = [
	{
		name: "menu-radio-indicator",
		description: "Present on the radio indicator element.",
	},
];

export const trigger = {
	props: triggerProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: triggerAttrs,
};

export const content = {
	props: contentProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: contentAttrs,
};

export const arrow = {
	props: arrowProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: arrowAttrs,
};

export const item = {
	props: itemProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: itemAttrs,
};

export const group = {
	props: groupProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: groupAttrs,
};

export const label = {
	props: labelProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: labelAttrs,
};

export const separator = {
	props: separatorProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: separatorAttrs,
};

export const checkboxIndicator = {
	props: checkboxIndicatorProps,
	slotProps: {
		attrs: attrsSlotProp,
		checked: {
			type: C.BOOLEAN,
			description: "Whether or not the checkbox is checked.",
		},
	},
	dataAttributes: checkboxIndicatorAttrs,
};

export const checkboxItem = {
	props: checkboxItemProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: checkboxItemAttrs,
};

export const radioGroup = {
	props: radioGroupProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: radioGroupAttrs,
};

export const radioItem = {
	props: radioItemProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: radioItemAttrs,
};

export const subTrigger = {
	props: subTriggerProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: subTriggerAttrs,
};

export const subContent = {
	props: subContentProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: subContentAttrs,
};

export const radioIndicator = {
	props: radioIndicatorProps,
	slotProps: {
		attrs: attrsSlotProp,
		checked: {
			type: C.BOOLEAN,
			description: "Whether or not the checkbox is checked.",
		},
	},
	dataAttributes: radioIndicatorAttrs,
};

export const sub = {
	props: subProps,
	slotProps: {
		subIds: idsSlotProp,
	},
};

export const root = {
	props,
	slotProps: {
		ids: idsSlotProp,
	},
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
	radioIndicator,
	separator,
	arrow,
	group,
	label,
	sub,
	subTrigger,
	subContent,
};
