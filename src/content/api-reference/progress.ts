import type { APISchema } from "@/types/index.js";
import { asChild } from "./helpers.js";

export const root: APISchema = {
	title: "Root",
	description: "The progress bar component.",
	props: [
		asChild,
		{
			name: "max",
			type: "number",
			default: "100",
			description:
				"The maximum value of the progress bar. Used to calculate the percentage of the progress bar."
		},
		{
			name: "value",
			type: "number",
			default: "0",
			description: "The current value of the progress bar."
		},
		{
			name: "onValueChange",
			type: "(value: number) => void",
			description: "A callback that fires when the value changes."
		}
	],
	dataAttributes: [
		{
			name: "value",
			description: "The current value of the progress bar."
		},
		{
			name: "state",
			description: "The current state of the progress bar.",
			value: "'indeterminate' | 'complete' | 'loading'"
		},
		{
			name: "max",
			description: "The maximum value of the progress bar."
		}
	]
};

export const progress = [root];
