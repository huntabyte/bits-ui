import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { createPinInput, type CreatePinInputProps as PinInputProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

export function getPinInputData() {
	const NAME = "pin-input" as const;
	const PARTS = ["root", "input", "hidden-input"] as const;

	return {
		NAME,
		PARTS,
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: PinInputProps) {
	const { NAME, PARTS } = getPinInputData();
	const getAttrs = createBitAttrs(NAME, PARTS);

	const pinInput = { ...createPinInput(removeUndefined(props)), getAttrs };
	setContext(NAME, pinInput);
	return {
		...pinInput,
		updateOption: getOptionUpdater(pinInput.options),
	};
}

export function getCtx() {
	const { NAME } = getPinInputData();
	return getContext<GetReturn>(NAME);
}
