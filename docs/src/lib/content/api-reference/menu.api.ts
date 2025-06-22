import type {
	DropdownMenuCheckboxGroupPropsWithoutHTML,
	DropdownMenuCheckboxItemPropsWithoutHTML,
	DropdownMenuContentPropsWithoutHTML,
	DropdownMenuContentStaticPropsWithoutHTML,
	DropdownMenuGroupHeadingPropsWithoutHTML,
	DropdownMenuGroupPropsWithoutHTML,
	DropdownMenuItemPropsWithoutHTML,
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
import {
	arrowProps,
	checkboxChildDefinition,
	checkboxChildrenDefinition,
	checkedProp,
	childrenSnippet,
	dirProp,
	dismissibleLayerProps,
	escapeLayerProps,
	floatingContentChildDefinition,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	indeterminateProp,
	onCheckedChangeProp,
	onIndeterminateChangeProp,
	onOpenChangeCompleteProp,
	onOpenChangeProp,
	openChildDefinition,
	portalProps,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	radioGroupItemChildDefinition,
	radioGroupItemChildrenDefinition,
	withChildProps,
} from "./shared.js";
import {
	NoopProp,
	OnStringValueChangeProp,
	OpenClosedProp,
} from "./extended-types/shared/index.js";
import { MenuCheckedStateAttr } from "./extended-types/menu/index.js";
import { RadioGroupStateAttr } from "./extended-types/radio-group/index.js";
import { CheckboxGroupOnValueChangeProp } from "./extended-types/checkbox/index.js";
import type { ComponentAPISchema, PropObj } from "$lib/types/index.js";
import { omit } from "$lib/utils/omit.js";
import {
	defineBooleanProp,
	defineEnumDataAttr,
	defineFunctionProp,
	defineSimpleDataAttr,
	defineStringProp,
	defineSimplePropSchema,
} from "../utils.js";

const sharedItemProps = {
	textValue: defineStringProp({
		description: "The text value of the checkbox menu item. This is used for typeahead.",
	}),
	onSelect: defineFunctionProp({
		definition: NoopProp,
		description: "A callback that is fired when the menu item is selected.",
		stringDefinition: "() => void",
	}),
	closeOnSelect: defineBooleanProp({
		default: true,
		description: "Whether or not the menu item should close when selected.",
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
} as const;

const props = {
	open: defineBooleanProp({
		default: false,
		description: "The open state of the  menu.",
		bindable: true,
	}),
	onOpenChange: onOpenChangeProp,
	onOpenChangeComplete: onOpenChangeCompleteProp,
	dir: dirProp,
	children: childrenSnippet(),
} satisfies PropObj<DropdownMenuRootPropsWithoutHTML>;

const subProps = {
	open: defineBooleanProp({
		default: false,
		description: "The open state of the submenu.",
		bindable: true,
	}),
	onOpenChange: onOpenChangeProp,
	onOpenChangeComplete: onOpenChangeCompleteProp,
	children: childrenSnippet(),
} satisfies PropObj<DropdownMenuSubPropsWithoutHTML>;

const contentProps = {
	...floatingProps(),
	...escapeLayerProps,
	...dismissibleLayerProps,
	...focusScopeProps,
	forceMount: forceMountProp,
	preventOverflowTextSelection: preventOverflowTextSelectionProp,
	dir: dirProp,
	loop: defineBooleanProp({
		default: false,
		description:
			"Whether or not to loop through the menu items in when navigating with the keyboard.",
	}),
	...withChildProps({
		elType: "HTMLDivElement",
		child: floatingContentChildDefinition,
	}),
} satisfies PropObj<DropdownMenuContentPropsWithoutHTML>;

const contentStaticProps = {
	...escapeLayerProps,
	...dismissibleLayerProps,
	...focusScopeProps,
	preventScroll: preventScrollProp,
	forceMount: forceMountProp,
	preventOverflowTextSelection: preventOverflowTextSelectionProp,
	dir: dirProp,
	loop: defineBooleanProp({
		default: false,
		description:
			"Whether or not to loop through the menu items in when navigating with the keyboard.",
	}),
	...withChildProps({
		elType: "HTMLDivElement",
		child: openChildDefinition,
	}),
} satisfies PropObj<DropdownMenuContentStaticPropsWithoutHTML>;

const subContentProps = contentProps satisfies PropObj<
	Omit<DropdownMenuSubContentPropsWithoutHTML, "style">
>;

const subContentStaticProps = {
	...escapeLayerProps,
	...dismissibleLayerProps,
	...focusScopeProps,
	forceMount: forceMountProp,
	preventOverflowTextSelection: preventOverflowTextSelectionProp,
	dir: dirProp,
	loop: defineBooleanProp({
		default: true,
		description:
			"Whether or not to loop through the menu items when reaching the end of the list when using the keyboard.",
	}),
	...withChildProps({
		elType: "HTMLDivElement",
		child: openChildDefinition,
	}),
} satisfies PropObj<DropdownMenuSubContentStaticPropsWithoutHTML>;

const checkboxItemProps = {
	disabled: defineBooleanProp({
		default: false,
		description:
			"Whether or not the checkbox menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard.",
	}),
	checked: checkedProp,
	onCheckedChange: onCheckedChangeProp,
	indeterminate: indeterminateProp,
	onIndeterminateChange: onIndeterminateChangeProp,
	value: defineStringProp({
		description: "The value of the checkbox item when used in a `*Menu.CheckboxGroup`.",
	}),
	...omit(sharedItemProps, "child", "children"),
	...withChildProps({
		elType: "HTMLDivElement",
		children: checkboxChildrenDefinition,
		child: checkboxChildDefinition,
	}),
} satisfies PropObj<DropdownMenuCheckboxItemPropsWithoutHTML>;

const checkboxGroupProps = {
	value: defineSimplePropSchema({
		description:
			"The value of the group. This is an array of the values of the checked checkboxes within the group.",
		bindable: true,
		default: "[]",
		type: "string[]",
	}),
	onValueChange: defineFunctionProp({
		definition: CheckboxGroupOnValueChangeProp,
		description: "A callback that is fired when the checkbox group's value state changes.",
		stringDefinition: "(value: string[]) => void",
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
} satisfies PropObj<DropdownMenuCheckboxGroupPropsWithoutHTML>;

const radioGroupProps = {
	value: defineStringProp({
		description: "The value of the currently checked radio menu item.",
		bindable: true,
	}),
	onValueChange: defineFunctionProp({
		definition: OnStringValueChangeProp,
		description: "A callback that is fired when the radio group's value changes.",
		stringDefinition: "(value: string) => void",
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
} satisfies PropObj<DropdownMenuRadioGroupPropsWithoutHTML>;

const radioItemProps = {
	value: defineStringProp({
		description:
			"The value of the radio item. When checked, the parent `RadioGroup`'s value will be set to this value.",
		required: true,
	}),
	disabled: defineBooleanProp({
		description:
			"Whether or not the radio menu item is disabled. Disabled items cannot be interacted with and are skipped when navigating with the keyboard.",
		default: false,
	}),
	...omit(sharedItemProps, "child", "children"),
	...withChildProps({
		elType: "HTMLDivElement",
		children: radioGroupItemChildrenDefinition,
		child: radioGroupItemChildDefinition,
	}),
} satisfies PropObj<DropdownMenuRadioItemPropsWithoutHTML>;

const itemProps = {
	disabled: defineBooleanProp({
		default: false,
		description: "Whether or not the menu item is disabled.",
	}),
	...sharedItemProps,
} satisfies PropObj<DropdownMenuItemPropsWithoutHTML>;

const subTriggerProps = {
	disabled: defineBooleanProp({
		default: false,
		description: "Whether or not the submenu trigger is disabled.",
	}),
	...omit(sharedItemProps, "closeOnSelect"),
} satisfies PropObj<DropdownMenuSubTriggerPropsWithoutHTML>;

const triggerProps = {
	disabled: defineBooleanProp({
		default: false,
		description: "Whether or not the menu trigger is disabled.",
	}),
	...withChildProps({ elType: "HTMLButtonElement" }),
} satisfies PropObj<DropdownMenuTriggerPropsWithoutHTML>;

const groupProps = withChildProps({
	elType: "HTMLDivElement",
}) satisfies PropObj<DropdownMenuGroupPropsWithoutHTML>;

const groupHeadingProps = withChildProps({
	elType: "HTMLDivElement",
}) satisfies PropObj<DropdownMenuGroupHeadingPropsWithoutHTML>;

const separatorProps = withChildProps({
	elType: "HTMLDivElement",
}) satisfies PropObj<DropdownMenuSeparatorPropsWithoutHTML>;

const STATE = defineEnumDataAttr({
	name: "state",
	value: OpenClosedProp,
	options: ["open", "closed"],
	description: "The open state of the menu or submenu the element controls or belongs to.",
});

type DataAttrs = ComponentAPISchema["dataAttributes"];

const triggerAttrs: DataAttrs = [
	STATE,
	defineSimpleDataAttr({
		name: "menu-trigger",
		description: "Present on the trigger element.",
	}),
];

const contentAttrs: DataAttrs = [
	STATE,
	defineSimpleDataAttr({
		name: "menu-content",
		description: "Present on the content element.",
	}),
];

const arrowAttrs: DataAttrs = [
	STATE,
	defineSimpleDataAttr({
		name: "menu-arrow",
		description: "Present on the arrow element.",
	}),
];

const sharedItemAttrs: DataAttrs = [
	defineSimpleDataAttr({
		name: "orientation",
		value: "vertical",
		description: "The orientation of the menu.",
	}),
	defineSimpleDataAttr({
		name: "highlighted",
		description: "Present when the menu item is highlighted.",
	}),
	defineSimpleDataAttr({
		name: "disabled",
		description: "Present when the menu item is disabled.",
	}),
];

const itemAttrs: DataAttrs = [
	...sharedItemAttrs,
	defineSimpleDataAttr({
		name: "menu-item",
		description: "Present on the item element.",
	}),
];

const groupAttrs: DataAttrs = [
	defineSimpleDataAttr({
		name: "menu-group",
		description: "Present on the group element.",
	}),
];

const labelAttrs: DataAttrs = [
	defineSimpleDataAttr({
		name: "menu-group-heading",
		description: "Present on the group heading element.",
	}),
];

const checkboxGroupAttrs: DataAttrs = [
	defineSimpleDataAttr({
		name: "menu-checkbox-group",
		description: "Present on the checkbox group element.",
	}),
];

const checkboxItemAttrs: DataAttrs = [
	...sharedItemAttrs,
	defineEnumDataAttr({
		name: "state",
		value: MenuCheckedStateAttr,
		options: ["checked", "unchecked", "indeterminate"],
		description: "The checkbox menu item's checked state.",
	}),
];

const radioGroupAttrs: DataAttrs = [
	defineSimpleDataAttr({
		name: "menu-radio-group",
		description: "Present on the radio group element.",
	}),
];

const radioItemAttrs: DataAttrs = [
	...sharedItemAttrs,
	defineEnumDataAttr({
		name: "state",
		value: RadioGroupStateAttr,
		options: ["checked", "unchecked"],
		description: "The radio menu item's checked state.",
	}),
	defineSimpleDataAttr({
		name: "value",
		description: "The value of the radio item.",
	}),
	defineSimpleDataAttr({
		name: "menu-radio-item",
		description: "Present on the radio item element.",
	}),
];

const separatorAttrs: DataAttrs = [
	defineSimpleDataAttr({
		name: "orientation",
		value: "vertical",
		description: "The orientation of the separator.",
	}),
	defineSimpleDataAttr({
		name: "menu-separator",
		description: "Present on the separator element.",
	}),
];

const subContentAttrs: DataAttrs = [
	STATE,
	defineSimpleDataAttr({
		name: "menu-sub-content",
		description: "Present on the submenu content element.",
	}),
];

const subTriggerAttrs: DataAttrs = [
	...sharedItemAttrs,
	STATE,
	defineSimpleDataAttr({
		name: "menu-sub-trigger",
		description: "Present on the submenu trigger element.",
	}),
];

export const trigger = {
	props: triggerProps,
	dataAttributes: triggerAttrs,
};

export const content = {
	props: contentProps,
	dataAttributes: contentAttrs,
};

export const contentStatic = {
	props: contentStaticProps,
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
	props: groupHeadingProps,
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

export const subContentStatic = {
	props: subContentStaticProps,
	dataAttributes: subContentAttrs,
};

export const sub = {
	props: subProps,
};

export const root = {
	props,
};

const portal = {
	props: portalProps,
};

const checkboxGroup = {
	props: checkboxGroupProps,
	dataAttributes: checkboxGroupAttrs,
};

export const menu = {
	root,
	trigger,
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
	label,
	sub,
	subTrigger,
	subContent,
	subContentStatic,
	portal,
};
