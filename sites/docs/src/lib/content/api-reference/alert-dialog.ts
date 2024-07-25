import type {
	AlertDialogActionPropsWithoutHTML,
	AlertDialogCancelPropsWithoutHTML,
	AlertDialogContentPropsWithoutHTML,
	AlertDialogDescriptionPropsWithoutHTML,
	AlertDialogOverlayPropsWithoutHTML,
	AlertDialogPortalPropsWithoutHTML,
	AlertDialogRootPropsWithoutHTML,
	AlertDialogTitlePropsWithoutHTML,
	AlertDialogTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	childrenSnippet,
	createUnionProp,
	dismissableLayerProps,
	escapeLayerProps,
	focusScopeProps,
	forceMountProp,
	portalProps,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/api.js";

function createApiSchema<T>(schema: APISchema<T>) {
	return schema;
}

const root = createApiSchema<AlertDialogRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component used to set and manage the state of the alert dialog.",
	props: {
		open: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "Whether or not the alert dialog is open.",
			bindable: true,
		},
		onOpenChange: {
			type: {
				type: C.FUNCTION,
				definition: "(open: boolean) => void",
			},
			description: "A callback function called when the open state changes.",
		},
		children: childrenSnippet(),
	},
});

const action = createApiSchema<AlertDialogActionPropsWithoutHTML>({
	title: "Action",
	description: "A button used to close the alert dialog by taking an action.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
});

const cancel = createApiSchema<AlertDialogCancelPropsWithoutHTML>({
	title: "Cancel",
	description: "A button used to close the alert dialog without taking an action.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
});

const content = createApiSchema<AlertDialogContentPropsWithoutHTML>({
	title: "Content",
	description: "The content displayed within the alert dialog modal.",
	props: {
		...dismissableLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		forceMount: forceMountProp,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		preventScroll: preventScrollProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

const title = createApiSchema<AlertDialogTitlePropsWithoutHTML>({
	title: "Title",
	description: "An accessibile title for the alert dialog.",
	props: {
		level: createUnionProp({
			options: ["1", "2", "3", "4", "5", "6"],
			description:
				"The heading level of the title. This will be set as the `aria-level` attribute.",
			default: "3",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

const description = createApiSchema<AlertDialogDescriptionPropsWithoutHTML>({
	title: "Description",
	description: "An accessibile description for the alert dialog.",
	props: withChildProps({ elType: "HTMLDivElement" }),
});

const trigger = createApiSchema<AlertDialogTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The element which opens the alert dialog on press.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
});

const overlay = createApiSchema<AlertDialogOverlayPropsWithoutHTML>({
	title: "Overlay",
	description: "An overlay which covers the body when the alert dialog is open.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

const portal = createApiSchema<AlertDialogPortalPropsWithoutHTML>({
	title: "Portal",
	description: "A portal which renders the alert dialog into the body when it is open.",
	props: portalProps,
});

export const alertDialog = [
	root,
	trigger,
	content,
	overlay,
	portal,
	action,
	cancel,
	title,
	description,
];
