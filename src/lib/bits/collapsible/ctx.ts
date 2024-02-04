import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { createCollapsible, type CreateCollapsibleProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

export function getCollapsibleData() {
	const NAME = "collapsible" as const;
	const PARTS = ["root", "content", "trigger"] as const;

	return {
		NAME,
		PARTS,
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: CreateCollapsibleProps) {
	const { NAME, PARTS } = getCollapsibleData();
	const getAttrs = createBitAttrs(NAME, PARTS);

	const collapsible = { ...createCollapsible(removeUndefined(props)), getAttrs };
	setContext(NAME, collapsible);
	return {
		...collapsible,
		updateOption: getOptionUpdater(collapsible.options),
	};
}

export function getCtx() {
	const { NAME } = getCollapsibleData();
	return getContext<GetReturn>(NAME);
}
