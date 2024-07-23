import type { LabelRootPropsWithoutHTML } from "bits-ui";
import { builderAndAttrsSlotProps, withChildProps } from "$lib/content/api-reference/helpers.js";
import type { APISchema } from "$lib/types/index.js";
import * as C from "$lib/content/constants.js";

export const root: APISchema<LabelRootPropsWithoutHTML> = {
	title: "Root",
	description: "An enhanced label component that can be used with any input.",
	props: {
		for: {
			type: C.STRING,
			description: "The `for` attribute of the label element.",
			required: true,
		},
		...withChildProps({ elType: "HTMLLabelElement" }),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "label-root",
			description: "Present on the root element.",
		},
	],
};

export const label = [root];
