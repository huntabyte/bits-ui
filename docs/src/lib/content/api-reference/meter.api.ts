import type { MeterRootPropsWithoutHTML } from "bits-ui";
import {
	createApiSchema,
	createDataAttrSchema,
	createNumberProp,
	createPropSchema,
	withChildProps,
} from "./helpers.js";

export const root = createApiSchema<MeterRootPropsWithoutHTML>({
	title: "Root",
	description: "The meter component.",
	props: {
		max: createNumberProp({
			default: "100",
			description: "The maximum value of the meter.",
		}),
		min: createNumberProp({
			default: "0",
			description: "The minimum value of the meter.",
		}),
		value: createPropSchema({
			default: "0",
			description: "The current value of the meter.",
			type: "number",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "value",
			description: "The current value of the meter.",
		}),
		createDataAttrSchema({
			name: "min",
			description: "The minimum value of the meter.",
		}),
		createDataAttrSchema({
			name: "max",
			description: "The maximum value of the meter.",
		}),
		createDataAttrSchema({
			name: "meter-root",
			description: "Present on the root element.",
		}),
	],
});

export const meter = [root];
