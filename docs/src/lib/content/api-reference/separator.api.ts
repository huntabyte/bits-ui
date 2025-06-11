import type { SeparatorRootPropsWithoutHTML } from "bits-ui";
import { OrientationProp } from "./extended-types/shared/index.js";
import { withChildProps } from "$lib/content/api-reference/shared.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineSimpleDataAttr,
} from "../utils.js";

export const root = defineComponentApiSchema<SeparatorRootPropsWithoutHTML>({
	title: "Root",
	description: "An element used to separate content.",
	props: {
		orientation: defineEnumProp({
			options: ["horizontal", "vertical"],
			default: "horizontal",
			description: "The orientation of the separator.",
			definition: OrientationProp,
		}),
		decorative: defineBooleanProp({
			default: false,
			description:
				"Whether the separator is decorative or not, which will determine if it is announced by screen readers.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineEnumDataAttr({
			name: "orientation",
			description: "The orientation of the separator.",
			options: ["horizontal", "vertical"],
			value: OrientationProp,
		}),
		defineSimpleDataAttr({
			name: "separator-root",
			description: "Present on the root element.",
		}),
	],
});

export const separator = [root];
