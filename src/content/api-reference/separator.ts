import type { APISchema } from "@/types";
import { asChild } from "./helpers";

export const root: APISchema = {
	title: "Root",
	description: "An element used to separate content.",
	props: [
		asChild,
		{
			name: "orientation",
			type: "'horizontal' | 'vertical'",
			description: "The orientation of the separator.",
			default: "'horizontal'"
		},
		{
			name: "decorative",
			type: "boolean",
			description:
				"Whether the separator is decorative or not, which will determine if it is announce by screen readers.",
			default: "false"
		}
	],
	dataAttributes: [
		{
			name: "orientation",
			value: "'horizontal' | 'vertical'",
			description: "The orientation of the separator."
		}
	]
};

export const separator = [root];
