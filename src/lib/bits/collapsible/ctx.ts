import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import {
	createCollapsible,
	type Collapsible as CollapsibleReturn,
	type CreateCollapsibleProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "collapsible";
const PARTS = ["root", "content", "trigger"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = CollapsibleReturn;

export function setCtx(props: CreateCollapsibleProps) {
	const collapsible = createCollapsible(removeUndefined(props));
	setContext(NAME, collapsible);
	return {
		...collapsible,
		updateOption: getOptionUpdater(collapsible.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
