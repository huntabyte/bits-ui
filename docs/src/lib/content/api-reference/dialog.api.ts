import type {
	DialogClosePropsWithoutHTML,
	DialogContentPropsWithoutHTML,
	DialogDescriptionPropsWithoutHTML,
	DialogOverlayPropsWithoutHTML,
	DialogPortalPropsWithoutHTML,
	DialogRootPropsWithoutHTML,
	DialogTitlePropsWithoutHTML,
	DialogTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	childrenSnippet,
	dismissibleLayerProps,
	escapeLayerProps,
	focusScopeProps,
	forceMountProp,
	onOpenChangeCompleteProp,
	onOpenChangeProp,
	openChildDefinition,
	portalProps,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	restoreScrollDelayProp,
	withChildProps,
} from "./shared.js";
import { HeaderLevelProp, OpenClosedProp } from "./extended-types/shared/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineSimpleDataAttr,
	defineUnionProp,
} from "../utils.js";

const stateDataAttr = defineEnumDataAttr({
	name: "state",
	value: OpenClosedProp,
	description: "The state of the dialog.",
	options: ["open", "closed"],
});

export const root = defineComponentApiSchema<DialogRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component used to set and manage the state of the dialog.",
	props: {
		open: defineBooleanProp({
			default: false,
			description: "Whether or not the dialog is open.",
			bindable: true,
		}),
		onOpenChange: onOpenChangeProp,
		onOpenChangeComplete: onOpenChangeCompleteProp,
		children: childrenSnippet(),
	},
});

export const close = defineComponentApiSchema<DialogClosePropsWithoutHTML>({
	title: "Close",
	description: "A button used to close the dialog.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "dialog-close",
			description: "Present on the close button.",
		}),
	],
});

export const content = defineComponentApiSchema<DialogContentPropsWithoutHTML>({
	title: "Content",
	description: "The content displayed within the dialog modal.",
	props: {
		...escapeLayerProps,
		...dismissibleLayerProps,
		...focusScopeProps,
		forceMount: forceMountProp,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		preventScroll: preventScrollProp,
		restoreScrollDelay: restoreScrollDelayProp,
		...withChildProps({
			elType: "HTMLDivElement",
			child: openChildDefinition,
		}),
	},
	dataAttributes: [
		stateDataAttr,
		defineSimpleDataAttr({
			name: "dialog-content",
			description: "Present on the content.",
		}),
	],
});

export const title = defineComponentApiSchema<DialogTitlePropsWithoutHTML>({
	title: "Title",
	description: "An accessible title for the dialog.",
	props: {
		level: defineUnionProp({
			options: ["1", "2", "3", "4", "5", "6"],
			description: "The heading level of the title.",
			default: "3",
			definition: HeaderLevelProp,
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "dialog-title",
			description: "Present on the title.",
		}),
	],
});

export const description = defineComponentApiSchema<DialogDescriptionPropsWithoutHTML>({
	title: "Description",
	description: "An accessible description for the dialog.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "dialog-description",
			description: "Present on the description.",
		}),
	],
});

export const trigger = defineComponentApiSchema<DialogTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The element which opens the dialog on press.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "dialog-trigger",
			description: "Present on the trigger.",
		}),
	],
});

export const overlay = defineComponentApiSchema<DialogOverlayPropsWithoutHTML>({
	title: "Overlay",
	description: "An overlay which covers the body when the dialog is open.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({
			elType: "HTMLDivElement",
			child: openChildDefinition,
		}),
	},
	dataAttributes: [
		stateDataAttr,
		defineSimpleDataAttr({
			name: "dialog-overlay",
			description: "Present on the overlay.",
		}),
	],
});

export const portal = defineComponentApiSchema<DialogPortalPropsWithoutHTML>({
	title: "Portal",
	description: "A portal which renders the dialog into the body when it is open.",
	props: portalProps,
});

export const dialog = [root, trigger, portal, content, overlay, close, title, description];
