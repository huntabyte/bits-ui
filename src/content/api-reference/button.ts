import type { APISchema } from "@/types";

export const root: APISchema = {
	title: "Root",
	description:
		"A special button component that can receive Melt UI builders for use with the `asChild` prop.",
	props: [
		{
			name: "builders",
			default: "[]",
			type: "Builder[]",
			description: "An array of melt builders to be applied to the button."
		},
		{
			name: "href",
			type: "string",
			description: "An optional prop that when passed converts the button into an anchor tag."
		}
	]
};

export const button = [root];
