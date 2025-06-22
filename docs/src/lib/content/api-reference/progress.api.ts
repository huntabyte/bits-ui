import type { ProgressRootPropsWithoutHTML } from "bits-ui";
import { withChildProps } from "./shared.js";
import { ProgressStateAttr } from "./extended-types/progress/index.js";
import {
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineNumberProp,
	defineSimpleDataAttr,
	defineSimplePropSchema,
} from "../utils.js";

export const root = defineComponentApiSchema<ProgressRootPropsWithoutHTML>({
	title: "Root",
	description: "The progress bar component.",
	props: {
		max: defineNumberProp({
			default: 100,
			description: "The maximum value of the progress bar.",
		}),
		min: defineNumberProp({
			default: 0,
			description: "The minimum value of the progress bar.",
		}),
		value: defineSimplePropSchema({
			default: "0",
			description:
				"The current value of the progress bar. If set to `null` the progress bar will be indeterminate.",
			type: "number | null",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "value",
			description: "The current value of the progress bar.",
		}),
		defineEnumDataAttr({
			name: "state",
			description: "The current state of the progress bar.",
			options: ["indeterminate", "determinate"],
			value: ProgressStateAttr,
		}),
		defineSimpleDataAttr({
			name: "min",
			description: "The minimum value of the progress bar.",
		}),
		defineSimpleDataAttr({
			name: "max",
			description: "The maximum value of the progress bar.",
		}),
		defineSimpleDataAttr({
			name: "indeterminate",
			description: "Present when the value is `null`.",
		}),
		defineSimpleDataAttr({
			name: "progress-root",
			description: "Present on the root element.",
		}),
	],
});

export const progress = [root];
