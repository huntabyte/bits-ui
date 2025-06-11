import type {
	PopoverArrowPropsWithoutHTML,
	PopoverClosePropsWithoutHTML,
	PopoverContentPropsWithoutHTML,
	PopoverContentStaticPropsWithoutHTML,
	PopoverPortalPropsWithoutHTML,
	PopoverRootPropsWithoutHTML,
	PopoverTriggerPropsWithoutHTML,
} from "bits-ui";
import { OpenClosedProp } from "./extended-types/shared/index.js";
import { FloatingContentChildSnippetProps } from "./extended-types/floating/index.js";
import {
	arrowProps,
	childrenSnippet,
	dirProp,
	dismissibleLayerProps,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	onOpenChangeProp,
	openProp,
	portalProps,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	withChildProps,
} from "$lib/content/api-reference/shared.js";
import {
	defineComponentApiSchema,
	defineCSSVarSchema,
	defineEnumDataAttr,
	definePropSchema,
	defineStringDataAttr,
} from "../utils.js";

const openClosedDataAttr = defineEnumDataAttr({
	name: "state",
	description: "Whether the popover is open or closed.",
	options: ["open", "closed"],
	value: OpenClosedProp,
});

export const root = defineComponentApiSchema<PopoverRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component used to manage the state of the state of the popover.",
	props: {
		open: openProp,
		onOpenChange: onOpenChangeProp,
		children: childrenSnippet(),
	},
});

export const trigger = defineComponentApiSchema<PopoverTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "A component which toggles the opening and closing of the popover on press.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		openClosedDataAttr,
		defineStringDataAttr({
			name: "popover-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

export const content = defineComponentApiSchema<PopoverContentPropsWithoutHTML>({
	title: "Content",
	description: "The contents of the popover which are displayed when the popover is open.",
	props: {
		...floatingProps(),
		...dismissibleLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		preventScroll: definePropSchema({
			...preventScrollProp,
			default: {
				_type: "string",
				value: "false",
			},
		}),
		forceMount: forceMountProp,
		dir: dirProp,
		...withChildProps({ elType: "HTMLDivElement", childDef: FloatingContentChildSnippetProps }),
	},
	dataAttributes: [
		openClosedDataAttr,
		defineStringDataAttr({
			name: "popover-content",
			description: "Present on the content element.",
		}),
	],
	cssVars: [
		defineCSSVarSchema({
			name: "--bits-popover-content-transform-origin",
			description: "The transform origin of the popover content element.",
		}),
		defineCSSVarSchema({
			name: "--bits-popover-content-available-width",
			description: "The available width of the popover content element.",
		}),
		defineCSSVarSchema({
			name: "--bits-popover-content-available-height",
			description: "The available height of the popover content element.",
		}),
		defineCSSVarSchema({
			name: "--bits-popover-anchor-width",
			description: "The width of the popover trigger element.",
		}),
		defineCSSVarSchema({
			name: "--bits-popover-anchor-height",
			description: "The height of the popover trigger element.",
		}),
	],
});

export const contentStatic = defineComponentApiSchema<PopoverContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description:
		"The contents of the popover which are displayed when the popover is open. (Static/No Floating UI)",
	props: {
		...dismissibleLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		preventScroll: {
			...preventScrollProp,
			default: {
				_type: "string",
				value: "false",
			},
		},
		forceMount: forceMountProp,
		dir: dirProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		openClosedDataAttr,
		defineStringDataAttr({
			name: "popover-content",
			description: "Present on the content element.",
		}),
	],
});

export const close = defineComponentApiSchema<PopoverClosePropsWithoutHTML>({
	title: "Close",
	description:
		"A button which closes the popover when pressed and is typically placed in the content.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		defineStringDataAttr({
			name: "popover-close",
			description: "Present on the close button.",
		}),
	],
});

export const arrow = defineComponentApiSchema<PopoverArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the popover is open.",
	props: arrowProps,
	dataAttributes: [
		defineStringDataAttr({
			name: "arrow",
			description: "Present on the arrow element.",
		}),
		defineStringDataAttr({
			name: "popover-arrow",
			description: "Present on the arrow element.",
		}),
	],
});

export const portal = defineComponentApiSchema<PopoverPortalPropsWithoutHTML>({
	title: "Portal",
	description:
		"When used, will render the popover content into the body or custom `to` element when open",
	props: portalProps,
});

export const popover = [root, trigger, content, contentStatic, close, arrow, portal];
