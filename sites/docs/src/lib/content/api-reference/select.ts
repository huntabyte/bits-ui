import type {
	SelectArrowPropsWithoutHTML,
	SelectContentPropsWithoutHTML,
	SelectGroupLabelPropsWithoutHTML,
	SelectGroupPropsWithoutHTML,
	SelectItemPropsWithoutHTML,
	SelectRootPropsWithoutHTML,
	SelectSeparatorPropsWithoutHTML,
	SelectTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	arrowProps,
	childrenSnippet,
	dirProp,
	dismissableLayerProps,
	enums,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<SelectRootPropsWithoutHTML> = {
	title: "Root",
	description: "The root select component which manages & scopes the state of the select.",
	props: {
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the select menu is disabled.",
		},
		autocomplete: {
			type: C.STRING,
			description: "The autocomplete attribute of the select.",
		},
		dir: dirProp,
		form: {
			type: C.STRING,
			description: "The form attribute of the select.",
		},
		value: {
			type: C.STRING,
			description: "The value of the currently selected select item.",
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: string | undefined) => void",
			},
			description: "A callback that is fired when the select menu's value changes.",
		},
		open: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "The open state of the select menu.",
		},
		onOpenChange: {
			type: {
				type: C.FUNCTION,
				definition: "(open: boolean) => void",
			},
			description: "A callback that is fired when the select menu's open state changes.",
		},
		name: {
			type: C.STRING,
			description: "The name to apply to the hidden input element for form submission.",
		},
		required: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the select menu is required.",
		},
		children: childrenSnippet(),
	},
};

export const trigger: APISchema<SelectTriggerPropsWithoutHTML> = {
	title: "Trigger",
	description: "The button element which toggles the select menu's open state.",
	props: {
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the select menu trigger is disabled.",
		},
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			isEnum: true,
			description: "The dropdown menu's open state.",
		},
		{
			name: "disabled",
			description: "Present when the trigger is disabled.",
		},
		{
			name: "select-trigger",
			description: "Present on the trigger element.",
		},
	],
};

export const content: APISchema<SelectContentPropsWithoutHTML> = {
	title: "Content",
	description: "The content/menu element which contains the select menu's items.",
	props: {
		position: {
			type: {
				type: C.ENUM,
				definition: enums("floating", "item-aligned"),
			},
			default: "floating",
			description:
				"The positioning strategy to use for the content. If set to 'item-aligned', the content will be positioned relative to the trigger, similar to a native select. If set to `floating`, the content will use Floating UI to position itself similar to other popover-like components.",
		},
		dir: dirProp,
		...floatingProps(),
		...dismissableLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		preventScroll: preventScrollProp,
		forceMount: forceMountProp,
		loop: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description:
				"Whether or not the select menu should loop through items when reaching the end.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "select-content",
			description: "Present on the content element.",
		},
	],
};

export const item: APISchema<SelectItemPropsWithoutHTML> = {
	title: "Item",
	description: "A select item, which must be a child of the `Select.Content` component.",
	props: {
		textValue: {
			type: C.STRING,
			description: "The text value of the select item, which is used for typeahead purposes.",
		},
		value: {
			type: C.STRING,
			description: "The value of the select item.",
			required: true,
		},
		disabled: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description:
				"Whether or not the select item is disabled. This will prevent interaction/selection.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "state",
			description: "The state of the item.",
			value: enums("selected", "hovered"),
			isEnum: true,
		},
		{
			name: "highlighted",
			description: "Present when the item is highlighted, via keyboard navigation or hover.",
		},
		{
			name: "disabled",
			description: "Present when the item is disabled.",
		},
		{
			name: "select-item",
			description: "Present on the item element.",
		},
	],
};

export const value: APISchema = {
	title: "Value",
	description:
		"A representation of the select menu's value, which is typically displayed in the trigger.",
	props: {
		placeholder: {
			type: C.STRING,
			description: "A placeholder value to display when no value is selected.",
		},
	},
	dataAttributes: [
		{
			name: "select-value",
			description: "Present on the value element.",
		},
		{
			name: "placeholder",
			description:
				"Present when the placeholder is being displayed (there isn't a value selected). You can use this to style the placeholder differently than the selected value.",
		},
	],
};

export const group: APISchema<SelectGroupPropsWithoutHTML> = {
	title: "Group",
	description: "An accessible group of select menu items.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		{
			name: "select-group",
			description: "Present on the group element.",
		},
	],
};

export const groupLabel: APISchema<SelectGroupLabelPropsWithoutHTML> = {
	title: "GroupLabel",
	description:
		"A label for the select menu which will be skipped when navigating with the keyboard. This must be a child of the `Select.Group` component to be accessible.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		{
			name: "select-label",
			description: "Present on the label element.",
		},
	],
};

export const separator: APISchema<SelectSeparatorPropsWithoutHTML> = {
	title: "Separator",
	description: "A visual separator for use between select items or groups.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		{
			name: "separator-root",
			description: "Present on the separator element.",
		},
	],
};

export const arrow: APISchema<SelectArrowPropsWithoutHTML> = {
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when open.",
	props: arrowProps,
	dataAttributes: [
		{
			name: "arrow",
			description: "Present on the arrow element.",
		},
	],
};

export const select = [root, trigger, content, item, value, group, groupLabel, separator, arrow];
