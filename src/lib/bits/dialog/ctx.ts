import { createDialog, type CreateDialogProps, type Dialog as DialogReturn } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

const NAME = "dialog";
const PARTS = ["close", "content", "description", "overlay", "portal", "title", "trigger"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type SetProps = CreateDialogProps;

type GetReturn = DialogReturn;

export function setCtx(props: SetProps) {
	const dialog = createDialog({ ...removeUndefined(props), role: "dialog" });
	setContext(NAME, dialog);
	return {
		...dialog,
		updateOption: getOptionUpdater(dialog.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
