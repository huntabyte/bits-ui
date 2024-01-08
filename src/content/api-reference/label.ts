import type { APISchema } from "@/types";
import { builderAndAttrsSlotProps, domElProps } from "@/content/api-reference/helpers.js";
import type * as Label from "$lib/bits/label/_types";

export const root: APISchema<Label.Props> = {
	title: "Root",
	description: "An enhanced label component that can be used with any input.",
	props: domElProps("HTMLLabelElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "label-root",
			description: "Present on the root element."
		}
	]
};

export const label = [root];
