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
	onOutsideClickProp
} from "@/content/api-reference/helpers.js";
import { floatingPositioning } from "./floating.js";
import * as C from "@/content/constants.js";
import type * as Select from "$lib/bits/select/_types.js";

export const root: APISchema<Select.Props> = {
	title: "Root",
	description: "The root select component which manages & scopes the state of the select.",
	props: {
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the select menu is disabled."
		},
		multiple: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the select menu allows multiple selections."
		},
		preventScroll: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description: "Whether or not to prevent scrolling the body when the menu is open."
		},
		closeOnEscape: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description: "Whether to close the select menu when the escape key is pressed."
		},
		closeOnOutsideClick: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether to close the select menu when a click occurs outside of it."
		},
		loop: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description:
				"Whether or not to loop through the menu items when navigating with the keyboard."
		},
		open: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "The open state of the select menu."
		},
		onOpenChange: {
			type: {
				type: C.FUNCTION,
				definition: "(open: boolean) => void"
			},
			description: "A callback that is fired when the select menu's open state changes."
		},
		selected: {
			type: {
				type: C.OBJECT,
				definition: "{ value: unknown; label?: string }"
			},
			description: "The value of the currently selected item."
		},
		onSelectedChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: unknown | undefined) => void"
			},
			description: "A callback that is fired when the select menu's value changes."
		},
		portal: { ...portalProp("select menu") },
		highlightOnHover: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether or not to highlight the currently hovered item."
		},
		name: {
			type: C.STRING,
			description: "The name to apply to the hidden input element for form submission."
		},
		required: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the select menu is required."
		},
		scrollAlignment: {
			default: "'nearest'",
			type: {
				type: C.ENUM,
				definition: enums("nearest", "center")
			},
			description: "The alignment of the highlighted item when scrolling."
		},
		typeahead: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description:
				"Whether or not to enable typeahead functionality. When enabled, the user can type to navigate to menu items."
		},
		items: {
			type: {
				type: "Selected[]",
				definition: "Array<{ value: T; label?: string }>"
			},
			description: "An array of items to add type-safety to the `onSelectedChange` callback."
		},
		onOutsideClick: onOutsideClickProp
	},
	slotProps: { ids: idsSlotProp }
};

export const trigger: APISchema<Select.TriggerProps> = {
	title: "Trigger",
	description: "The button element which toggles the select menu's open state.",
	props: domElProps("HTMLButtonElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			isEnum: true,
			description: "The dropdown menu's open state."
		},
		{
			name: "disabled",
			description: "Present when the trigger is disabled."
		},
		{
			name: "select-trigger",
			description: "Present on the trigger element."
		}
	]
};

export const content: APISchema<Select.ContentProps> = {
	title: "Content",
	description: "The content/menu element which contains the select menu's items.",
	props: { ...transitionProps, ...floatingPositioning, ...domElProps("HTMLDivElement") },
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "select-content",
			description: "Present on the content element."
		}
	]
};

export const item: APISchema<Select.ItemProps> = {
	title: "Item",
	description: "A select item, which must be a child of the `Select.Content` component.",
	props: {
		label: {
			type: C.STRING,
			description: "The label of the select item, which is displayed in the menu."
		},
		value: {
			type: C.UNKNOWN,
			description: "The value of the select item."
		},
		disabled: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description:
				"Whether or not the select item is disabled. This will prevent interaction/selection."
		},
		...domElProps("HTMLDivElement")
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			description: "The state of the item.",
			value: enums("selected", "hovered"),
			isEnum: true
		},
		{
			name: "disabled",
			description: "Present when the item is disabled."
		},
		{
			name: "select-item",
			description: "Present on the item element."
		}
	]
};

export const value: APISchema = {
	title: "Value",
	description:
		"A representation of the select menu's value, which is typically displayed in the trigger.",
	props: {
		placeholder: {
			type: C.STRING,
			description: "A placeholder value to display when no value is selected."
		},
		asChild
	},
	slotProps: {
		attrs: attrsSlotProp,
		label: {
			type: C.STRING,
			description: "The label of the currently selected item."
		}
	},
	dataAttributes: [
		{
			name: "select-value",
			description: "Present on the value element."
		}
	]
};

export const input: APISchema<Select.InputProps> = {
	title: "Input",
	description:
		"A hidden input element which is used to store the select menu's value, used for form submission. It receives the same value as the `Select.Value` component and can receive any props that a normal input element can receive.",
	props: domElProps("HTMLInputElement"),
	slotProps: { ...builderAndAttrsSlotProps }
};

export const group: APISchema<Select.GroupProps> = {
	title: "Group",
	description: "An accessible group of select menu items.",
	props: domElProps("HTMLDivElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "select-group",
			description: "Present on the group element."
		}
	]
};

export const label: APISchema<Select.LabelProps> = {
	title: "Label",
	description:
		"A label for the select menu which will be skipped when navigating with the keyboard. This must be a child of the `Select.Group` component to be accessible.",
	props: domElProps("HTMLLabelElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "select-label",
			description: "Present on the label element."
		}
	]
};

export const separator: APISchema<Select.SeparatorProps> = {
	title: "Separator",
	description: "A visual separator for use between select items or groups.",
	props: domElProps("HTMLDivElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "separator-root",
			description: "Present on the separator element."
		}
	]
};

export const indicator: APISchema<Select.IndicatorProps> = {
	title: "Separator",
	description: "A visual separator for use between select items or groups.",
	props: domElProps("HTMLDivElement"),
	slotProps: {
		attrs: attrsSlotProp,
		isSelected: {
			type: C.BOOLEAN,
			description: "Whether or not the item is selected."
		}
	},
	dataAttributes: [
		{
			name: "select-indicator",
			description: "Present on the indicator element."
		}
	]
};

export const arrow: APISchema<Select.ArrowProps> = {
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when open.",
	props: arrowProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "arrow",
			description: "Present on the arrow element."
		}
	]
};

export const select = [root, trigger, content, item, value, group, label, input, separator, arrow];
