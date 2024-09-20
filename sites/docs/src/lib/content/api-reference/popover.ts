import type {
	PopoverArrowPropsWithoutHTML,
	PopoverClosePropsWithoutHTML,
	PopoverContentPropsWithoutHTML,
	PopoverContentStaticPropsWithoutHTML,
	PopoverRootPropsWithoutHTML,
	PopoverTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	arrowProps,
	childrenSnippet,
	createApiSchema,
	createBooleanProp,
	createEnumDataAttr,
	createFunctionProp,
	dirProp,
	dismissableLayerProps,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const openClosedDataAttr = createEnumDataAttr({
	name: "state",
	description: "Whether the popover is open or closed.",
	options: ["open", "closed"],
});

export const root = createApiSchema<PopoverRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component used to manage the state of the state of the popover.",
	props: {
		open: createBooleanProp({
			default: C.FALSE,
			description: "The open state of the link popover component.",
			bindable: true,
		}),
		onOpenChange: createFunctionProp({
			definition: "(open: boolean) => void",
			description: "A callback that fires when the open state changes.",
		}),
		children: childrenSnippet(),
	},
});

export const trigger = createApiSchema<PopoverTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "A component which toggles the opening and closing of the popover on press.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		openClosedDataAttr,
		{
			name: "popover-trigger",
			description: "Present on the trigger element.",
		},
	],
});

export const content = createApiSchema<PopoverContentPropsWithoutHTML>({
	title: "Content",
	description: "The contents of the popover which are displayed when the popover is open.",
	props: {
		...floatingProps(),
		...dismissableLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		preventScroll: {
			...preventScrollProp,
			default: C.FALSE,
		},
		forceMount: forceMountProp,
		dir: dirProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		openClosedDataAttr,
		{
			name: "popover-content",
			description: "Present on the content element.",
		},
	],
});

export const contentStatic = createApiSchema<PopoverContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description:
		"The contents of the popover which are displayed when the popover is open. (Static/No Floating UI)",
	props: {
		...dismissableLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		preventScroll: {
			...preventScrollProp,
			default: C.FALSE,
		},
		forceMount: forceMountProp,
		dir: dirProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		openClosedDataAttr,
		{
			name: "popover-content",
			description: "Present on the content element.",
		},
	],
});

export const close = createApiSchema<PopoverClosePropsWithoutHTML>({
	title: "Close",
	description:
		"A button which closes the popover when pressed and is typically placed in the content.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		{
			name: "popover-close",
			description: "Present on the close button.",
		},
	],
});

export const arrow = createApiSchema<PopoverArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the popover is open.",
	props: arrowProps,
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
});

export const popover = [root, trigger, content, contentStatic, close, arrow];
