import { createDialog, type CreateDialogProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

export function getDialogData() {
	const NAME = "dialog" as const;
	const PARTS = [
		"close",
		"content",
		"description",
		"overlay",
		"portal",
		"title",
		"trigger",
	] as const;

	return {
		NAME,
		PARTS,
	};
}

type SetProps = CreateDialogProps;
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: SetProps) {
	const { NAME, PARTS } = getDialogData();
	const getAttrs = createBitAttrs(NAME, PARTS);

	const dialog = {
		...createDialog({ ...removeUndefined(props), role: "dialog", forceVisible: true }),
		getAttrs,
	};

	setContext(NAME, dialog);
	return {
		...dialog,
		updateOption: getOptionUpdater(dialog.options),
	};
}

export function getCtx() {
	const { NAME } = getDialogData();
	return getContext<GetReturn>(NAME);
}
