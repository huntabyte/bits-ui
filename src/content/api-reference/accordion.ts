import type { APISchema } from "@/types";
import { asChild } from "./helpers";

const root: APISchema = {
	title: "Root",
	description: "The root accordion component used to set and manage the state of the accordion.",
	props: [
		{
			name: "multiple",
			default: "false",
			type: "boolean",
			description: "Whether or not multiple accordion items can be active at the same time."
		},
		{
			name: "disabled",
			default: "false",
			type: "boolean",
			description: "Whether or not the accordion is disabled."
		},
		{
			name: "value",
			type: "string | undefined",
			description: "The active accordion item value."
		},
		{
			name: "onValueChange",
			type: "(value: string | undefined) => void",
			description: "A callback function called when the active accordion item value changes."
		},
		{
			name: "value",
			type: "string | undefined",
			description: "The active accordion item value when `multiple` is true."
		},
		{
			name: "onValueChange",
			type: "(value: string[]) => void",
			description:
				"A callback function called when the active accordion item value changes when `multiple` is true."
		}
	],
	dataAttributes: [
		{
			name: "orientation",
			value: "'horizontal' | 'vertical'",
			description: "The orientation of the accordion."
		},
		{
			name: "melt-accordion",
			value: "",
			description: "Present on the root element."
		}
	]
};

const item: APISchema = {
	title: "Item",
	description: "An accordion item.",
	props: [
		asChild,
		{
			name: "value",
			type: "string",
			description: "The value of the accordion item."
		},
		{
			name: "disabled",
			default: "false",
			type: "boolean",
			description: "Whether or not the accordion item is disabled."
		}
	],
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The state of the accordion item."
		},
		{
			name: "disabled",
			value: "",
			description: "Present when the accordion item is disabled."
		}
	]
};

const trigger: APISchema = {
	title: "Trigger",
	description: "The accordion item trigger, which opens and closes the accordion item.",
	props: [asChild],
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The state of the accordion item."
		},
		{
			name: "disabled",
			value: "",
			description: "Present when the accordion item is disabled."
		},
		{
			name: "value",
			value: "",
			description: "The value of the accordion item."
		}
	]
};

const content: APISchema = {
	title: "Content",
	description: "The accordion item content, which is displayed when the item is open.",
	props: [asChild],
	dataAttributes: [
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The state of the accordion item."
		},
		{
			name: "disabled",
			value: "",
			description: "Present when the accordion item is disabled."
		},
		{
			name: "value",
			value: "",
			description: "The value of the accordion item."
		}
	]
};

export const accordion = [root, item, trigger, content];
