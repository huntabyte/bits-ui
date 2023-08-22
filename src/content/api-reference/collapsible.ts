import type { APISchema } from "@/types";
import { asChild } from "./helpers";

export const root: APISchema = {
	title: "Root",
	description: "The root collapsible container which manages the state of the collapsible.",
	props: [
		{
			name: "disabled",
			default: "false",
			type: "boolean",
			description:
				"Whether or not the collapsible is disabled. This prevents the user from interacting with it."
		},
		{
			name: "open",
			default: "false",
			type: "boolean",
			description:
				"The open state of the collapsible. The content will be visible when this is true, and hidden when it's false."
		},
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "A callback that is fired when the collapsible's open state changes."
		}
	],
	dataAttributes: [
		{
			name: "disabled",
			description: "Present when the checkbox is disabled.",
			value: "''"
		},
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The collapsible's open state."
		}
	]
};

export const trigger: APISchema = {
	title: "Trigger",
	description: "The button responsible for toggling the collapsible's open state.",
	props: [asChild],
	dataAttributes: [
		{
			name: "disabled",
			description: "Present when the checkbox is disabled.",
			value: "''"
		},
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The collapsible's open state."
		}
	]
};

export const content: APISchema = {
	title: "Content",
	description: "The content displayed when the collapsible is open.",
	props: [asChild],
	dataAttributes: [
		{
			name: "disabled",
			description: "Present when the checkbox is disabled.",
			value: "''"
		},
		{
			name: "state",
			value: "'open' | 'closed'",
			description: "The collapsible's open state."
		}
	]
};

export const collapsible = [root, trigger, content];
