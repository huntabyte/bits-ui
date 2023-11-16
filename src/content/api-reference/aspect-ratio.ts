import type { APISchema } from "@/types";
import type * as AspectRatio from "$lib/bits/aspect-ratio/_types.js";

export const root: APISchema<AspectRatio.Props> = {
	title: "Root",
	description: "The aspect ratio component.",
	props: {
		ratio: {
			default: "1",
			type: "number",
			description: "The desired aspect ratio."
		}
	}
};

export const aspectRatio = [root];
