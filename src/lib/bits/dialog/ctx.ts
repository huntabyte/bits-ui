import { createDialog, type CreateDialogProps, type Dialog as DialogReturn } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import {
	createBitAttrs,
	getOptionUpdater,
	removeUndefined,
	type TOpen,
	type TransitionTimesProp
} from "$lib/internal/index.js";

const NAME = "dialog";
const PARTS = ["close", "content", "description", "overlay", "portal", "title", "trigger"] as const;

const getAttrs = createBitAttrs(NAME, PARTS);

type SetProps = CreateDialogProps & TransitionTimesProp & TOpen;

type GetReturn = DialogReturn & TransitionTimesProp & TOpen;

export const ctx = {
	set,
	get,
	getAttrs
};

function set(props: SetProps) {
	const dialog = createDialog({ ...removeUndefined(props), role: "dialog" });
	setContext(NAME, {
		...dialog,
		transitionTimes: props.transitionTimes,
		tOpen: props.tOpen
	});
	return {
		...dialog,
		updateOption: getOptionUpdater(dialog.options)
	};
}

function get() {
	return getContext<GetReturn>(NAME);
}
