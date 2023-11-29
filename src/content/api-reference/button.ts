import type { APISchema } from "@/types";
import type * as Button from "$lib/bits/button/_types";
import * as C from "@/content/constants";

export const root: APISchema<Button.Props & { href: string }> = {
	title: "Root",
	description:
		"A special button component that can receive Melt UI builders for use with the `asChild` prop.",
	props: {
		builders: {
			default: "[]",
			type: "Builder[]",
			description: "An array of melt builders to be applied to the button."
		},
		href: {
			type: C.STRING,
			description: "An optional prop that when passed converts the button into an anchor tag."
		}
	},
	dataAttributes: [
		{
			name: "button-root",
			description: "Present on the button element."
		}
	]
};

export const button = [root];
