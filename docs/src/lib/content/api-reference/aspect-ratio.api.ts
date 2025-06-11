import type { AspectRatioRootPropsWithoutHTML } from "bits-ui";
import { withChildProps } from "./shared.js";
import { defineComponentApiSchema, defineNumberProp, defineSimpleDataAttr } from "../utils.js";

const root = defineComponentApiSchema<AspectRatioRootPropsWithoutHTML>({
	title: "Root",
	description: "The aspect ratio component.",
	props: {
		ratio: defineNumberProp({
			description: "The desired aspect ratio.",
			default: 1,
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "aspect-ratio-root",
			description: "Present on the root element.",
		}),
	],
});

export const aspectRatio = [root];
