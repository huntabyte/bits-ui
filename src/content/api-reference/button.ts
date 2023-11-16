import type { APISchema } from "@/types";
import type * as Button from "$lib/bits/button/_types";

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
			type: "string",
			description: "An optional prop that when passed converts the button into an anchor tag."
		}
	}
};

export const button = [root];
