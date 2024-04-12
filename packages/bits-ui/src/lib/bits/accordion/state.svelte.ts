import { getContext, setContext } from "svelte";
import {
	type EventCallback,
	type OnChangeFn,
	composeHandlers,
	dataDisabledAttrs,
	generateId,
	kbd,
	openClosedAttrs,
	verifyContextDeps,
} from "$lib/internal/index.js";

/**
 * BASE
 */
interface AccordionBaseStateProps {
	id?: string;
	disabled?: boolean;
	forceVisible?: boolean;
}

interface AccordionRootAttrs {
	id: string;
	"data-accordion-root": string;
}

class AccordionBaseState {
	id: string = $state(generateId());
	disabled: boolean = $state(false);
	forceVisible: boolean = $state(false);
	attrs: AccordionRootAttrs = $derived({
		id: this.id,
		"data-accordion-root": "",
	});

	constructor(props: AccordionBaseStateProps) {
		this.id = props.id ?? this.id;
		this.disabled = props.disabled ?? this.disabled;
		this.forceVisible = props.forceVisible ?? this.forceVisible;
	}
}

/**
 * SINGLE
 */

interface AccordionSingleStateProps extends AccordionBaseStateProps {
	value?: string;
	onValueChange?: OnChangeFn<string>;
}

export class AccordionSingleState extends AccordionBaseState {
	value: string = $state("");
	onValueChange: OnChangeFn<string> = () => {};
	isMulti = false as const;

	constructor(props: AccordionSingleStateProps) {
		super(props);

		this.value = props.value ?? this.value;
		this.onValueChange = props.onValueChange ?? this.onValueChange;

		$effect.pre(() => {
			this.onValueChange?.(this.value);
		});
	}
}

/**
 * MULTIPLE
 */
interface AccordionMultiStateProps extends AccordionBaseStateProps {
	value?: string[];
	onValueChange?: OnChangeFn<string[]>;
}

export class AccordionMultiState extends AccordionBaseState {
	value: string[] = $state([]);
	onValueChange: OnChangeFn<string[]> = () => {};
	isMulti = true as const;

	constructor(props: AccordionMultiStateProps) {
		super(props);

		this.value = props.value ?? this.value;
		this.onValueChange = props.onValueChange ?? this.onValueChange;

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

interface AccordionItemAttrs {
	"data-accordion-item": string;
}

export class AccordionItemState {
	value: string = $state("");
	disabled: boolean = $state(false);
	isSelected: boolean = $state(false);
	root: AccordionState;
	attrs: AccordionItemAttrs = {
		"data-accordion-item": "",
	};

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
	disabled?: boolean;
	id?: string;
};

interface AccordionTriggerHandlers {
	click?: EventCallback<MouseEvent>;
	keydown?: EventCallback<KeyboardEvent>;
}

const defaultAccordionTriggerHandlers: AccordionTriggerHandlers = {
	click: () => {},
	keydown: () => {},
};

class AccordionTriggerState {
	disabled: boolean = $state(false);
	id: string = $state(generateId());
	root: AccordionState = undefined as unknown as AccordionState;
	itemState: AccordionItemState = undefined as unknown as AccordionItemState;
	handlers: AccordionTriggerHandlers = $state(defaultAccordionTriggerHandlers);
	isDisabled: boolean = $state(false);
	attrs: Record<string, unknown> = $derived({
		id: this.id,
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
		this.handlers.click = props.onclick ?? this.onclick;
		this.handlers.keydown = props.onkeydown ?? this.onkeydown;
		this.id = props.id ?? this.id;

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

		if (!this.root.id || !this.id) return;

		const rootEl = document.getElementById(this.root.id);
		if (!rootEl) return;

		const items = Array.from(rootEl.querySelectorAll<HTMLElement>("[data-accordion-trigger]"));

		if (!items.length) return;

		const candidateItems = items.filter((item) => !item.dataset.disabled);
		if (!candidateItems.length) return;

		const currentIndex = candidateItems.indexOf(rootEl);

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
	item: AccordionItemState = $state() as AccordionItemState;
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

export const ACCORDION_ROOT_KEY = Symbol("Accordion.Root");
export const ACCORDION_ITEM_KEY = Symbol("Accordion.Item");

type AccordionState = AccordionSingleState | AccordionMultiState;

type InitAccordionProps = {
	type: "single" | "multiple";
	value?: string | string[];
};

export function setAccordionRootState(props: InitAccordionProps) {
	const rootState =
		props.type === "single"
			? new AccordionSingleState({ value: props.value as string })
			: new AccordionMultiState({ value: props.value as string[] });
	setContext(ACCORDION_ROOT_KEY, rootState);
	return rootState;
}

export function getAccordionRootState(): AccordionState {
	return getContext(ACCORDION_ROOT_KEY);
}

export function setAccordionItemState(props: Omit<AccordionItemStateProps, "rootState">) {
	verifyContextDeps(ACCORDION_ROOT_KEY);
	const rootState = getAccordionRootState();
	const itemState = new AccordionItemState({ ...props, rootState });
	setContext(ACCORDION_ITEM_KEY, itemState);
	return itemState;
}

export function getAccordionItemState(): AccordionItemState {
	return getContext(ACCORDION_ITEM_KEY);
}

export function getAccordionTriggerState(props: AccordionTriggerStateProps): AccordionTriggerState {
	verifyContextDeps(ACCORDION_ITEM_KEY);
	const itemState = getAccordionItemState();
	return itemState.createTrigger(props);
}

export function getAccordionContentState(): AccordionContentState {
	verifyContextDeps(ACCORDION_ITEM_KEY);
	const itemState = getAccordionItemState();
	return itemState.createContent();
}
