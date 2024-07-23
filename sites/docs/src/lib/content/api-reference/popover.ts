import type {
	PopoverArrowPropsWithoutHTML,
	PopoverClosePropsWithoutHTML,
	PopoverContentPropsWithoutHTML,
	PopoverRootPropsWithoutHTML,
	PopoverTriggerPropsWithoutHTML,
} from "bits-ui";
import { focusProp } from "./extended-types/index.js";
import { floatingPositioning } from "./floating.js";
import {
	arrowProps,
	builderAndAttrsSlotProps,
	childrenSnippet,
	dirProp,
	dismissableLayerProps,
	domElProps,
	enums,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	idsSlotProp,
	onOutsideClickProp,
	portalProp,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	transitionProps,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<PopoverRootPropsWithoutHTML> = {
	title: "Root",
	description: "The root component used to manage the state of the state of the popover.",
	props: {
		open: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "The open state of the link popover component.",
		},
		onOpenChange: {
			type: {
				type: C.FUNCTION,
				definition: "(open: boolean) => void",
			},
			description: "A callback that fires when the open state changes.",
		},
		children: childrenSnippet(),
	},
	slotProps: { ids: idsSlotProp },
};

export const trigger: APISchema<PopoverTriggerPropsWithoutHTML> = {
	title: "Trigger",
	description: "A component which toggles the opening and closing of the popover on press.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The open state of the link preview.",
			isEnum: true,
		},
		{
			name: "popover-trigger",
			description: "Present on the trigger element.",
		},
	],
};

export const content: APISchema<PopoverContentPropsWithoutHTML> = {
	title: "Content",
	description: "The contents of the popover which are displayed when the popover is open.",
	props: {
		...floatingProps(),
		...dismissableLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		preventScroll: preventScrollProp(),
		forceMount: forceMountProp,
		dir: dirProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The open state of the popover.",
			isEnum: true,
		},
		{
			name: "popover-content",
			description: "Present on the content element.",
		},
	],
};

export const close: APISchema<PopoverClosePropsWithoutHTML> = {
	title: "Close",
	description:
		"A button which closes the popover when pressed and is typically placed in the content.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "popover-close",
			description: "Present on the close button.",
		},
	],
};

export const arrow: APISchema<PopoverArrowPropsWithoutHTML> = {
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the popover is open.",
	props: arrowProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "arrow",
			description: "Present on the arrow element.",
		},
		{
			name: "popover-arrow",
			description: "Present on the arrow element.",
		},
	],
};

export const popover = [root, trigger, content, close, arrow];
