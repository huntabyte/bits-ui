import { getContext, setContext } from "svelte";
import type { OnChangeFn } from "$lib/internal";
import { removeUndefined } from "../../../internal/object";

/**
 * BASE
 */
export type AccordionBaseStateProps = {
	el?: HTMLElement | null;
	disabled?: boolean;
	forceVisible?: boolean;
};

const defaultAccordionRootBaseProps = {
	el: null,
	disabled: false,
	forceVisible: false
} satisfies Required<AccordionBaseStateProps>;

class AccordionBaseState {
	el: HTMLElement | null = $state(null);
	disabled: boolean = $state(false);
	forceVisible: boolean = $state(false);

	constructor(props: AccordionBaseStateProps = {}) {
		const mergedProps = {
			...defaultAccordionRootBaseProps,
			...removeUndefined(props)
		} satisfies AccordionBaseStateProps;
		this.el = mergedProps.el;
		this.disabled = mergedProps.disabled;
		this.forceVisible = mergedProps.forceVisible;
	}
}

/**
 * SINGLE
 */

export type AccordionSingleStateProps = {
	value?: string;
	onValueChange?: OnChangeFn<string>;
} & AccordionBaseStateProps;

const defaultAccordionRootSingleProps: Required<AccordionSingleStateProps> = {
	value: "",
	onValueChange: () => {},
	...defaultAccordionRootBaseProps
} satisfies Required<AccordionSingleStateProps>;

export class AccordionSingleState extends AccordionBaseState {
	value: string = $state("");
	onValueChange: OnChangeFn<string>;
	isMulti = false as const;

	constructor(props: AccordionSingleStateProps = {}) {
		const mergedProps = {
			...defaultAccordionRootSingleProps,
			...removeUndefined(props)
		} satisfies AccordionSingleStateProps;
		super(mergedProps);
		this.value = mergedProps.value;
		this.onValueChange = mergedProps.onValueChange;

		$effect(() => {
			this.onValueChange?.(this.value);
		});
	}
}

/**
 * MULTIPLE
 */
export type AccordionMultiStateProps = {
	value?: string[];
	onValueChange?: OnChangeFn<string[]>;
} & AccordionBaseStateProps;

const defaultAccordionRootMultiProps = {
	value: [],
	onValueChange: () => {},
	...defaultAccordionRootBaseProps
} satisfies Required<AccordionMultiStateProps>;

export class AccordionMultiState extends AccordionBaseState {
	value: string[] = $state([]);
	onValueChange?: (value: string[]) => void;
	isMulti = true as const;

	constructor(props: AccordionMultiStateProps = {}) {
		const mergedProps = {
			...defaultAccordionRootMultiProps,
			...removeUndefined(props)
		} satisfies AccordionMultiStateProps;
		super(mergedProps);

		this.value.push(...mergedProps.value);
		this.onValueChange = mergedProps.onValueChange;

		$effect(() => {
			this.onValueChange?.(this.value);
		});
	}
}

/**
 * ITEM
 */

type AccordionItemStateProps = {
	value: string;
	disabled?: boolean;
	rootState: AccordionState;
};

export class AccordionItemState {
	value: string = $state("");
	disabled: boolean = $state(false);
	isSelected: boolean = $state(false);
	rootState: AccordionState;

	constructor(props: AccordionItemStateProps) {
		this.value = props.value;
		this.disabled = props.disabled ?? false;
		this.rootState = props.rootState;

		$effect(() => {
			if (this.rootState.isMulti) {
				this.isSelected = this.rootState.value.includes(this.value);
			} else {
				this.isSelected = this.rootState.value === this.value;
			}
		});
	}

	updateValue() {
		if (this.rootState.isMulti) {
			if (this.rootState.value.includes(this.value)) {
				this.rootState.value = this.rootState.value.filter((v) => v !== this.value);
			} else {
				this.rootState.value.push(this.value);
			}
		} else {
			if (this.rootState.value === this.value) {
				this.rootState.value = "";
			} else {
				this.rootState.value = this.value;
			}
		}
	}
}

/**
 * CONTEXT
 */

const ACCORDION_ROOT_CONTEXT = "ACCORDION_ROOT_CONTEXT";
const ACCORDION_ITEM_CONTEXT = "ACCORDION_ITEM_CONTEXT";

type AccordionState = AccordionSingleState | AccordionMultiState;

export function setAccordionRootContext(ctx: AccordionState) {
	setContext(ACCORDION_ROOT_CONTEXT, ctx);
}

export function getAccordionRootContext(): AccordionState {
	return getContext(ACCORDION_ROOT_CONTEXT);
}

export function setAccordionItemContext(ctx: AccordionItemState) {
	setContext(ACCORDION_ITEM_CONTEXT, ctx);
}

export function getAccordionItemContext(): AccordionItemState {
	return getContext(ACCORDION_ITEM_CONTEXT);
}
