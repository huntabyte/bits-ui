import {
	createDialog,
	type Dialog as AlertDialogReturn,
	type CreateDialogProps as CreateAlertDialogProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import {
	createBitAttrs,
	getOptionUpdater,
	removeUndefined,
	type TOpen,
	type TransitionTimesProp
} from "$lib/internal/index.js";

const NAME = "alert-dialog";
const PARTS = [
	"action",
	"cancel",
	"content",
	"description",
	"overlay",
	"portal",
	"title",
	"trigger"
] as const;

const getAttrs = createBitAttrs(NAME, PARTS);

export const ctx = {
	set,
	get,
	getAttrs
};

type SetProps = CreateAlertDialogProps & TransitionTimesProp & TOpen;

type GetReturn = AlertDialogReturn & TransitionTimesProp & TOpen;

function set(props: SetProps) {
	const alertDialog = createDialog({
		...removeUndefined(props),
		role: "alertdialog"
	});
	setContext(NAME, {
		...alertDialog,
		transitionTimes: props.transitionTimes,
		tOpen: props.tOpen
	});
	return {
		...alertDialog,
		updateOption: getOptionUpdater(alertDialog.options)
	};
}

function get() {
	return getContext<GetReturn>(NAME);
}
