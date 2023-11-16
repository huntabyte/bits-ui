import type { APISchema } from "@/types";
import { asChild, transitionProps } from "@/content";
import type * as Collapsible from "$lib/bits/collapsible/_types";

export const root: APISchema<Collapsible.Props> = {
	title: "Root",
	description: "The root collapsible container which manages the state of the collapsible.",
	props: {
		disabled: {
			default: "false",
			type: "boolean",
			description:
				"Whether or not the collapsible is disabled. This prevents the user from interacting with it."
		},
		open: {
			default: "false",
			type: "boolean",
			description:
				"The open state of the collapsible. The content will be visible when this is true, and hidden when it's false."
		},
		onOpenChange: {
			type: "(open: boolean) => void",
			description: "A callback that is fired when the collapsible's open state changes."
		},
		asChild
	},
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

export const trigger: APISchema<Collapsible.TriggerProps> = {
	title: "Trigger",
	description: "The button responsible for toggling the collapsible's open state.",
	props: { asChild },
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

export const content: APISchema<Collapsible.ContentProps> = {
	title: "Content",
	description: "The content displayed when the collapsible is open.",
	props: { ...transitionProps, asChild },
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
