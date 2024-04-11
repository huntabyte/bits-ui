import { getContext, setContext } from "svelte";
import {
	type EventCallback,
	type OnChangeFn,
	composeHandlers,
	dataDisabledAttrs,
	kbd,
	openClosedAttrs,
	removeUndefined,
	verifyContextDeps,
} from "$lib/internal/index.js";

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
	forceVisible: false,
} satisfies Required<AccordionBaseStateProps>;

class AccordionBaseState {
	el: HTMLElement | null | undefined = $state();
	disabled: boolean = $state(false);
	forceVisible: boolean = $state(false);

	constructor(props: AccordionBaseStateProps = {}) {
		const mergedProps = {
			...defaultAccordionRootBaseProps,
			...removeUndefined(props),
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
	...defaultAccordionRootBaseProps,
} satisfies Required<AccordionSingleStateProps>;

export class AccordionSingleState extends AccordionBaseState {
	value: string = $state("");
	onValueChange: OnChangeFn<string>;
	isMulti = false as const;

	constructor(props: AccordionSingleStateProps = {}) {
		const mergedProps = {
			...defaultAccordionRootSingleProps,
			...removeUndefined(props),
		} satisfies AccordionSingleStateProps;
		super(mergedProps);
		this.value = mergedProps.value;
		this.onValueChange = mergedProps.onValueChange;

		$effect.pre(() => {
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
	...defaultAccordionRootBaseProps,
} satisfies Required<AccordionMultiStateProps>;

export class AccordionMultiState extends AccordionBaseState {
	value: string[] = $state([]);
	onValueChange?: (value: string[]) => void;
	isMulti = true as const;

	constructor(props: AccordionMultiStateProps = {}) {
		const mergedProps = {
			...defaultAccordionRootMultiProps,
			...removeUndefined(props),
		} satisfies AccordionMultiStateProps;
		super(mergedProps);

		this.value.push(...mergedProps.value);
		this.onValueChange = mergedProps.onValueChange;

		$effect.pre(() => {
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
	root: AccordionState;

	constructor(props: AccordionItemStateProps) {
		this.value = props.value;
		this.disabled = props?.disabled ?? false;
		this.root = props.rootState;

		$effect(() => {
			if (this.root.isMulti) {
				this.isSelected = this.root.value.includes(this.value);
			} else {
				this.isSelected = this.root.value === this.value;
			}
		});
	}

	updateValue() {
		if (this.root.isMulti) {
			if (this.root.value.includes(this.value)) {
				this.root.value = this.root.value.filter((v) => v !== this.value);
			} else {
				this.root.value.push(this.value);
			}
		} else {
			if (this.root.value === this.value) {
				this.root.value = "";
			} else {
				this.root.value = this.value;
			}
		}
	}

	createTrigger(props: AccordionTriggerStateProps) {
		return new AccordionTriggerState(props, this);
	}

	createContent() {
		return new AccordionContentState(this);
	}
}

/**
 * TRIGGER
 */

type AccordionTriggerStateProps = {
	onclick?: (e: MouseEvent) => void;
	onkeydown?: (e: KeyboardEvent) => void;
	disabled: boolean;
};

const defaultAccordionTriggerProps = {
	disabled: false,
	el: null,
	handlers: {
		click: undefined,
		keydown: undefined,
	},
};

class AccordionTriggerState {
	disabled: boolean = $state(false);
	el: HTMLElement | null | undefined = $state();
	root: AccordionState = undefined as unknown as AccordionState;
	itemState: AccordionItemState = undefined as unknown as AccordionItemState;
	handlers: {
		click: EventCallback<MouseEvent> | undefined;
		keydown: EventCallback<KeyboardEvent> | undefined;
	} = $state(defaultAccordionTriggerProps.handlers);
	isDisabled: boolean = $state(false);
	attrs: Record<string, unknown> = $derived({
		disabled: this.disabled,
		"aria-expanded": this.itemState.isSelected ? "true" : "false",
		"aria-disabled": this.isDisabled ? "true" : "false",
		"data-disabled": this.isDisabled ? "" : undefined,
		"data-value": this.itemState.value,
		"data-state": openClosedAttrs(this.itemState.isSelected),
		"data-accordion-trigger": "",
	});

	constructor(props: AccordionTriggerStateProps, itemState: AccordionItemState) {
		this.disabled = props.disabled || itemState.disabled || itemState.root.disabled;
		this.itemState = itemState;
		this.root = itemState.root;
		this.handlers.click = props.onclick;
		this.handlers.keydown = props.onkeydown;

		$effect(() => {
			this.isDisabled = this.disabled || this.itemState.disabled || this.root.disabled;
		});
	}

	onclick = composeHandlers<MouseEvent>(this.handlers.click, () => {
		if (this.isDisabled) return;
		this.itemState.updateValue();
	});

	onkeydown = composeHandlers<KeyboardEvent>(this.handlers.keydown, (e: KeyboardEvent) => {
		const handledKeys = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.HOME, kbd.END, kbd.SPACE, kbd.ENTER];
		if (this.isDisabled || !handledKeys.includes(e.key)) return;

		e.preventDefault();

		if ([kbd.SPACE, kbd.ENTER].includes(e.key)) {
			this.itemState.updateValue();
			return;
		}

		if (!this.root.el || !this.el) return;

		const items = Array.from(
			this.root.el.querySelectorAll<HTMLElement>("[data-accordion-trigger]")
		);
		if (!items.length) return;

		const candidateItems = items.filter((item) => !item.dataset.disabled);
		if (!candidateItems.length) return;

		const currentIndex = candidateItems.indexOf(this.el);

		switch (e.key) {
			case kbd.ARROW_DOWN:
				candidateItems[(currentIndex + 1) % candidateItems.length]?.focus();
				return;
			case kbd.ARROW_UP:
				candidateItems[
					(currentIndex - 1 + candidateItems.length) % candidateItems.length
				]?.focus();
				return;
			case kbd.HOME:
				candidateItems[0]?.focus();
				return;
			case kbd.END:
				candidateItems[candidateItems.length - 1]?.focus();
		}
	});

	get props() {
		return {
			...this.attrs,
			onclick: this.onclick,
			onkeydown: this.onkeydown,
		};
	}
}

/**
 * CONTENT
 */

class AccordionContentState {
	item: AccordionItemState = undefined as unknown as AccordionItemState;
	attrs: Record<string, unknown> = $derived({
		"data-state": openClosedAttrs(this.item.isSelected),
		"data-disabled": dataDisabledAttrs(this.item.root.disabled || this.item.disabled),
		"data-value": this.item.value,
		"data-accordion-content": "",
	});

	constructor(item: AccordionItemState) {
		this.item = item;
	}

	get props() {
		return this.attrs;
	}
}

/**
 * CONTEXT METHODS
 */

export const ACCORDION_ROOT = Symbol("Accordion.Root");
export const ACCORDION_ITEM = Symbol("Accordion.Item");

type AccordionState = AccordionSingleState | AccordionMultiState;

type SingleInitAccordionProps = {
	type: "single";
	value?: string;
};

type MultiInitAccordionProps = {
	type: "multiple";
	value?: string[];
};


export function setAccordionRootState(props: SingleInitAccordionProps | MultiInitAccordionProps) {
	const rootState =
		props.type === "single" ? new AccordionSingleState(props) : new AccordionMultiState(props);
	setContext(ACCORDION_ROOT, rootState);
	return rootState;
}

export function getAccordionRootState(): AccordionState {
	return getContext(ACCORDION_ROOT);
}

export function setAccordionItemState(props: Omit<AccordionItemStateProps, "rootState">) {
	verifyContextDeps(ACCORDION_ROOT);
	const rootState = getAccordionRootState();
	const itemState = new AccordionItemState({ ...props, rootState });
	setContext(ACCORDION_ITEM, itemState);
	return itemState;
}

export function getAccordionItemState(): AccordionItemState {
	return getContext(ACCORDION_ITEM);
}

export function getAccordionTriggerState(props: AccordionTriggerStateProps): AccordionTriggerState {
	verifyContextDeps(ACCORDION_ITEM);
	const itemState = getAccordionItemState();
	return itemState.createTrigger(props);
}

export function getAccordionContentState(): AccordionContentState {
	verifyContextDeps(ACCORDION_ITEM);
	const itemState = getAccordionItemState();
	return itemState.createContent();
}
