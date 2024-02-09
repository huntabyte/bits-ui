import type { APISchema } from "@/types/index.js";
import {
	arrowProps,
	asChild,
	attrsSlotProp,
	domElProps,
	enums,
	idsSlotProp,
	portalProp,
	transitionProps,
	builderAndAttrsSlotProps,
	onOutsideClickProp,
} from "@/content/api-reference/helpers.js";
import { floatingPositioning } from "./floating.js";
import * as C from "@/content/constants.js";
import type * as Combobox from "$lib/bits/combobox/_types.js";

export const root: APISchema<Combobox.Props> = {
	title: "Root",
	description: "The root combobox component which manages & scopes the state of the select.",
	props: {
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the combobox component is disabled.",
		},
		multiple: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the combobox menu allows multiple selections.",
		},
		preventScroll: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description: "Whether or not to prevent scrolling the body when the menu is open.",
		},
		closeOnEscape: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description: "Whether to close the combobox menu when the escape key is pressed.",
		},
		closeOnOutsideClick: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether to close the combobox menu when a click occurs outside of it.",
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
			description: "The open state of the combobox menu.",
		},
		onOpenChange: {
			type: {
				type: C.FUNCTION,
				definition: "(open: boolean) => void",
			},
			description: "A callback that is fired when the combobox menu's open state changes.",
		},
		selected: {
			type: {
				type: C.OBJECT,
				definition: "{ value: unknown; label?: string }",
			},
			description: "The value of the currently selected item.",
		},
		onSelectedChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: unknown | undefined) => void",
			},
			description: "A callback that is fired when the combobox menu's value changes.",
		},
		portal: { ...portalProp("combobox menu") },
		highlightOnHover: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether or not to highlight the currently hovered item.",
		},
		name: {
			type: C.STRING,
			description: "The name to apply to the hidden input element for form submission.",
		},
		required: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the combobox menu is required.",
		},
		scrollAlignment: {
			default: "'nearest'",
			type: {
				type: C.ENUM,
				definition: enums("nearest", "center"),
			},
			description: "The alignment of the highlighted item when scrolling.",
		},
		inputValue: {
			default: "",
			type: C.STRING,
			description: "The value of the combobox input element.",
		},
		items: {
			type: {
				type: "Selected[]",
				definition: "Array<{ value: T; label?: string }>",
			},
			description: "An array of items to add type-safety to the `onSelectedChange` callback.",
		},
		onOutsideClick: onOutsideClickProp,
	},
	slotProps: { ids: idsSlotProp },
};

export const content: APISchema<Combobox.ContentProps> = {
	title: "Content",
	description: "The element which contains the combobox menu's items.",
	props: { ...transitionProps, ...floatingPositioning, ...domElProps("HTMLDivElement") },
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "combobox-content",
			description: "Present on the content element.",
		},
	],
};

export const item: APISchema<Combobox.ItemProps> = {
	title: "Item",
	description: "A combobox item, which must be a child of the `Combobox.Content` component.",
	props: {
		label: {
			type: C.STRING,
			description: "The label of the select item, which is displayed in the menu.",
		},
		value: {
			type: C.UNKNOWN,
			description: "The value of the select item.",
		},
		disabled: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description:
				"Whether or not the combobox item is disabled. This will prevent interaction/selection.",
		},
		...domElProps("HTMLDivElement"),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			description: "The state of the item.",
			value: enums("selected", "hovered"),
			isEnum: true,
		},
		{
			name: "disabled",
			description: "Present when the item is disabled.",
		},
		{
			name: "combobox-item",
			description: "Present on the item element.",
		},
	],
};

export const input: APISchema = {
	title: "Input",
	description:
		"A representation of the combobox input element, which is typically displayed in the content.",
	props: {
		placeholder: {
			type: C.STRING,
			description: "A placeholder value to display when no value is selected.",
		},
		asChild,
	},
	slotProps: {
		attrs: attrsSlotProp,
		label: {
			type: C.STRING,
			description: "The label of the currently selected item.",
		},
	},
	dataAttributes: [
		{
			name: "select-input",
			description: "Present on the input element.",
		},
	],
};

export const hiddenInput: APISchema<Combobox.InputProps> = {
	title: "hidden-input",
	description:
		"A hidden input element which is used to store the combobox menu's value, used for form submission. It receives the same value as the `Select.Value` component and can receive any props that a normal input element can receive.",
	props: domElProps("HTMLInputElement"),
	slotProps: { ...builderAndAttrsSlotProps },
};

export const label: APISchema<Combobox.LabelProps> = {
	title: "Label",
	description:
		"A label for the combobox input element, which is typically displayed in the content.",
	props: domElProps("HTMLLabelElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "combobox-label",
			description: "Present on the label element.",
		},
	],
};

export const indicator: APISchema<Combobox.IndicatorProps> = {
	title: "Indicator",
	description: "A visual indicator for use between combobox items or groups.",
	props: domElProps("HTMLDivElement"),
	slotProps: {
		attrs: attrsSlotProp,
		isSelected: {
			type: C.BOOLEAN,
			description: "Whether or not the item is selected.",
		},
	},
	dataAttributes: [
		{
			name: "combobox-indicator",
			description: "Present on the indicator element.",
		},
	],
};

export const arrow: APISchema<Combobox.ArrowProps> = {
	title: "Arrow",
	description: "An optional arrow element which points to the selected item when menu open.",
	props: arrowProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "arrow",
			description: "Present on the arrow element.",
		},
	],
};

export const combobox = [root, content, item, input, label, hiddenInput, arrow];
