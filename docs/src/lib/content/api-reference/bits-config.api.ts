import { defineStringProp, defineUtilityApiSchema } from "../utils.js";
import { childrenSnippet, portalToProp } from "./shared.js";
import type { BitsConfigProps } from "bits-ui";

export const bitsConfig = defineUtilityApiSchema<BitsConfigProps>({
	title: "BitsConfig",
	description:
		"A global context provider for configuring default props across all Bits UI components.",
	props: {
		defaultPortalTo: portalToProp,
		defaultLocale: defineStringProp({
			description: "The default locale to use for the app.",
			default: "en",
		}),
		children: childrenSnippet(),
	},
});
