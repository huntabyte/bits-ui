import type { APISchema } from "@/types";

export const root: APISchema = {
	title: "Root",
	description: "The aspect ratio component.",
	props: [
		{
			name: "ratio",
			default: "1",
			type: "number",
			description: "The desired aspect ratio."
		}
	]
};

export const aspectRatio = [root];
