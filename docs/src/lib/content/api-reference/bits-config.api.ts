import { PortalToProp } from "./extended-types/portal/index.js";
import { childrenSnippet, createApiSchema, createStringProp, createUnionProp } from "./helpers.js";
import type { BitsConfigProps } from "bits-ui";

export const bitsConfig = createApiSchema<BitsConfigProps>({
	title: "BitsConfig",
	type: "utility",
	description:
		"A global context provider for configuring default props across all Bits UI components.",
	props: {
		defaultPortalTo: createUnionProp({
			definition: PortalToProp,
			options: ["string", "HTMLElement", "null", "undefined"],
			description: `Where to render the content when it is open. Defaults to the body. Can be disabled by passing \`null\`.`,
			default: "body",
		}),
		defaultLocale: createStringProp({
			description: "The default locale to use for the app.",
			default: "en",
		}),
		children: childrenSnippet(),
	},
});
