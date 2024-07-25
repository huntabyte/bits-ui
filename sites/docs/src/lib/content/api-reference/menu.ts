import type {
	DropdownMenuCheckboxItemPropsWithoutHTML,
	DropdownMenuContentPropsWithoutHTML,
	DropdownMenuGroupPropsWithoutHTML,
	DropdownMenuItemPropsWithoutHTML,
	DropdownMenuLabelPropsWithoutHTML,
	DropdownMenuRootPropsWithoutHTML,
	DropdownMenuRadioGroupPropsWithoutHTML,
	DropdownMenuRadioItemPropsWithoutHTML,
	DropdownMenuSeparatorPropsWithoutHTML,
	DropdownMenuSubContentPropsWithoutHTML,
	DropdownMenuSubPropsWithoutHTML,
	DropdownMenuSubTriggerPropsWithoutHTML,
	DropdownMenuTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	arrowProps,
	childrenSnippet,
	createBooleanProp,
	createFunctionProp,
	createStringProp,
	createUnionProp,
	dirProp,
	dismissableLayerProps,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	preventOverflowTextSelectionProp,
	withChildProps,
} from "./helpers.js";
import type { APISchema, DataAttrSchema, PropObj } from "$lib/types/index.js";
import * as C from "$lib/content/constants.js";
import { enums, union } from "$lib/content/api-reference/helpers.js";

const sharedItemProps = {
	textValue: createStringProp({
		description: "The text value of the checkbox menu item. This is used for typeahead.",
	}),
	onSelect: createFunctionProp({
		definition: "() => void",
		description: "A callback that is fired when the menu item is selected.",
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
} as const;

const props = {
	open: createBooleanProp({
		default: C.FALSE,
		description: "The open state of the  menu.",
		bindable: true,
	}),
	onOpenChange: createFunctionProp({
		definition: "(open: boolean) => void",
		description: "A callback that is fired when the menu's open state changes.",
	}),
	dir: dirProp,
	children: childrenSnippet(),
} satisfies PropObj<DropdownMenuRootPropsWithoutHTML>;

const subProps = {
	open: createBooleanProp({
		default: C.FALSE,
		description: "The open state of the submenu.",
		bindable: true,
	}),
	onOpenChange: createFunctionProp({
		definition: "(open: boolean) => void",
		description: "A callback that is fired when the submenu's open state changes.",
	}),
	children: childrenSnippet(),
} satisfies PropObj<DropdownMenuSubPropsWithoutHTML>;

const contentProps = {
	...floatingProps(),
	...escapeLayerProps,
	...dismissableLayerProps,
	...focusScopeProps,
	forceMount: forceMountProp,
	preventOverflowTextSelection: preventOverflowTextSelectionProp,
	dir: dirProp,
	loop: createBooleanProp({
		default: C.FALSE,
		description:
			"Whether or not to loop through the menu items in when navigating with the keyboard.",
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
} satisfies PropObj<DropdownMenuContentPropsWithoutHTML>;

const subContentProps = contentProps satisfies PropObj<
	Omit<DropdownMenuSubContentPropsWithoutHTML, "style">
>;

const checkboxItemProps = {
	disabled: createBooleanProp({
		default: C.FALSE,
		description:
			"Whether or not the checkbox menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard.",
	}),
	checked: createUnionProp({
		options: ["boolean", "'indeterminate'"],
		default: C.FALSE,
		description: "The checkbox menu item's checked state.",
		bindable: true,
	}),
	onCheckedChange: createFunctionProp({
		definition: "(checked: boolean | 'indeterminate') => void",
		description:
			"A callback that is fired when the checkbox menu item's checked state changes.",
	}),
	...sharedItemProps,
} satisfies PropObj<DropdownMenuCheckboxItemPropsWithoutHTML>;

const radioGroupProps = {
	value: createStringProp({
		description: "The value of the currently checked radio menu item.",
		bindable: true,
	}),
	onValueChange: createFunctionProp({
		definition: "(value: string) => void",
		description: "A callback that is fired when the radio group's value changes.",
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
} satisfies PropObj<DropdownMenuRadioGroupPropsWithoutHTML>;

const radioItemProps = {
	value: createStringProp({
		description:
			"The value of the radio item. When checked, the parent `RadioGroup`'s value will be set to this value.",
		required: true,
	}),
	disabled: createBooleanProp({
		description:
			"Whether or not the radio menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard.",
		default: C.FALSE,
	}),
	...sharedItemProps,
} satisfies PropObj<DropdownMenuRadioItemPropsWithoutHTML>;

const itemProps = {
	disabled: createBooleanProp({
		default: C.FALSE,
		description: "Whether or not the menu item is disabled.",
	}),
	...sharedItemProps,
} satisfies PropObj<DropdownMenuItemPropsWithoutHTML>;

const subTriggerProps = {
	disabled: createBooleanProp({
		default: C.FALSE,
		description: "Whether or not the submenu trigger is disabled.",
	}),
	...sharedItemProps,
} satisfies PropObj<DropdownMenuSubTriggerPropsWithoutHTML>;

const triggerProps = {
	disabled: createBooleanProp({
		default: C.FALSE,
		description: "Whether or not the menu trigger is disabled.",
	}),
	...withChildProps({ elType: "HTMLButtonElement" }),
} satisfies PropObj<DropdownMenuTriggerPropsWithoutHTML>;

const groupProps = withChildProps({
	elType: "HTMLDivElement",
}) satisfies PropObj<DropdownMenuGroupPropsWithoutHTML>;

const labelProps = withChildProps({
	elType: "HTMLDivElement",
}) satisfies PropObj<DropdownMenuLabelPropsWithoutHTML>;

const separatorProps = withChildProps({
	elType: "HTMLDivElement",
}) satisfies PropObj<DropdownMenuSeparatorPropsWithoutHTML>;

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

export const trigger = {
	props: triggerProps,
	dataAttributes: triggerAttrs,
};

export const content = {
	props: contentProps,
	dataAttributes: contentAttrs,
};

export const arrow = {
	props: arrowProps,
	dataAttributes: arrowAttrs,
};

export const item = {
	props: itemProps,
	dataAttributes: itemAttrs,
};

export const group = {
	props: groupProps,
	dataAttributes: groupAttrs,
};

export const label = {
	props: labelProps,
	dataAttributes: labelAttrs,
};

export const separator = {
	props: separatorProps,
	dataAttributes: separatorAttrs,
};

export const checkboxItem = {
	props: checkboxItemProps,
	dataAttributes: checkboxItemAttrs,
};

export const radioGroup = {
	props: radioGroupProps,
	dataAttributes: radioGroupAttrs,
};

export const radioItem = {
	props: radioItemProps,
	dataAttributes: radioItemAttrs,
};

export const subTrigger = {
	props: subTriggerProps,
	dataAttributes: subTriggerAttrs,
};

export const subContent = {
	props: subContentProps,
	dataAttributes: subContentAttrs,
};

export const sub = {
	props: subProps,
};

export const root = {
	props,
};

export const menu = {
	root,
	trigger,
	content,
	item,
	checkboxItem,
	radioGroup,
	radioItem,
	separator,
	arrow,
	group,
	label,
	sub,
	subTrigger,
	subContent,
};
