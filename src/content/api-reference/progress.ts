import type { APISchema } from "@/types/index.js";
import { enums } from "@/content/api-reference/helpers.js";
import * as C from "@/content/constants.js";
import type * as Progress from "$lib/bits/progress/_types.js";
import { builderAndAttrsSlotProps, domElProps } from "./helpers";

export const root: APISchema<Progress.Props> = {
	title: "Root",
	description: "The progress bar component.",
	props: {
		max: {
			type: C.NUMBER,
			default: "100",
			description:
				"The maximum value of the progress bar. Used to calculate the percentage of the progress bar."
		},
		value: {
			type: C.NUMBER,
			default: "0",
			description: "The current value of the progress bar."
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: number) => void"
			},
			description: "A callback that fires when the value changes."
		},
		...domElProps("HTMLDivElement")
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "value",
			description: "The current value of the progress bar."
		},
		{
			name: "state",
			description: "The current state of the progress bar.",
			value: enums("indeterminate", "complete", "loading"),
			isEnum: true
		},
		{
			name: "max",
			description: "The maximum value of the progress bar."
		},
		{
			name: "progress-root",
			description: "Present on the root element."
		}
	]
};

export const progress = [root];
