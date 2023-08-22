import type { APISchema } from "@/types";
import { asChild } from "./helpers";

export const root: APISchema = {
	title: "Root",
	description:
		"The radio group component used to group radio items under a common name for form submission.",
	props: [
		asChild,
		{
			name: "disabled",
			default: "false",
			type: "boolean",
			description:
				"Whether or not the radio group is disabled. This prevents the user from interacting with it."
		},
		{
			name: "loop",
			default: "false",
			type: "boolean",
			description:
				"Whether or not the radio group should loop through the items when navigating with the arrow keys."
		},
		{
			name: "orientation",
			default: "'vertical'",
			type: "'vertical' | 'horizontal'",
			description: "The orientation of the radio group."
		},
		{
			name: "value",
			type: "string",
			description:
				"The value of the currently selected radio item. This is the value that will be submitted with a form."
		},
		{
			name: "onValueCHange",
			type: "(value: string | undefined) => void",
			description: "A callback that is fired when the radio group's value changes."
		}
	],
	dataAttributes: [
		{
			name: "orientation",
			value: "'vertical' | 'horizontal'",
			description: "The orientation of the radio group."
		}
	]
};
export const item: APISchema = {
	title: "Item",
	description: "An radio item, which must be a child of the `RadioGroup.Root` component.",
	props: [
		asChild,
		{
			name: "disabled",
			default: "false",
			type: "boolean",
			description:
				"Whether or not the radio item is disabled. This prevents the user from interacting with it."
		},
		{
			name: "value",
			type: "string",
			description:
				"The value of the currently selected radio item. This is the value that will be submitted with a form."
		}
	],
	dataAttributes: [
		{
			name: "disabled",
			description: "Present when the radio item is disabled."
		},
		{
			name: "value",
			description: "The value of the radio item."
		},
		{
			name: "state",
			value: "'checked' | 'unchecked'",
			description: "The radio item's checked state."
		},
		{
			name: "orientation",
			value: "'vertical' | 'horizontal'",
			description: "The orientation of the parent radio group."
		}
	]
};

export const input: APISchema = {
	title: "Input",
	description:
		"A hidden input that is used to submit the radio group's value with a form. It can receive all the same props/attributes as a normal HTML input.",
	props: [asChild]
};

export const indicator: APISchema = {
	title: "ItemIndicator",
	description:
		"A component which is used to indicate the radio item's checked state. Any children of this component will only be visible when the radio item is checked."
};

export const radioGroup = [root, item, input, indicator];
