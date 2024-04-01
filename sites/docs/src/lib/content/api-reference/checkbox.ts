import type { CheckboxIndicatorPropsWithoutHTML, CheckboxPropsWithoutHTML } from "bits-ui";
import { attrsSlotProp, builderAndAttrsSlotProps, domElProps, enums, union } from "./helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<CheckboxPropsWithoutHTML> = {
	title: "Root",
	description: "The button component used to toggle the state of the checkbox.",
	props: {
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description:
				"Whether or not the checkbox button is disabled. This prevents the user from interacting with it.",
		},
		checked: {
			default: C.FALSE,
			type: {
				type: C.ENUM,
				definition: union("boolean", "'indeterminate'"),
			},
			description:
				"The checkbox button's checked state. This can be a boolean or the string 'indeterminate', which would typically display a dash in the checkbox.",
		},
		onCheckedChange: {
			type: {
				type: C.FUNCTION,
				definition: "(checked: boolean | 'indeterminate') => void",
			},
			description:
				"A callback that is fired when the checkbox button's checked state changes.",
		},
		required: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the checkbox is required.",
		},
		name: {
			type: C.STRING,
			description: "The name of the checkbox. This is used for form submission.",
		},
		value: {
			type: C.STRING,
			description: "The value of the checkbox. This is used for form submission.",
		},
		...domElProps("HTMLButtonElement"),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "disabled",
			description: "Present when the checkbox is disabled.",
		},
		{
			name: "state",
			value: enums("checked", "unchecked", "indeterminate"),
			description: "The checkbox's state. Can be 'checked', 'unchecked', or 'indeterminate'.",
			isEnum: true,
		},
		{
			name: "checkbox-root",
			description: "Present on the root element.",
		},
	],
};

export const input: APISchema = {
	title: "Input",
	description:
		"The hidden input element that is used to store the checkbox's state for form submission. It receives all the same props as a regular HTML input element.",
	props: {
		value: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description:
				"Unless a value is provided, the input's value will be a boolean that represents the checkbox's checked state. Indeterminate checkboxes will have a value of `false`.",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description:
				"Whether or not the checkbox input is disabled. If not provided, it will inherit the disabled state of the Root component, which defaults to false.",
		},
	},
};

export const indicator: APISchema<CheckboxIndicatorPropsWithoutHTML> = {
	title: "Indicator",
	description:
		"A component which passes `isChecked` and `isIndeterminate` slot props to its children. This is useful for rendering the checkbox's indicator icon depending on its state.",
	props: domElProps("HTMLDivElement"),
	slotProps: {
		isChecked: {
			type: C.BOOLEAN,
			description: "Whether or not the checkbox is checked.",
		},
		isIndeterminate: {
			type: C.BOOLEAN,
			description: "Whether or not the checkbox is indeterminate.",
		},
		attrs: attrsSlotProp,
	},
	dataAttributes: [
		{
			name: "checkbox-indicator",
			description: "Present on the indicator element.",
		},
	],
};

export const checkbox = [root, input, indicator];
