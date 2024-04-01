import { type CreateTabsProps, createTabs } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

function getTabsData() {
	const NAME = "tabs" as const;
	const PARTS = ["root", "content", "list", "trigger"] as const;
	return {
		NAME,
		PARTS,
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: CreateTabsProps) {
	const { NAME, PARTS } = getTabsData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const tabs = { ...createTabs(removeUndefined(props)), getAttrs };
	setContext(NAME, tabs);
	return {
		...tabs,
		updateOption: getOptionUpdater(tabs.options),
	};
}

export function getCtx() {
	const { NAME } = getTabsData();
	return getContext<GetReturn>(NAME);
}
