import type { ToggleRootPropsWithoutHTML } from "bits-ui";
import { enums, withChildProps } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

const root: APISchema<ToggleRootPropsWithoutHTML> = {
	title: "Root",
	description: "The toggle button.",
	props: {
		pressed: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the toggle button is pressed.",
			bindable: true,
		},
		onPressedChange: {
			type: {
				type: C.FUNCTION,
				definition: "(checked: boolean) => void",
			},
			description: "A callback function called when the pressed state of the toggle changes.",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the switch is disabled.",
		},
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		{
			name: "state",
			description: "Whether the toggle is in the on or off state.",
			value: enums("on", "off"),
			isEnum: true,
		},
		{
			name: "disabled",
			description: "Present when the toggle is disabled.",
		},
		{
			name: "toggle-root",
			description: "Present on the root element.",
		},
	],
};

export const toggle = [root];
