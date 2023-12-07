import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import {
	createPinInput,
	type PinInput as PinInputReturn,
	type CreatePinInputProps as PinInputProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "pin-input";

const PARTS = ["root", "input", "hidden-input"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = PinInputReturn;

export function setCtx(props: PinInputProps) {
	const pinInput = createPinInput(removeUndefined(props));
	setContext(NAME, pinInput);
	return {
		...pinInput,
		updateOption: getOptionUpdater(pinInput.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
