import type { LabelRootPropsWithoutHTML } from "bits-ui";
import { withChildProps } from "$lib/content/api-reference/shared.js";
import { defineComponentApiSchema, defineSimpleDataAttr } from "../utils.js";

export const root = defineComponentApiSchema<LabelRootPropsWithoutHTML>({
	title: "Root",
	description: "An enhanced label component that can be used with any input.",
	props: withChildProps({ elType: "HTMLLabelElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "label-root",
			description: "Present on the root element.",
		}),
	],
});

export const label = [root];
