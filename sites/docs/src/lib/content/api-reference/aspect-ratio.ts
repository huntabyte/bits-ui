import type { AspectRatioPropsWithoutHTML } from "bits-ui";
import { createApiSchema, createNumberProp, withChildProps } from "./helpers.js";

const root = createApiSchema<AspectRatioPropsWithoutHTML>({
	title: "Root",
	description: "The aspect ratio component.",
	props: {
		ratio: createNumberProp({
			description: "The desired aspect ratio.",
			default: "1",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

export const aspectRatio = [root];
