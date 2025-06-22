import type {
	LinkPreviewArrowPropsWithoutHTML,
	LinkPreviewContentPropsWithoutHTML,
	LinkPreviewContentStaticPropsWithoutHTML,
	LinkPreviewPortalPropsWithoutHTML,
	LinkPreviewRootPropsWithoutHTML,
	LinkPreviewTriggerPropsWithoutHTML,
} from "bits-ui";
import { OpenClosedProp } from "./extended-types/shared/index.js";
import {
	arrowProps,
	childrenSnippet,
	dirProp,
	dismissibleLayerProps,
	escapeLayerProps,
	floatingContentCSSVars,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	onOpenChangeCompleteProp,
	onOpenChangeProp,
	portalProps,
	withChildProps,
} from "$lib/content/api-reference/shared.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineNumberProp,
	defineSimpleDataAttr,
} from "../utils.js";

const openClosedDataAttr = defineEnumDataAttr({
	name: "state",
	description: "Whether the accordion item is open or closed.",
	options: ["open", "closed"],
	value: OpenClosedProp,
});

export const root = defineComponentApiSchema<LinkPreviewRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component used to manage the state of the state of the link preview.",
	props: {
		open: defineBooleanProp({
			default: false,
			description: "The open state of the link preview component.",
			bindable: true,
		}),
		onOpenChange: onOpenChangeProp,
		onOpenChangeComplete: onOpenChangeCompleteProp,
		openDelay: defineNumberProp({
			default: 700,
			description:
				"The amount of time in milliseconds to delay opening the preview when hovering over the trigger.",
		}),
		closeDelay: defineNumberProp({
			default: 300,
			description:
				"The amount of time in milliseconds to delay closing the preview when the mouse leaves the trigger.",
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the link preview is disabled.",
		}),
		ignoreNonKeyboardFocus: defineBooleanProp({
			default: false,
			description: "Whether the link preview should ignore non-keyboard focus.",
		}),
		children: childrenSnippet(),
	},
});

export const trigger = defineComponentApiSchema<LinkPreviewTriggerPropsWithoutHTML>({
	title: "Trigger",
	description:
		"A component which triggers the opening and closing of the link preview on hover or focus.",
	props: withChildProps({ elType: "HTMLAnchorElement" }),
	dataAttributes: [
		openClosedDataAttr,
		defineSimpleDataAttr({
			name: "link-preview-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

export const content = defineComponentApiSchema<LinkPreviewContentPropsWithoutHTML>({
	title: "Content",
	description: "The contents of the link preview which are displayed when the preview is open.",
	props: {
		...floatingProps(),
		...dismissibleLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		dir: dirProp,
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		openClosedDataAttr,
		defineSimpleDataAttr({
			name: "link-preview-content",
			description: "Present on the content element.",
		}),
	],
	cssVars: floatingContentCSSVars("link-preview"),
});

export const contentStatic = defineComponentApiSchema<LinkPreviewContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description:
		"The contents of the link preview which are displayed when the preview is open. (Static/No Floating UI)",
	props: {
		...dismissibleLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		dir: dirProp,
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		openClosedDataAttr,
		defineSimpleDataAttr({
			name: "link-preview-content",
			description: "Present on the content element.",
		}),
	],
});

export const arrow = defineComponentApiSchema<LinkPreviewArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow element which points to the trigger when the preview is open.",
	props: arrowProps,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "link-preview-arrow",
			description: "Present on the arrow element.",
		}),
	],
});

const portal = defineComponentApiSchema<LinkPreviewPortalPropsWithoutHTML>({
	title: "Portal",
	description:
		"When used, will render the link preview content into the body or custom `to` element when open",
	props: portalProps,
});

export const linkPreview = [root, trigger, content, contentStatic, arrow, portal];
