import type { LabelRootPropsWithoutHTML } from "bits-ui";
import {
	createApiSchema,
	createStringProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";

export const root = createApiSchema<LabelRootPropsWithoutHTML>({
	title: "Root",
	description: "An enhanced label component that can be used with any input.",
	props: {
		for: createStringProp({
			description: "The `for` attribute of the label element.",
			required: true,
		}),
		...withChildProps({ elType: "HTMLLabelElement" }),
	},
	dataAttributes: [
		{
			name: "label-root",
			description: "Present on the root element.",
		},
	],
});

export const label = [root];
