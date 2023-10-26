import { createTabs, type CreateTabsProps, type Tabs as TabsReturn } from "@melt-ui/svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { getContext, setContext } from "svelte";

const NAME = "tabs";
const PARTS = ["root", "content", "list", "trigger"] as const;

const getAttrs = createBitAttrs(NAME, PARTS);

export const ctx = {
	set,
	get,
	getAttrs
};

type GetReturn = TabsReturn;

function set(props: CreateTabsProps) {
	const tabs = createTabs(removeUndefined(props));
	setContext(NAME, tabs);
	return {
		...tabs,
		updateOption: getOptionUpdater(tabs.options)
	};
}

function get() {
	return getContext<GetReturn>(NAME);
}
