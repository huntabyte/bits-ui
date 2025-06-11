import type { MeterRootPropsWithoutHTML } from "bits-ui";
import { withChildProps } from "./shared.js";
import { defineComponentApiSchema, defineNumberProp, defineStringDataAttr } from "../utils.js";

export const root = defineComponentApiSchema<MeterRootPropsWithoutHTML>({
	title: "Root",
	description: "The meter component.",
	props: {
		max: defineNumberProp({
			default: 100,
			description: "The maximum value of the meter.",
		}),
		min: defineNumberProp({
			default: 0,
			description: "The minimum value of the meter.",
		}),
		value: defineNumberProp({
			default: 0,
			description: "The current value of the meter.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineStringDataAttr({
			name: "value",
			description: "The current value of the meter.",
		}),
		defineStringDataAttr({
			name: "min",
			description: "The minimum value of the meter.",
		}),
		defineStringDataAttr({
			name: "max",
			description: "The maximum value of the meter.",
		}),
		defineStringDataAttr({
			name: "meter-root",
			description: "Present on the root element.",
		}),
	],
});

export const meter = [root];
