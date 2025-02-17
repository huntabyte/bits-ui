import type { ProgressRootPropsWithoutHTML } from "bits-ui";
import {
	createApiSchema,
	createDataAttrSchema,
	createNumberProp,
	createPropSchema,
	withChildProps,
} from "./helpers.js";
import { ProgressStateAttr } from "./extended-types/progress/index.js";

export const root = createApiSchema<ProgressRootPropsWithoutHTML>({
	title: "Root",
	description: "The progress bar component.",
	props: {
		max: createNumberProp({
			default: "100",
			description: "The maximum value of the progress bar.",
		}),
		min: createNumberProp({
			default: "0",
			description: "The minimum value of the progress bar.",
		}),
		value: createPropSchema({
			default: "0",
			description: "The current value of the progress bar. If set to `null` ",
			type: "number | null",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "value",
			description: "The current value of the progress bar.",
		}),
		createDataAttrSchema({
			name: "state",
			definition: ProgressStateAttr,
			description: "The current state of the progress bar.",
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "min",
			description: "The minimum value of the progress bar.",
		}),
		createDataAttrSchema({
			name: "max",
			description: "The maximum value of the progress bar.",
		}),
		createDataAttrSchema({
			name: "indeterminate",
			description: "Present when the value is `null`.",
		}),
		createDataAttrSchema({
			name: "progress-root",
			description: "Present on the root element.",
		}),
	],
});

export const progress = [root];
