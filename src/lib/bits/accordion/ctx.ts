import { createAccordion, type CreateAccordionProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import type { ItemProps } from "./types.js";
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
		updateOption: getOptionUpdater(initAccordion.options)
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
	setContext(ITEM_NAME, { ...props });
	const ctx = getCtx();
	return { ...ctx, props };
}

export function getItemProps() {
	const { ITEM_NAME } = getAccordionData();
	return getContext<ItemProps>(ITEM_NAME);
}

export function getContent() {
	const ctx = getCtx();
	const { value: props } = getItemProps();
	return {
		...ctx,
		props
	};
}

export function getTrigger() {
	const ctx = getCtx();
	const { value, disabled } = getItemProps();
	return {
		...ctx,
		props: { value, disabled }
	};
}
