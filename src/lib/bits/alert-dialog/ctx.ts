import {
	createDialog,
	type Dialog as AlertDialogReturn,
	type CreateDialogProps as CreateAlertDialogProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

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

type SetProps = CreateAlertDialogProps;
type GetReturn = AlertDialogReturn;

export const getAttrs = createBitAttrs(NAME, PARTS);

export function setCtx(props: SetProps) {
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

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
