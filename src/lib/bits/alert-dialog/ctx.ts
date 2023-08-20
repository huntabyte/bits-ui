import {
	createDialog,
	type Dialog as AlertDialogReturn,
	type CreateDialogProps as CreateAlertDialogProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { getOptionUpdater, removeUndefined } from "$internal/index.js";

const NAME = "AlertDialog";

function set(props: CreateAlertDialogProps) {
	const alertDialog = createDialog({
		...removeUndefined(props),
		role: "alertdialog"
	});
	setContext(NAME, alertDialog);
	return {
		...alertDialog,
		updateOption: getOptionUpdater(alertDialog.options)
	};
}

function get() {
	return getContext<AlertDialogReturn>(NAME);
}

export const ctx = {
	set: set,
	get: get
};
