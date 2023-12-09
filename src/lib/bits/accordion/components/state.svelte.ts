import { getContext, setContext } from "svelte"
import type { AccordionItemContext, AccordionRootContext } from "./types"

type AccordionValueProps =
	| {
			value: string;
			onValueChange?: (value: string) => void;
	  }
	| string;

export class AccordionValue {
	value = $state("");
	onValueChange?: (value: string) => void;

	isMulti = false as const;

	constructor(props: AccordionValueProps = "") {
		if (typeof props === "string") {
			this.value = props;
		} else {
			this.value = props.value;
			this.onValueChange = props.onValueChange;
		}

		$effect(() => {
			this.onValueChange?.(this.value);
		});
	}
}

type AccordionMultiValueProps =
	| {
			value: string[];
			onValueChange?: (value: string[]) => void;
	  }
	| string[];

export class AccordionMultiValue {
	value: string[] = $state([]);
	onValueChange?: (value: string[]) => void;

	isMulti = true as const;

	constructor(props: AccordionMultiValueProps = []) {
		if (Array.isArray(props)) {
			this.value.push(...props);
		} else {
			this.value.push(...props.value)
			this.onValueChange = props.onValueChange;
		}

		$effect(() => {
			this.onValueChange?.(this.value);
		});
	}
}



const ACCORDION_ROOT_CONTEXT = "ACCORDION_ROOT_CONTEXT"
const ACCORDION_ITEM_CONTEXT = "ACCORDION_ITEM_CONTEXT"

export function setAccordionRootContext(ctx: AccordionRootContext) {
	setContext(ACCORDION_ROOT_CONTEXT, ctx)
}

export function getAccordionRootContext(): AccordionRootContext {
	return getContext(ACCORDION_ROOT_CONTEXT)
}

export function setAccordionItemContext(ctx: AccordionItemContext) {
	setContext(ACCORDION_ITEM_CONTEXT, ctx)
}

export function getAccordionItemContext(): AccordionItemContext {
	return getContext(ACCORDION_ITEM_CONTEXT)
}

