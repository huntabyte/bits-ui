import { createTabs, type CreateTabsProps, type Tabs as TabsReturn } from "@melt-ui/svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { getContext, setContext } from "svelte";

const NAME = "tabs";
const PARTS = ["root", "content", "list", "trigger"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = TabsReturn;

export function setCtx(props: CreateTabsProps) {
	const tabs = createTabs(removeUndefined(props));
	setContext(NAME, tabs);
	return {
		...tabs,
		updateOption: getOptionUpdater(tabs.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
