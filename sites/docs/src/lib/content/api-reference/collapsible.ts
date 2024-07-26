import type {
	CollapsibleContentPropsWithoutHTML,
	CollapsibleRootPropsWithoutHTML,
	CollapsibleTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	createApiSchema,
	createBooleanProp,
	createFunctionProp,
	forceMountProp,
	withChildProps,
} from "./helpers.js";
import { enums } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

export const root = createApiSchema<CollapsibleRootPropsWithoutHTML>({
	title: "Root",
	description: "The root collapsible container which manages the state of the collapsible.",
	props: {
		open: createBooleanProp({
			default: C.FALSE,
			description:
				"The open state of the collapsible. The content will be visible when this is true, and hidden when it's false.",
			bindable: true,
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the collapsible is disabled. This prevents the user from interacting with it.",
		}),
		onOpenChange: createFunctionProp({
			definition: "(open: boolean) => void",
			description: "A callback that is fired when the collapsible's open state changes.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "disabled",
			description: "Present when the checkbox is disabled.",
		},
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The collapsible's open state.",
			isEnum: true,
		},
		{
			name: "collapsible-root",
			description: "Present on the root element.",
		},
	],
});

export const trigger = createApiSchema<CollapsibleTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The button responsible for toggling the collapsible's open state.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		{
			name: "disabled",
			description: "Present when the checkbox is disabled.",
		},
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The collapsible's open state.",
			isEnum: true,
		},
		{
			name: "collapsible-trigger",
			description: "Present on the trigger element.",
		},
	],
});

export const content = createApiSchema<CollapsibleContentPropsWithoutHTML>({
	title: "Content",
	description: "The content displayed when the collapsible is open.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "disabled",
			description: "Present when the checkbox is disabled.",
		},
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The collapsible's open state.",
			isEnum: true,
		},
		{
			name: "collapsible-content",
			description: "Present on the content element.",
		},
	],
});

export const collapsible = [root, trigger, content];
