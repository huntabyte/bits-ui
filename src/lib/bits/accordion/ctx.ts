import {
	createAccordion,
	type Accordion as AccordionReturn,
	type CreateAccordionProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import type { AccordionItemProps } from "./types.js";
import { getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

const NAME = "Accordion";
const ITEM_NAME = "AccordionItem";

export const ctx = {
	set,
	get,
	setItem,
	getItemProps,
	getContent,
	getTrigger
};

type GetReturn = AccordionReturn;

function set<Multiple extends boolean>(props: CreateAccordionProps<Multiple>) {
	const accordion = createAccordion(removeUndefined(props));
	setContext(NAME, accordion);
	return {
		...accordion,
		updateOption: getOptionUpdater(accordion.options)
	};
}

function get() {
	return getContext<GetReturn>(NAME);
}

function setItem(props: AccordionItemProps) {
	setContext(ITEM_NAME, { ...props });
	const {
		elements: { item }
	} = get();
	return { item, props };
}

function getItemProps() {
	const itemProps = getContext<AccordionItemProps>(ITEM_NAME);
	return itemProps;
}

function getContent() {
	const {
		elements: { content },
		helpers: { isSelected },
		states: { value }
	} = get();
	const { value: props } = getItemProps();
	return { content, props, isSelected, value };
}

function getTrigger() {
	const {
		elements: { trigger }
	} = get();
	const { value: props } = getItemProps();
	return { props, trigger };
}
