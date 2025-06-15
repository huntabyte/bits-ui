import type {
	CollapsibleContentPropsWithoutHTML,
	CollapsibleRootPropsWithoutHTML,
	CollapsibleTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	forceMountProp,
	onOpenChangeCompleteProp,
	onOpenChangeProp,
	withChildProps,
} from "./shared.js";
import { CollapsibleContentChildSnippetProps } from "./extended-types/collapsible/index.js";
import { OpenClosedProp } from "./extended-types/shared/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineCSSVarSchema,
	defineEnumDataAttr,
	defineSimpleDataAttr,
} from "../utils.js";

export const root = defineComponentApiSchema<CollapsibleRootPropsWithoutHTML>({
	title: "Root",
	description: "The root collapsible container which manages the state of the collapsible.",
	props: {
		open: defineBooleanProp({
			default: false,
			description:
				"The open state of the collapsible. The content will be visible when this is true, and hidden when it's false.",
			bindable: true,
		}),
		onOpenChange: onOpenChangeProp,
		onOpenChangeComplete: onOpenChangeCompleteProp,
		disabled: defineBooleanProp({
			default: false,
			description:
				"Whether or not the collapsible is disabled. This prevents the user from interacting with it.",
		}),

		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineEnumDataAttr({
			name: "state",
			options: ["open", "closed"],
			description: "The collapsible's open state.",
			value: OpenClosedProp,
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the collapsible is disabled.",
		}),
		defineSimpleDataAttr({
			name: "collapsible-root",
			description: "Present on the root element.",
		}),
	],
});

export const trigger = defineComponentApiSchema<CollapsibleTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The button responsible for toggling the collapsible's open state.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		defineEnumDataAttr({
			name: "state",
			options: ["open", "closed"],
			description: "The collapsible's open state.",
			value: OpenClosedProp,
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the collapsible or this trigger is disabled.",
		}),
		defineSimpleDataAttr({
			name: "collapsible-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

export const content = defineComponentApiSchema<CollapsibleContentPropsWithoutHTML>({
	title: "Content",
	description: "The content displayed when the collapsible is open.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({
			elType: "HTMLDivElement",
			child: {
				definition: CollapsibleContentChildSnippetProps,
				stringDefinition: `type SnippetProps = {
	open: boolean;
	props: Record<string, unknown>;
};`,
			},
		}),
	},
	dataAttributes: [
		defineEnumDataAttr({
			name: "state",
			options: ["open", "closed"],
			description: "The collapsible's open state.",
			value: OpenClosedProp,
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the collapsible is disabled.",
		}),
		defineSimpleDataAttr({
			name: "collapsible-content",
			description: "Present on the content element.",
		}),
	],
	cssVars: [
		defineCSSVarSchema({
			name: "--bits-collapsible-content-height",
			description: "The height of the collapsible content element.",
		}),
		defineCSSVarSchema({
			name: "--bits-collapsible-content-width",
			description: "The width of the collapsible content element.",
		}),
	],
});

export const collapsible = [root, trigger, content];
