import type { AspectRatioPropsWithoutHTML } from "bits-ui";
import { domElProps } from "./helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

const root: APISchema<AspectRatioPropsWithoutHTML> = {
	title: "Root",
	description: "The aspect ratio component.",
	props: {
		ratio: {
			type: C.NUMBER,
			default: "1",
			description: "The desired aspect ratio.",
		},
		...domElProps("HTMLDivElement"),
	},
	dataAttributes: [
		{
			name: "aspect-ratio-root",
			description: "Present on the element.",
		},
	],
};

export const aspectRatio = [root];
