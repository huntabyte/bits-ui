import type { SeparatorRootPropsWithoutHTML } from "bits-ui";
import { enums, withChildProps } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<SeparatorRootPropsWithoutHTML> = {
	title: "Root",
	description: "An element used to separate content.",
	props: {
		orientation: {
			type: {
				type: C.ENUM,
				definition: enums("horizontal", "vertical"),
			},
			default: "'horizontal'",
			description: "The orientation of the separator.",
		},
		decorative: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description:
				"Whether the separator is decorative or not, which will determine if it is announce by screen readers.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "orientation",
			description: "The orientation of the separator.",
			value: enums("horizontal", "vertical"),
			isEnum: true,
		},
		{
			name: "separator-root",
			description: "Present on the root element.",
		},
	],
};

export const separator = [root];
