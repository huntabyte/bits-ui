import type { APISchema } from "@/types";
import type * as AspectRatio from "$lib/bits/aspect-ratio/_types.js";
import * as C from "@/content/constants";

export const root: APISchema<AspectRatio.Props> = {
	title: "Root",
	description: "The aspect ratio component.",
	props: {
		ratio: {
			type: C.NUMBER,
			default: "1",
			description: "The desired aspect ratio."
		}
	}
};

export const aspectRatio = [root];
