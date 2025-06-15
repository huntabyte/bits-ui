import type {
	TooltipArrowPropsWithoutHTML,
	TooltipContentPropsWithoutHTML,
	TooltipContentStaticPropsWithoutHTML,
	TooltipPortalPropsWithoutHTML,
	TooltipProviderPropsWithoutHTML,
	TooltipRootPropsWithoutHTML,
	TooltipTriggerPropsWithoutHTML,
} from "bits-ui";
import { FloatingSideProp } from "./extended-types/floating/index.js";
import {
	arrowProps,
	childrenSnippet,
	dirProp,
	dismissibleLayerProps,
	escapeLayerProps,
	floatingContentChildDefinition,
	floatingContentCSSVars,
	floatingProps,
	forceMountProp,
	onOpenChangeCompleteProp,
	onOpenChangeProp,
	openChildDefinition,
	openProp,
	portalProps,
	withChildProps,
} from "$lib/content/api-reference/shared.js";
import { TooltipStateDataAttr } from "./extended-types/tooltip/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineNumberProp,
	defineSimpleDataAttr,
} from "../utils.js";

const openClosedDataAttr = defineEnumDataAttr({
	name: "state",
	description:
		"Whether/how the tooltip is open or closed. When open, if there is a delay, the value will be 'delayed-open', otherwise it will be 'instant-open'. When closed, the value will be 'closed'.",
	options: ["delayed-open", "instant-open", "closed"],
	value: TooltipStateDataAttr,
});

const delayDuration = defineNumberProp({
	default: 700,
	description:
		"The amount of time in milliseconds to delay opening the tooltip when hovering over the trigger.",
});

const disableHoverableContent = defineBooleanProp({
	default: false,
	description:
		"Whether or not to disable the hoverable content. This is useful when the content contains interactive elements.",
});

const disabled = defineBooleanProp({
	default: false,
	description: "Whether or not the tooltip is disabled.",
});

const disableCloseOnTriggerClick = defineBooleanProp({
	default: false,
	description:
		"Whether or not to close the tooltip when pressing the escape key. This is useful when the content contains interactive elements.",
});

const skipDelayDuration = defineNumberProp({
	default: 300,
	description:
		"The amount of time in milliseconds to delay opening the tooltip when the user has used their mouse to hover over the trigger.",
});

const ignoreNonKeyboardFocus = defineBooleanProp({
	default: false,
	description:
		"Whether or not to ignore the tooltip when the focus is not on the trigger. This is useful when the content contains interactive elements.",
});

export const provider = defineComponentApiSchema<TooltipProviderPropsWithoutHTML>({
	title: "Provider",
	description:
		"A provider component which contains shared state and logic for the tooltips within its subtree.",
	props: {
		delayDuration,
		disableHoverableContent,
		disabled,
		disableCloseOnTriggerClick,
		skipDelayDuration,
		ignoreNonKeyboardFocus,
		children: childrenSnippet(),
	},
});

export const root = defineComponentApiSchema<TooltipRootPropsWithoutHTML>({
	title: "Root",
	description:
		"The root component containing the parts of the tooltip. Must be a descendant of a `Tooltip.Provider` component.",
	props: {
		open: openProp,
		onOpenChange: onOpenChangeProp,
		onOpenChangeComplete: onOpenChangeCompleteProp,
		disabled,
		delayDuration,
		disableHoverableContent,
		disableCloseOnTriggerClick,
		ignoreNonKeyboardFocus,
		children: childrenSnippet(),
	},
});

export const trigger = defineComponentApiSchema<TooltipTriggerPropsWithoutHTML>({
	title: "Trigger",
	description:
		"A component which triggers the opening and closing of the tooltip on hover or focus.",
	props: {
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the tooltip trigger is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		openClosedDataAttr,
		defineSimpleDataAttr({
			name: "tooltip-trigger",
			description: "Present on the tooltip trigger element.",
		}),
	],
});

export const content = defineComponentApiSchema<TooltipContentPropsWithoutHTML>({
	title: "Content",
	description: "The contents of the tooltip which are displayed when the tooltip is open.",
	props: {
		...floatingProps(),
		...dismissibleLayerProps,
		...escapeLayerProps,
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
			name: "tooltip-content",
			description: "Present on the tooltip content element.",
		}),
	],
	cssVars: floatingContentCSSVars("tooltip"),
});

export const contentStatic = defineComponentApiSchema<TooltipContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description:
		"The contents of the tooltip which are displayed when the tooltip is open. (Static/No Floating UI)",
	props: {
		...dismissibleLayerProps,
		...escapeLayerProps,
		forceMount: forceMountProp,
		dir: dirProp,
		...withChildProps({
			elType: "HTMLDivElement",
			child: openChildDefinition,
		}),
	},
	dataAttributes: [
		openClosedDataAttr,
		defineSimpleDataAttr({
			name: "tooltip-content",
			description: "Present on the tooltip content element.",
		}),
	],
});

export const arrow = defineComponentApiSchema<TooltipArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the tooltip is open.",
	props: arrowProps,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "arrow",
			description: "Present on the arrow element.",
		}),
		defineSimpleDataAttr({
			name: "tooltip-arrow",
			description: "Present on the arrow element.",
		}),
		defineEnumDataAttr({
			name: "side",
			description: "The side of the tooltip that the arrow is on.",
			options: ["top", "right", "bottom", "left"],
			value: FloatingSideProp,
		}),
	],
});

const portal = defineComponentApiSchema<TooltipPortalPropsWithoutHTML>({
	title: "Portal",
	description:
		"When used, will render the tooltip content into the body or custom `to` element when open",
	props: portalProps,
});

export const tooltip = [provider, root, trigger, content, contentStatic, arrow, portal];
