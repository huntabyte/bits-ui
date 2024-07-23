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
import { focusProp } from "$lib/content/api-reference/extended-types/index.js";
import {
	builderAndAttrsSlotProps,
	childrenSnippet,
	dismissableLayerProps,
	domElProps,
	enums,
	escapeLayerProps,
	focusScopeProps,
	forceMountProp,
	idsSlotProp,
	onOutsideClickProp,
	portalProp,
	portalProps,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	transitionProps,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/api.js";

const root: APISchema<AlertDialogRootPropsWithoutHTML> = {
	title: "Root",
	description: "The root component used to set and manage the state of the alert dialog.",
	slotProps: {
		ids: idsSlotProp,
	},
	props: {
		open: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "Whether or not the alert dialog is open.",
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
};

const action: APISchema<AlertDialogActionPropsWithoutHTML> = {
	title: "Action",
	description: "A button used to close the alert dialog by taking an action.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "alert-dialog-action",
			description: "Present on the action button.",
		},
	],
};

const cancel: APISchema<AlertDialogCancelPropsWithoutHTML> = {
	title: "Cancel",
	description: "A button used to close the alert dialog without taking an action.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "alert-dialog-cancel",
			description: "Present on the cancel button.",
		},
	],
};

const content: APISchema<AlertDialogContentPropsWithoutHTML> = {
	title: "Content",
	description: "The content displayed within the alert dialog modal.",
	props: {
		...dismissableLayerProps,
		...escapeLayerProps,
		...focusScopeProps,
		forceMount: forceMountProp,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		preventScroll: preventScrollProp(),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The state of the alert dialog.",
			isEnum: true,
		},
		{
			name: "alert-dialog-content",
			description: "Present on the content.",
		},
	],
};

const title: APISchema<AlertDialogTitlePropsWithoutHTML> = {
	title: "Title",
	description: "An accessibile title for the alert dialog.",
	props: {
		level: {
			type: {
				type: "enum",
				definition: enums("h1", "h2", "h3", "h4", "h5", "h6"),
			},
			description: "The heading level of the title.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "alert-dialog-title",
			description: "Present on the title.",
		},
	],
};

const description: APISchema<AlertDialogDescriptionPropsWithoutHTML> = {
	title: "Description",
	description: "An accessibile description for the alert dialog.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "alert-dialog-description",
			description: "Present on the description.",
		},
	],
};

const trigger: APISchema<AlertDialogTriggerPropsWithoutHTML> = {
	title: "Trigger",
	description: "The element which opens the alert dialog on press.",
	props: {
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "alert-dialog-trigger",
			description: "Present on the trigger.",
		},
	],
};

const overlay: APISchema<AlertDialogOverlayPropsWithoutHTML> = {
	title: "Overlay",
	description: "An overlay which covers the body when the alert dialog is open.",
	props: {
		...withChildProps({ elType: "HTMLDivElement" }),
		forceMount: forceMountProp,
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The state of the alert dialog.",
			isEnum: true,
		},
		{
			name: "alert-dialog-overlay",
			description: "Present on the overlay.",
		},
	],
};

const portal: APISchema<AlertDialogPortalPropsWithoutHTML> = {
	title: "Portal",
	description: "A portal which renders the alert dialog into the body when it is open.",
	props: portalProps,
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "alert-dialog-portal",
			description: "Present on the portal.",
		},
	],
};

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
