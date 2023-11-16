import type { APISchema } from "@/types";
import { asChild, enums } from "@/content/api-reference/helpers.js";
import * as C from "@/content/constants";
import type * as Separator from "$lib/bits/separator/_types";

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
		asChild
	},
	dataAttributes: [
		{
			name: "orientation",
			value: enums("horizontal", "vertical"),
			description: "The orientation of the separator."
		}
	]
};

export const separator = [root];
