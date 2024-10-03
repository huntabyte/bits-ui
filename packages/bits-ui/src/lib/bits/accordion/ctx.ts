import { type CreateAccordionProps, createAccordion } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { type Writable, writable } from "svelte/store";
import type { ItemProps } from "./index.js";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

function getAccordionData() {
	const NAME = "accordion" as const;
	const ITEM_NAME = "accordion-item";
	const PARTS = ["root", "content", "header", "item", "trigger"] as const;

	return { NAME, ITEM_NAME, PARTS };
}

export function setCtx<Multiple extends boolean>(props: CreateAccordionProps<Multiple>) {
	const initAccordion = createAccordion(removeUndefined(props));
	const { NAME, PARTS } = getAccordionData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const accordion = {
		...initAccordion,
		getAttrs,
		updateOption: getOptionUpdater(initAccordion.options),
	};

	setContext(NAME, accordion);
	return accordion;
}

export function getCtx() {
	const { NAME } = getAccordionData();
	return getContext<ReturnType<typeof setCtx>>(NAME);
}

export function setItem(props: ItemProps) {
	const { ITEM_NAME } = getAccordionData();
	const propsStore = writable(props);
	setContext(ITEM_NAME, { propsStore });
	const ctx = getCtx();
	return { ...ctx, propsStore };
}

export function getItemProps() {
	const { ITEM_NAME } = getAccordionData();
	return getContext<{ propsStore: Writable<ItemProps> }>(ITEM_NAME);
}

export function getContent() {
	const ctx = getCtx();
	const { propsStore } = getItemProps();
	return {
		...ctx,
		propsStore,
	};
}

export function getTrigger() {
	const ctx = getCtx();
	const { propsStore } = getItemProps();
	return {
		...ctx,
		props: propsStore,
	};
}
