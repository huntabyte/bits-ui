import type { ButtonRootPropsWithoutHTML } from "bits-ui";
import { childrenSnippet, refProp } from "./shared.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineSimpleDataAttr,
	defineStringProp,
} from "../utils.js";

export const root = defineComponentApiSchema<
	ButtonRootPropsWithoutHTML & { href: string; disabled: HTMLButtonAttributes["disabled"] }
>({
	title: "Root",
	description:
		"A component that can switch between a button and an anchor tag based on the `href`/`type` props.",
	props: {
		href: defineStringProp({
			description:
				"An optional prop that when passed converts the button into an anchor tag.",
		}),
		disabled: defineBooleanProp({
			description:
				"Whether or not the button is disabled. When disabled, the button cannot be interacted with.",
			default: false,
		}),
		ref: refProp({ elType: "HTMLButtonElement" }),
		children: childrenSnippet(),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "button-root",
			description: "Present on the button element.",
		}),
	],
});

export const button = [root];
