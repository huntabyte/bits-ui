import type {
	CollapsibleContentPropsWithoutHTML,
	CollapsibleRootPropsWithoutHTML,
	CollapsibleTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	createApiSchema,
	createBooleanProp,
	createCSSVarSchema,
	createDataAttrSchema,
	createEnumDataAttr,
	createFunctionProp,
	forceMountProp,
	withChildProps,
} from "./helpers.js";
import ContentChildSnippetProps from "./extended-types/collapsible/content-child-snippet-props.md";
import ContentChildrenSnippetProps from "./extended-types/collapsible/content-children-snippet-props.md";
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
		createEnumDataAttr({
			name: "state",
			options: ["open", "closed"],
			description: "The collapsible's open state.",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the collapsible is disabled.",
		}),
		createDataAttrSchema({
			name: "collapsible-root",
			description: "Present on the root element.",
		}),
	],
});

export const trigger = createApiSchema<CollapsibleTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The button responsible for toggling the collapsible's open state.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		createEnumDataAttr({
			name: "state",
			options: ["open", "closed"],
			description: "The collapsible's open state.",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the collapsible or this trigger is disabled.",
		}),
		createDataAttrSchema({
			name: "collapsible-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

export const content = createApiSchema<CollapsibleContentPropsWithoutHTML>({
	title: "Content",
	description: "The content displayed when the collapsible is open.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({
			elType: "HTMLDivElement",
			childrenDef: ContentChildrenSnippetProps,
			childDef: ContentChildSnippetProps,
		}),
	},
	dataAttributes: [
		createEnumDataAttr({
			name: "state",
			options: ["open", "closed"],
			description: "The collapsible's open state.",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the collapsible is disabled.",
		}),
		createDataAttrSchema({
			name: "collapsible-content",
			description: "Present on the content element.",
		}),
	],
	cssVars: [
		createCSSVarSchema({
			name: "--bits-collapsible-content-height",
			description: "The height of the collapsible content element.",
		}),
		createCSSVarSchema({
			name: "--bits-collapsible-content-width",
			description: "The width of the collapsible content element.",
		}),
	],
});

export const collapsible = [root, trigger, content];
