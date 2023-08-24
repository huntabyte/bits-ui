import { createTabs, type CreateTabsProps, type Tabs as TabsReturn } from "@melt-ui/svelte";
import { getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { getContext, setContext } from "svelte";

const NAME = "Tabs";

export const ctx = {
	set,
	get
};

function set(props: CreateTabsProps) {
	const tabs = createTabs(removeUndefined(props));
	setContext(NAME, tabs);
	return {
		...tabs,
		updateOption: getOptionUpdater(tabs.options)
	};
}

function get() {
	return getContext<TabsReturn>(NAME);
}
