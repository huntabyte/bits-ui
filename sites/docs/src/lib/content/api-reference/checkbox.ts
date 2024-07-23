import type { CheckboxRootPropsWithoutHTML } from "bits-ui";
import { builderAndAttrsSlotProps, enums, union, withChildProps } from "./helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<CheckboxRootPropsWithoutHTML> = {
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
		...withChildProps({ elType: "HTMLButtonElement" }),
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

export const checkbox = [root];
