import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import {
	createCollapsible,
	type Collapsible as CollapsibleReturn,
	type CreateCollapsibleProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "collapsible";
const PARTS = ["root", "content", "trigger"] as const;

const getAttrs = createBitAttrs(NAME, PARTS);

export const ctx = {
	get,
	set,
	getAttrs
};

type GetReturn = CollapsibleReturn;

function set(props: CreateCollapsibleProps) {
	const collapsible = createCollapsible(removeUndefined(props));
	setContext(NAME, collapsible);
	return {
		...collapsible,
		updateOption: getOptionUpdater(collapsible.options)
	};
}

function get() {
	return getContext<GetReturn>(NAME);
}
