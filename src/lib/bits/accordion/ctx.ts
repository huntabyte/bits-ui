import {
	createAccordion,
	type Accordion as AccordionReturn,
	type CreateAccordionProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import type { ItemProps } from "./types.js";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

const NAME = "accordion";
const ITEM_NAME = "accordion-item";
const PARTS = ["root", "content", "header", "item", "trigger"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = AccordionReturn;

export function setCtx<Multiple extends boolean>(props: CreateAccordionProps<Multiple>) {
	const accordion = createAccordion(removeUndefined(props));
	setContext(NAME, accordion);
	return {
		...accordion,
		updateOption: getOptionUpdater(accordion.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}

export function setItem(props: ItemProps) {
	setContext(ITEM_NAME, { ...props });
	const {
		elements: { item }
	} = getCtx();
	return { item, props };
}

export function getItemProps() {
	const itemProps = getContext<ItemProps>(ITEM_NAME);
	return itemProps;
}

export function getContent() {
	const {
		elements: { content },
		helpers: { isSelected },
		states: { value }
	} = getCtx();
	const { value: props } = getItemProps();
	return { content, props, isSelected, value };
}

export function getTrigger() {
	const {
		elements: { trigger }
	} = getCtx();
	const { value, disabled } = getItemProps();
	return { props: { value, disabled }, trigger };
}
