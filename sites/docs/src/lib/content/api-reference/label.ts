import type { LabelPropsWithoutHTML } from "bits-ui";
import { builderAndAttrsSlotProps, domElProps } from "$lib/content/api-reference/helpers.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<LabelPropsWithoutHTML> = {
	title: "Root",
	description: "An enhanced label component that can be used with any input.",
	props: domElProps("HTMLLabelElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "label-root",
			description: "Present on the root element.",
		},
	],
};

export const label = [root];
