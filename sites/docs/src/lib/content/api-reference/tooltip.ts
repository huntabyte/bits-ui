import type {
	TooltipArrowPropsWithoutHTML,
	TooltipContentPropsWithoutHTML,
	TooltipPropsWithoutHTML,
	TooltipTriggerPropsWithoutHTML,
} from "bits-ui";
import { floatingPositioning } from "./floating.js";
import {
	arrowProps,
	builderAndAttrsSlotProps,
	domElProps,
	enums,
	idsSlotProp,
	portalProp,
	transitionProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<TooltipPropsWithoutHTML> = {
	title: "Root",
	description: "The root component containing the parts of the tooltip.",
	props: {
		openDelay: {
			type: C.NUMBER,
			default: "700",
			description:
				"The amount of time in milliseconds to delay opening the tooltip when hovering over the trigger.",
		},
		closeDelay: {
			type: C.NUMBER,
			default: "300",
			description:
				"The amount of time in milliseconds to delay closing the tooltip when the mouse leaves the trigger.",
		},
		closeOnEscape: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether or not to close the tooltip when pressing the escape key.",
		},
		closeOnPointerDown: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description:
				"Whether or not to close the tooltip when clicking outside of the tooltip.",
		},
		disableHoverableContent: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description:
				"Whether or not to disable the hoverable content. This is useful when the content contains interactive elements.",
		},
		group: {
			type: C.STRING,
			description: "The group the tooltip belongs to.",
		},
		open: {
			type: C.BOOLEAN,
			default: "false",
			description: "The open state of the tooltip component.",
		},
		onOpenChange: {
			type: {
				type: C.FUNCTION,
				definition: "(open: boolean) => void",
			},
			description: "A callback that fires when the open state changes.",
		},
		portal: { ...portalProp("tooltip") },
	},
	slotProps: {
		ids: idsSlotProp,
	},
};

export const trigger: APISchema<TooltipTriggerPropsWithoutHTML> = {
	title: "Trigger",
	description:
		"A component which triggers the opening and closing of the tooltip on hover or focus.",
	props: domElProps("HTMLButtonElement"),
	slotProps: { ...builderAndAttrsSlotProps },
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
	props: { ...transitionProps, ...floatingPositioning, ...domElProps("HTMLDivElement") },
	slotProps: { ...builderAndAttrsSlotProps },
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
	slotProps: { ...builderAndAttrsSlotProps },
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
