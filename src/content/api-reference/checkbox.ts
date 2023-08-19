import type { APISchema } from "@/types";

export const root: APISchema = {
	title: "Root",
	description: "The button component used to toggle the state of the checkbox.",
	props: [
		{
			name: "disabled",
			default: "false",
			type: "boolean",
			description:
				"Whether or not the checkbox button is disabled. This prevents the user from interacting with it."
		},
		{
			name: "checked",
			default: "false",
			type: "boolean | 'indeterminate'",
			description:
				"The checkbox button's checked state. This can be a boolean or the string 'indeterminate', which would typically display a dash in the checkbox."
		},
		{
			name: "onCheckedChange",
			type: "(checked: boolean | 'indeterminate') => void",
			description: "A callback that is fired when the checkbox button's checked state changes."
		}
	],
	dataAttributes: [
		{
			name: "disabled",
			description: "Present when the checkbox is disabled.",
			value: "''"
		},
		{
			name: "state",
			value: "'checked' | 'unchecked' | 'indeterminate'",
			description: "The checkbox's state. Can be 'checked', 'unchecked', or 'indeterminate'."
		},
		{
			name: "melt-checkbox",
			value: "''",
			description: "Present on the root element of the checkbox."
		}
	]
};

export const input: APISchema = {
	title: "Input",
	description:
		"The hidden input element that is used to store the checkbox's state for form submission. It receives all the same props as a regular HTML input element.",
	props: [
		{
			name: "value",
			default: "false",
			type: "boolean",
			description:
				"Unless a value is provided, the input's value will be a boolean that represents the checkbox's checked state. Indeterminate checkboxes will have a value of `false`."
		},
		{
			name: "disabled",
			default: "false",
			type: "boolean",
			description:
				"Whether or not the checkbox input is disabled. If not provided, it will inherit the disabled state of the Root component, which defaults to false."
		}
	],
	dataAttributes: [
		{
			name: "melt-checkbox-input",
			value: "''",
			description: "Present on the input element."
		}
	]
};

export const indicator: APISchema = {
	title: "Indicator",
	description:
		"A component which passes `isChecked` and `isIndeterminate` slot props to its children. This is useful for rendering the checkbox's indicator icon depending on its state.",
	dataAttributes: [
		{
			name: "melt-checkbox-indicator",
			value: "''",
			description: "Present on the indicator element."
		}
	]
};

export const checkbox = [root, input, indicator];
