import type {
	TooltipArrowPropsWithoutHTML,
	TooltipContentPropsWithoutHTML,
	TooltipProviderPropsWithoutHTML,
	TooltipRootPropsWithoutHTML,
	TooltipTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	arrowProps,
	childrenSnippet,
	dirProp,
	dismissableLayerProps,
	enums,
	escapeLayerProps,
	floatingProps,
	forceMountProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema, PropSchema } from "$lib/types/index.js";

const delayDuration: PropSchema = {
	type: C.NUMBER,
	default: "700",
	description:
		"The amount of time in milliseconds to delay opening the tooltip when hovering over the trigger.",
};

const disableHoverableContent: PropSchema = {
	type: C.BOOLEAN,
	default: C.FALSE,
	description:
		"Whether or not to disable the hoverable content. This is useful when the content contains interactive elements.",
};

const disabled: PropSchema = {
	type: C.BOOLEAN,
	default: C.FALSE,
	description: "Whether or not the tooltip is disabled.",
};

const disableCloseOnTriggerClick: PropSchema = {
	type: C.BOOLEAN,
	default: C.FALSE,
	description:
		"Whether or not to close the tooltip when pressing the escape key. This is useful when the content contains interactive elements.",
};

const skipDelayDuration: PropSchema = {
	type: C.NUMBER,
	default: "300",
	description:
		"The amount of time in milliseconds to delay opening the tooltip when the user has used their mouse to hover over the trigger.",
};

const ignoreNonKeyboardFocus: PropSchema = {
	type: C.BOOLEAN,
	default: C.FALSE,
	description:
		"Whether or not to ignore the tooltip when the focus is not on the trigger. This is useful when the content contains interactive elements.",
};

export const provider: APISchema<TooltipProviderPropsWithoutHTML> = {
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
};

export const root: APISchema<TooltipRootPropsWithoutHTML> = {
	title: "Root",
	description: "The root component containing the parts of the tooltip.",
	props: {
		open: {
			type: C.BOOLEAN,
			default: "false",
			description: "The open state of the tooltip component.",
			bindable: true,
		},
		onOpenChange: {
			type: {
				type: C.FUNCTION,
				definition: "(open: boolean) => void",
			},
			description: "A callback that fires when the open state changes.",
		},
		disabled,
		delayDuration,
		disableHoverableContent,
		disableCloseOnTriggerClick,
		ignoreNonKeyboardFocus,
		children: childrenSnippet(),
	},
};

export const trigger: APISchema<TooltipTriggerPropsWithoutHTML> = {
	title: "Trigger",
	description:
		"A component which triggers the opening and closing of the tooltip on hover or focus.",
	props: {
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the tooltip trigger is disabled.",
		},
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		{
			name: "state",
			description: "The open state of the tooltip.",
			value: enums("open", "closed"),
			isEnum: true,
		},
		{
			name: "tooltip-trigger",
			description: "Present on the trigger element.",
		},
	],
};

export const content: APISchema<TooltipContentPropsWithoutHTML> = {
	title: "Content",
	description: "The contents of the tooltip which are displayed when the tooltip is open.",
	props: {
		...floatingProps(),
		...dismissableLayerProps,
		...escapeLayerProps,
		forceMount: forceMountProp,
		dir: dirProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "tooltip-content",
			description: "Present on the content element.",
		},
	],
};

export const arrow: APISchema<TooltipArrowPropsWithoutHTML> = {
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the tooltip is open.",
	props: arrowProps,
	dataAttributes: [
		{
			name: "arrow",
			description: "Present on the arrow element.",
		},
		{
			name: "tooltip-arrow",
			description: "Present on the arrow element.",
		},
	],
};

export const tooltip = [root, trigger, content, arrow];
