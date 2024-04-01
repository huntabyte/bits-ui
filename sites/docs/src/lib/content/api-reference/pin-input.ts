import type {
	PinInputHiddenInputPropsWithoutHTML,
	PinInputInputPropsWithoutHTML,
	PinInputPropsWithoutHTML,
} from "bits-ui";
import { builderAndAttrsSlotProps, domElProps, idsSlotProp } from "./helpers.js";
import { enums } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

const root: APISchema<PinInputPropsWithoutHTML> = {
	title: "Root",
	description: "The root component which contains the pin-input.",
	props: {
		placeholder: {
			type: C.STRING,
			default: "○",
			description: "The placeholder character to use for empty pin-inputs.",
		},
		value: {
			type: "string[]",
			description: "The value of the pin-input.",
		},
		name: {
			type: C.STRING,
			description: "The name of the pin-input. This is used for form submission.",
		},
		disabled: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "Whether or not the pin-input is disabled.",
		},
		type: {
			type: enums("text", "password"),
			default: "text",
			description: "The type of the input. Use `password` to mask the input.",
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: string | undefined) => void",
			},
			description: "A callback function called when the pin-input value changes.",
		},
		...domElProps("HTMLDivElement"),
	},
	slotProps: { ...builderAndAttrsSlotProps, ids: idsSlotProp },
	dataAttributes: [
		{
			name: "pin-input-root",
			description: "Present on the root element.",
		},
		{
			name: "complete",
			description: "Present if the pin-input is complete.",
		},
	],
};

const input: APISchema<PinInputInputPropsWithoutHTML> = {
	title: "Input",
	description: "The input component which contains the pin-input.",
	props: domElProps("HTMLInputElement"),
	dataAttributes: [
		{
			name: "pin-input-input",
			description: "Present on the input element.",
		},
		{
			name: "complete",
			description: "Present if the pin-input is complete.",
		},
	],
};

const hiddenInput: APISchema<PinInputHiddenInputPropsWithoutHTML> = {
	title: "HiddenInput",
	description: "The hidden input component which contains the pin-input.",
	props: domElProps("HTMLInputElement"),
	dataAttributes: [
		{
			name: "pin-input-hidden-input",
			description: "Present on the hidden input element.",
		},
	],
};

export const pinInput = [root, input, hiddenInput];
