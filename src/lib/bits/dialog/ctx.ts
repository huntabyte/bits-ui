import { createDialog, type CreateDialogProps, type Dialog as DialogReturn } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import {
	getOptionUpdater,
	removeUndefined,
	type TOpen,
	type TransitionTimesProp
} from "$lib/internal/index.js";

const NAME = "Dialog";

type SetProps = CreateDialogProps & TransitionTimesProp & TOpen;

type CtxReturn = DialogReturn & TransitionTimesProp & TOpen;

export const ctx = {
	set,
	get
};

function set(props: SetProps) {
	const dialog = createDialog({ ...removeUndefined(props), role: "dialog" });
	setContext(NAME, { ...dialog, transitionTimes: props.transitionTimes, tOpen: props.tOpen });
	return {
		...dialog,
		updateOption: getOptionUpdater(dialog.options)
	};
}

function get() {
	return getContext<CtxReturn>(NAME);
}
