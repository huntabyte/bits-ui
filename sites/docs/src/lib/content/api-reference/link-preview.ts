import type {
	LinkPreviewArrowPropsWithoutHTML,
	LinkPreviewContentPropsWithoutHTML,
	LinkPreviewContentStaticPropsWithoutHTML,
	LinkPreviewRootPropsWithoutHTML,
	LinkPreviewTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	arrowProps,
	childrenSnippet,
	controlledOpenProp,
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createEnumDataAttr,
	createFunctionProp,
	createNumberProp,
	dirProp,
	dismissableLayerProps,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const openClosedDataAttr = createEnumDataAttr({
	name: "state",
	description: "Whether the accordion item is open or closed.",
	options: ["open", "closed"],
});

export const root = createApiSchema<LinkPreviewRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component used to manage the state of the state of the link preview.",
	props: {
		open: createBooleanProp({
			default: "false",
			description: "The open state of the link preview component.",
			bindable: true,
		}),
		onOpenChange: createFunctionProp({
			definition: "(open: boolean) => void",
			description: "A callback that fires when the open state changes.",
		}),
		controlledOpen: controlledOpenProp,
		openDelay: createNumberProp({
			default: "700",
			description:
				"The amount of time in milliseconds to delay opening the preview when hovering over the trigger.",
		}),
		closeDelay: createNumberProp({
			default: "300",
			description:
				"The amount of time in milliseconds to delay closing the preview when the mouse leaves the trigger.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the link preview is disabled.",
		}),
		ignoreNonKeyboardFocus: createBooleanProp({
			default: C.FALSE,
			description: "Whether the link preview should ignore non-keyboard focus.",
		}),
		children: childrenSnippet(),
	},
});

export const trigger = createApiSchema<LinkPreviewTriggerPropsWithoutHTML>({
	title: "Trigger",
	description:
		"A component which triggers the opening and closing of the link preview on hover or focus.",
	props: withChildProps({ elType: "HTMLAnchorElement" }),
	dataAttributes: [
		openClosedDataAttr,
		createDataAttrSchema({
			name: "link-preview-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

export const content = createApiSchema<LinkPreviewContentPropsWithoutHTML>({
	title: "Content",
	description: "The contents of the link preview which are displayed when the preview is open.",
	props: {
		...floatingProps(),
		...dismissableLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		dir: dirProp,
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		openClosedDataAttr,
		createDataAttrSchema({
			name: "link-preview-content",
			description: "Present on the content element.",
		}),
	],
});

export const contentStatic = createApiSchema<LinkPreviewContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description:
		"The contents of the link preview which are displayed when the preview is open. (Static/No Floating UI)",
	props: {
		...dismissableLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		dir: dirProp,
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		openClosedDataAttr,
		createDataAttrSchema({
			name: "link-preview-content",
			description: "Present on the content element.",
		}),
	],
});

export const arrow = createApiSchema<LinkPreviewArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the preview is open.",
	props: arrowProps,
	dataAttributes: [
		createDataAttrSchema({
			name: "link-preview-arrow",
			description: "Present on the arrow element.",
		}),
	],
});

export const linkPreview = [root, trigger, content, contentStatic, arrow];
