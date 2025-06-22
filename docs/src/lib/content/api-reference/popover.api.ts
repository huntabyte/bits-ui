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
import {
	floatingContentChildDefinition,
	floatingContentCSSVars,
	onOpenChangeCompleteProp,
} from "./shared.js";
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
	defineEnumDataAttr,
	definePropSchema,
	defineSimpleDataAttr,
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
		onOpenChangeComplete: onOpenChangeCompleteProp,
		children: childrenSnippet(),
	},
});

export const trigger = defineComponentApiSchema<PopoverTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "A component which toggles the opening and closing of the popover on press.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		openClosedDataAttr,
		defineSimpleDataAttr({
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
				variant: "simple",
				value: "false",
			},
		}),
		forceMount: forceMountProp,
		dir: dirProp,
		...withChildProps({
			elType: "HTMLDivElement",
			child: floatingContentChildDefinition,
		}),
	},
	dataAttributes: [
		openClosedDataAttr,
		defineSimpleDataAttr({
			name: "popover-content",
			description: "Present on the content element.",
		}),
	],
	cssVars: floatingContentCSSVars("popover"),
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
				variant: "simple",
				value: "false",
			},
		},
		forceMount: forceMountProp,
		dir: dirProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		openClosedDataAttr,
		defineSimpleDataAttr({
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
		defineSimpleDataAttr({
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
		defineSimpleDataAttr({
			name: "arrow",
			description: "Present on the arrow element.",
		}),
		defineSimpleDataAttr({
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
