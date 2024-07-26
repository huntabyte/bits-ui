import type { ProgressRootPropsWithoutHTML } from "bits-ui";
import { createApiSchema, createNumberProp, withChildProps } from "./helpers.js";
import { enums } from "$lib/content/api-reference/helpers.js";

export const root = createApiSchema<ProgressRootPropsWithoutHTML>({
	title: "Root",
	description: "The progress bar component.",
	props: {
		max: createNumberProp({
			default: "100",
			description:
				"The maximum value of the progress bar. Used to calculate the percentage of the progress bar.",
		}),
		value: createNumberProp({
			default: "0",
			description: "The current value of the progress bar.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "value",
			description: "The current value of the progress bar.",
		},
		{
			name: "state",
			description: "The current state of the progress bar.",
			value: enums("indeterminate", "complete", "loading"),
			isEnum: true,
		},
		{
			name: "max",
			description: "The maximum value of the progress bar.",
		},
		{
			name: "progress-root",
			description: "Present on the root element.",
		},
	],
});

export const progress = [root];
