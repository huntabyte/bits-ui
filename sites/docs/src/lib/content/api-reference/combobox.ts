import type {
	ComboboxArrowPropsWithoutHTML,
	ComboboxContentPropsWithoutHTML,
	ComboboxInputPropsWithoutHTML,
	ComboboxItemPropsWithoutHTML,
	ComboboxGroupLabelPropsWithoutHTML,
	ComboboxRootPropsWithoutHTML,
} from "bits-ui";
import {
	arrowProps,
	asChild,
	attrsSlotProp,
	builderAndAttrsSlotProps,
	childrenSnippet,
	dismissableLayerProps,
	enums,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	idsSlotProp,
	preventOverflowTextSelectionProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<ComboboxRootPropsWithoutHTML> = {
	title: "Root",
	description: "The root combobox component which manages & scopes the state of the combobox.",
	props: {
		type: {
			type: {
				type: C.ENUM,
				definition: enums("single", "multiple"),
			},
			description: "The type of combobox.",
			required: true,
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the combobox component is disabled.",
		},
		value: {
			type: C.STRING,
			default: "",
			description: "The value of the combobox.",
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: string) => void",
			},
			description: "A callback that is fired when the combobox value changes.",
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
		loop: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the combobox menu should loop through items.",
		},
		children: childrenSnippet(),
	},
	slotProps: { ids: idsSlotProp },
};

export const content: APISchema<ComboboxContentPropsWithoutHTML> = {
	title: "Content",
	description: "The element which contains the combobox's items.",
	props: {
		...floatingProps(),
		...escapeLayerProps,
		...dismissableLayerProps,
		...focusScopeProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		dir: {
			type: {
				type: C.ENUM,
				definition: enums("ltr", "rtl"),
			},
			default: "ltr",
			description: "The direction of the combobox.",
		},
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "combobox-content",
			description: "Present on the content element.",
		},
	],
};

export const item: APISchema<ComboboxItemPropsWithoutHTML> = {
	title: "Item",
	description: "A combobox item, which must be a child of the `Combobox.Content` component.",
	props: {
		label: {
			type: C.STRING,
			description: "The label of the item, which is displayed in the menu.",
		},
		value: {
			type: C.UNKNOWN,
			description: "The value of the item.",
		},
		disabled: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description:
				"Whether or not the combobox item is disabled. This will prevent interaction/selection.",
		},
		onHighlight: {
			type: {
				type: C.FUNCTION,
				definition: ") => void",
			},
			description: "A callback that is fired when the item is highlighted.",
		},
		onUnhighlight: {
			type: {
				type: C.FUNCTION,
				definition: ") => void",
			},
			description: "A callback that is fired when the item is unhighlighted.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
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
			name: "highlighted",
			description: "Present when the item is highlighted, via keyboard navigation or hover.",
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
			name: "combobox-input",
			description: "Present on the input element.",
		},
	],
};

export const hiddenInput: APISchema<ComboboxInputPropsWithoutHTML> = {
	title: "HiddenInput",
	description:
		"A hidden input element which is used to store the combobox menu's value, used for form submission. It receives the same value as the `Select.Value` component and can receive any props that a normal input element can receive.",
	props: {
		defaultValue: {
			type: C.STRING,
			default: "",
			description: "The value of the hidden input element.",
		},
		...withChildProps({ elType: "HTMLInputElement" }),
	},
	slotProps: { ...builderAndAttrsSlotProps },
};

export const groupLabel: APISchema<ComboboxGroupLabelPropsWithoutHTML> = {
	title: "Label",
	description:
		"A label for the combobox input element, which is typically displayed in the content.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "combobox-label",
			description: "Present on the label element.",
		},
	],
};

export const arrow: APISchema<ComboboxArrowPropsWithoutHTML> = {
	title: "Arrow",
	description: "An optional arrow element which points to the content when open.",
	props: arrowProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "arrow",
			description: "Present on the arrow element.",
		},
	],
};

export const combobox = [root, content, item, input, groupLabel, hiddenInput, arrow];
