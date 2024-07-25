import type { SwitchRootPropsWithoutHTML, SwitchThumbPropsWithoutHTML } from "bits-ui";
import { withChildProps } from "./helpers.js";
import { enums } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

const root: APISchema<SwitchRootPropsWithoutHTML> = {
	title: "Root",
	description: "The root switch component used to set and manage the state of the switch.",
	props: {
		checked: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the switch is checked.",
			bindable: true,
		},
		onCheckedChange: {
			type: {
				type: C.FUNCTION,
				definition: "(checked: boolean) => void",
			},
			description: "A callback function called when the checked state of the switch changes.",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the switch is disabled.",
		},
		name: {
			type: C.STRING,
			description:
				"The name of the hidden input element, used to identify the input in form submissions.",
		},
		required: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the switch is required to be checked.",
		},
		value: {
			type: C.STRING,
			description:
				"The value of the hidden input element to be used in form submissions when the switch is checked.",
		},
		...withChildProps({ elType: "HTMLButtonElement" }),
	},

	dataAttributes: [
		{
			name: "state",
			description: "The switch's checked state.",
			value: enums("checked", "unchecked"),
			isEnum: true,
		},
		{
			name: "checked",
			description: "Present when the switch is checked.",
		},
		{
			name: "disabled",
			description: "Present when the switch is disabled.",
		},
		{
			name: "switch-root",
			description: "Present on the root element.",
		},
	],
};

const thumb: APISchema<SwitchThumbPropsWithoutHTML> = {
	title: "Thumb",
	description: "The thumb on the switch used to indicate the switch's state.",
	props: withChildProps({ elType: "HTMLSpanElement" }),

	dataAttributes: [
		{
			name: "state",
			description: "The switch's checked state.",
			value: enums("checked", "unchecked"),
			isEnum: true,
		},
		{
			name: "checked",
			description: "Present when the switch is checked.",
		},
		{
			name: "switch-thumb",
			description: "Present on the thumb element.",
		},
	],
};

export const switchData = [root, thumb];
