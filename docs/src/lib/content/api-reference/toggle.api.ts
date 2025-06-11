import type { ToggleRootPropsWithoutHTML } from "bits-ui";
import {
	ToggleRootOnPressedChangeProp,
	ToggleRootStateDataAttr,
} from "./extended-types/toggle/index.js";
import { withChildProps } from "$lib/content/api-reference/shared.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineFunctionProp,
	defineSimpleDataAttr,
} from "../utils.js";

const root = defineComponentApiSchema<ToggleRootPropsWithoutHTML>({
	title: "Root",
	description: "The toggle button.",
	props: {
		pressed: defineBooleanProp({
			default: false,
			description: "Whether or not the toggle button is pressed.",
			bindable: true,
		}),
		onPressedChange: defineFunctionProp({
			definition: ToggleRootOnPressedChangeProp,
			description: "A callback function called when the pressed state of the toggle changes.",
			stringDefinition: "(pressed: boolean) => void",
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the switch is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		defineEnumDataAttr({
			name: "state",
			description: "Whether the toggle is in the on or off state.",
			options: ["on", "off"],
			value: ToggleRootStateDataAttr,
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the toggle is disabled.",
		}),
		defineSimpleDataAttr({
			name: "toggle-root",
			description: "Present on the root element.",
		}),
	],
});

export const toggle = [root];
