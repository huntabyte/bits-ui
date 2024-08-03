import type { SeparatorRootPropsWithoutHTML } from "bits-ui";
import Orientation from "./extended-types/shared/orientation.md";
import {
	createApiSchema,
	createBooleanProp,
	createEnumProp,
	enums,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

export const root = createApiSchema<SeparatorRootPropsWithoutHTML>({
	title: "Root",
	description: "An element used to separate content.",
	props: {
		orientation: createEnumProp({
			options: ["horizontal", "vertical"],
			default: "'horizontal'",
			description: "The orientation of the separator.",
			definition: Orientation,
		}),
		decorative: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether the separator is decorative or not, which will determine if it is announced by screen readers.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "orientation",
			description: "The orientation of the separator.",
			value: enums("horizontal", "vertical"),
			isEnum: true,
			definition: Orientation,
		},
		{
			name: "separator-root",
			description: "Present on the root element.",
		},
	],
});

export const separator = [root];
