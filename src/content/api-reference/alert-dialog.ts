import type { APISchema } from "@/types/api.js";
import {
	domElProps,
	enums,
	idsSlotProp,
	portalProp,
	transitionProps,
	builderAndAttrsSlotProps,
	onOutsideClickProp
} from "@/content/api-reference/helpers.js";
import * as C from "@/content/constants.js";
import { focusProp } from "@/content/api-reference/extended-types/index.js";
import type * as AlertDialog from "$lib/bits/alert-dialog/_types.js";

const root: APISchema<AlertDialog.Props> = {
	title: "Root",
	description: "The root component used to set and manage the state of the alert dialog.",
	slotProps: {
		ids: idsSlotProp
	},
	props: {
		preventScroll: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether or not to prevent scroll on the body when the alert dialog is open."
		},
		closeOnEscape: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether to close the alert dialog when the escape key is pressed."
		},
		closeOnOutsideClick: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether to close the alert dialog when a click occurs outside of it."
		},
		open: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "Whether or not the alert dialog is open."
		},
		onOpenChange: {
			type: {
				type: C.FUNCTION,
				definition: "(open: boolean) => void"
			},
			description: "A callback function called when the open state changes."
		},
		openFocus: {
			type: focusProp,
			description: "Override the initial focus when the alert dialog is opened."
		},
		closeFocus: {
			type: focusProp,
			description: "Override the focus when the alert dialog is closed."
		},
		portal: { ...portalProp("alert dialog") },
		onOutsideClick: onOutsideClickProp
	}
};

const action: APISchema<AlertDialog.ActionProps> = {
	title: "Action",
	description: "A button used to close the alert dialog by taking an action.",
	props: domElProps("HTMLButtonElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "alert-dialog-action",
			description: "Present on the action button."
		}
	]
};

const cancel: APISchema<AlertDialog.CancelProps> = {
	title: "Cancel",
	description: "A button used to close the alert dialog without taking an action.",
	props: domElProps("HTMLButtonElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "alert-dialog-cancel",
			description: "Present on the cancel button."
		}
	]
};

const content: APISchema<AlertDialog.ContentProps> = {
	title: "Content",
	description: "The content displayed within the alert dialog modal.",
	props: { ...transitionProps, ...domElProps("HTMLDivElement") },
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The state of the alert dialog.",
			isEnum: true
		},
		{
			name: "alert-dialog-content",
			description: "Present on the content."
		}
	]
};

const title: APISchema<AlertDialog.TitleProps> = {
	title: "Title",
	description: "An accessibile title for the alert dialog.",
	props: {
		...domElProps("HTMLHeadingElement"),
		level: {
			type: {
				type: "enum",
				definition: enums("h1", "h2", "h3", "h4", "h5", "h6")
			},
			description: "The heading level of the title."
		}
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "alert-dialog-title",
			description: "Present on the title."
		}
	]
};

const description: APISchema<AlertDialog.DescriptionProps> = {
	title: "Description",
	description: "An accessibile description for the alert dialog.",
	props: domElProps("HTMLDivElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "alert-dialog-description",
			description: "Present on the description."
		}
	]
};

const trigger: APISchema<AlertDialog.TriggerProps> = {
	title: "Trigger",
	description: "The element which opens the alert dialog on press.",
	props: domElProps("HTMLButtonElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "alert-dialog-trigger",
			description: "Present on the trigger."
		}
	]
};

const overlay: APISchema<AlertDialog.OverlayProps> = {
	title: "Overlay",
	description: "An overlay which covers the body when the alert dialog is open.",
	props: { ...transitionProps, ...domElProps("HTMLDivElement") },
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The state of the alert dialog.",
			isEnum: true
		},
		{
			name: "alert-dialog-overlay",
			description: "Present on the overlay."
		}
	]
};

const portal: APISchema<AlertDialog.PortalProps> = {
	title: "Portal",
	description: "A portal which renders the alert dialog into the body when it is open.",
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "portal",
			description: "Present if the `portal` prop is not `null`."
		},
		{
			name: "alert-dialog-portal",
			description: "Present on the portal."
		}
	]
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
	description
];
