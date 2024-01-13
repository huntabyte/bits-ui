import type { APISchema } from "@/types/index.js";
import { enums, builderAndAttrsSlotProps, domElProps } from "@/content/api-reference/helpers.js";
import * as C from "@/content/constants.js";
import type * as Separator from "$lib/bits/separator/_types.js";

export const root: APISchema<Separator.Props> = {
	title: "Root",
	description: "An element used to separate content.",
	props: {
		orientation: {
			type: {
				type: C.ENUM,
				definition: enums("horizontal", "vertical")
			},
			default: "'horizontal'",
			description: "The orientation of the separator."
		},
		decorative: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description:
				"Whether the separator is decorative or not, which will determine if it is announce by screen readers."
		},
		...domElProps("HTMLDivElement")
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "orientation",
			description: "The orientation of the separator.",
			value: enums("horizontal", "vertical"),
			isEnum: true
		},
		{
			name: "separator-root",
			description: "Present on the root element."
		}
	]
};

export const separator = [root];
