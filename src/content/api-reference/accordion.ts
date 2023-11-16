import type { APISchema } from "@/types";
import { asChild } from "./helpers";
import * as C from "@/content/constants";
import { union, enums } from "@/content/helpers";

const root: APISchema = {
	title: "Root",
	description: "The root accordion component used to set and manage the state of the accordion.",
	props: [
		{
			name: "multiple",
			default: "false",
			type: C.BOOLEAN,
			description: "Whether or not multiple accordion items can be active at the same time."
		},
		{
			name: "disabled",
			default: "false",
			type: C.BOOLEAN,
			description: "Whether or not the accordion is disabled."
		},
		{
			name: "value",
			type: {
				type: C.UNION,
				definition: union("string", "undefined")
			},
			description: "The active accordion item value."
		},
		{
			name: "onValueChange",
			type: {
				type: C.FUNCTION,
				definition: "(value: string | undefined) => void"
			},
			description: "A callback function called when the active accordion item value changes."
		},
		{
			name: "value",
			type: {
				type: C.UNION,
				definition: union("string[]", "undefined")
			},
			description: "The active accordion item value when `multiple` is true."
		},
		{
			name: "onValueChange",
			type: {
				type: C.FUNCTION,
				definition: "(value: string[] | undefined) => void"
			},
			description:
				"A callback function called when the active accordion item value changes when `multiple` is true."
		}
	],
	dataAttributes: [
		{
			name: "orientation",
			value: enums("horizontal", "vertical"),
			description: "The orientation of the accordion."
		},
		{
			name: "bits-accordion-root",
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
			required: true,
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
			value: enums("open", "closed"),
			description: "The state of the accordion item."
		},
		{
			name: "disabled",
			value: "",
			description: "Present when the accordion item is disabled."
		},
		{
			name: "bits-accordion-item",
			description: "Present on the item element."
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
			value: enums("open", "closed"),
			description: "The state of the accordion item."
		},
		{
			name: "disabled",
			description: "Present when the accordion item is disabled."
		},
		{
			name: "value",
			description: "The value of the accordion item."
		},
		{
			name: "bits-accordion-trigger",
			description: "Present on the trigger element."
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
			value: enums("open", "closed"),
			description: "The state of the accordion item."
		},
		{
			name: "disabled",
			description: "Present when the accordion item is disabled."
		},
		{
			name: "value",
			description: "The value of the accordion item."
		},
		{
			name: "bits-accordion-content",
			description: "Present on the content element."
		}
	]
};

export const accordion = [root, item, trigger, content];
