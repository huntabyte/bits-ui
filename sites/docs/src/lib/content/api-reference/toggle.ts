import type { ToggleRootPropsWithoutHTML } from "bits-ui";
import {
	createApiSchema,
	createBooleanProp,
	createFunctionProp,
	enums,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const root = createApiSchema<ToggleRootPropsWithoutHTML>({
	title: "Root",
	description: "The toggle button.",
	props: {
		pressed: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the toggle button is pressed.",
			bindable: true,
		}),
		onPressedChange: createFunctionProp({
			definition: "(checked: boolean) => void",
			description: "A callback function called when the pressed state of the toggle changes.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is disabled.",
		}),
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
});

export const toggle = [root];
