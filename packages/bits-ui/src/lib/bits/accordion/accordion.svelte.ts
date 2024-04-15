import { getContext, setContext } from "svelte";
import {
	type Box,
	type BoxedValues,
	type EventCallback,
	type ReadonlyBox,
	type ReadonlyBoxedValues,
	boxWithState,
	composeHandlers,
	dataDisabledAttrs,
	getAriaDisabled,
	getAriaExpanded,
	getDataDisabled,
	kbd,
	openClosedAttrs,
	readonlyBox,
	verifyContextDeps,
} from "$lib/internal/index.js";

/**
 * BASE
 */
type AccordionBaseStateProps = ReadonlyBoxedValues<{
	id: string;
	disabled: boolean;
	forceVisible: boolean;
}>;

class AccordionBaseState {
	id = undefined as unknown as ReadonlyBox<string>;
	disabled = undefined as unknown as ReadonlyBox<boolean>;
	forceVisible = undefined as unknown as ReadonlyBox<boolean>;
	#attrs = $derived({
		id: this.id.value,
		"data-accordion-root": "",
	} as const);

	constructor(props: AccordionBaseStateProps) {
		this.id = props.id;
		this.disabled = props.disabled;
		this.forceVisible = props.forceVisible;
	}

	get props() {
		return this.#attrs;
	}
}

/**
 * SINGLE
 */

type AccordionSingleStateProps = AccordionBaseStateProps & BoxedValues<{ value: string }>;
export class AccordionSingleState extends AccordionBaseState {
	#value: Box<string>;
	isMulti = false as const;

	constructor(props: AccordionSingleStateProps) {
		super(props);
		this.#value = props.value;
	}

	includesItem(item: string) {
		return this.#value.value === item;
	}

	toggleItem(item: string) {
		this.#value.value = this.includesItem(item) ? "" : item;
	}
}

/**
 * MULTIPLE
 */
interface AccordionMultiStateProps extends AccordionBaseStateProps {
	value: Box<string[]>;
}

export class AccordionMultiState extends AccordionBaseState {
	#value: Box<string[]>;
	isMulti = true as const;

	constructor(props: AccordionMultiStateProps) {
		super(props);
		this.#value = props.value;
	}

	includesItem(item: string) {
		return this.#value.value.includes(item);
	}

	toggleItem(item: string) {
		if (this.includesItem(item)) {
			this.#value.value = this.#value.value.filter((v) => v !== item);
		} else {
			this.#value.value = [...this.#value.value, item];
		}
	}
}

/**
 * ITEM
 */

type AccordionItemStateProps = ReadonlyBoxedValues<{
	value: string;
	disabled: boolean;
}> & {
	rootState: AccordionState;
};

export class AccordionItemState {
	#value: ReadonlyBox<string>;
	disabled = undefined as unknown as ReadonlyBox<boolean>;
	root = undefined as unknown as AccordionState;
	#attrs = {
		"data-accordion-item": "",
	} as const;
	isDisabled = $derived(this.disabled.value || this.root.disabled.value);
	isSelected = $derived(this.root.includesItem(this.value));

	constructor(props: AccordionItemStateProps) {
		this.#value = props.value;
		this.disabled = props.disabled;
		this.root = props.rootState;
	}

	get value() {
		return this.#value.value;
	}

	updateValue() {
		this.root.toggleItem(this.value);
	}

	get props() {
		return this.#attrs;
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

type AccordionTriggerStateProps = ReadonlyBoxedValues<{
	onclick: EventCallback<MouseEvent>;
	onkeydown: EventCallback<KeyboardEvent>;
	disabled: boolean;
	id: string;
}>;

class AccordionTriggerState {
	disabled = undefined as unknown as ReadonlyBox<boolean>;
	id = undefined as unknown as ReadonlyBox<string>;
	root = undefined as unknown as AccordionState;
	itemState = undefined as unknown as AccordionItemState;
	onclickProp = boxWithState<AccordionTriggerStateProps["onclick"]>(readonlyBox(() => () => {}));
	onkeydownProp = boxWithState<AccordionTriggerStateProps["onkeydown"]>(
		readonlyBox(() => () => {})
	);

	// Disabled if the trigger itself, the item it belongs to, or the root is disabled
	isDisabled = $derived(
		this.disabled.value || this.itemState.disabled.value || this.root.disabled.value
	);
	#attrs = $derived({
		id: this.id.value,
		disabled: this.isDisabled,
		"aria-expanded": getAriaExpanded(this.itemState.isSelected),
		"aria-disabled": getAriaDisabled(this.isDisabled),
		"data-disabled": getDataDisabled(this.isDisabled),
		"data-value": this.itemState.value,
		"data-state": openClosedAttrs(this.itemState.isSelected),
		"data-accordion-trigger": "",
	} as const);

	constructor(props: AccordionTriggerStateProps, itemState: AccordionItemState) {
		this.disabled = props.disabled;
		this.itemState = itemState;
		this.root = itemState.root;
		this.onclickProp.value = props.onclick;
		this.onkeydownProp.value = props.onkeydown;
		this.id = props.id;
	}

	onclick = composeHandlers(this.onclickProp, () => {
		if (this.isDisabled) return;
		this.itemState.updateValue();
	});

	onkeydown = composeHandlers(this.onkeydownProp, (e: KeyboardEvent) => {
		const handledKeys = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.HOME, kbd.END, kbd.SPACE, kbd.ENTER];
		if (this.isDisabled || !handledKeys.includes(e.key)) return;

		e.preventDefault();

		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			this.itemState.updateValue();
			return;
		}

		if (!this.root.id.value || !this.id.value) return;

		const rootEl = document.getElementById(this.root.id.value);
		if (!rootEl) return;
		const itemEl = document.getElementById(this.id.value);
		if (!itemEl) return;

		const items = Array.from(rootEl.querySelectorAll<HTMLElement>("[data-accordion-trigger]"));
		if (!items.length) return;

		const candidateItems = items.filter((item) => !item.dataset.disabled);
		if (!candidateItems.length) return;

		const currentIndex = candidateItems.indexOf(itemEl);
		const keyToIndex = {
			[kbd.ARROW_DOWN]: (currentIndex + 1) % candidateItems.length,
			[kbd.ARROW_UP]: (currentIndex - 1 + candidateItems.length) % candidateItems.length,
			[kbd.HOME]: 0,
			[kbd.END]: candidateItems.length - 1,
		};
		candidateItems[keyToIndex[e.key]!]?.focus();
	});

	get props() {
		return {
			...this.#attrs,
			onclick: this.onclick,
			onkeydown: this.onkeydown,
		};
	}
}

/**
 * CONTENT
 */

class AccordionContentState {
	item = undefined as unknown as AccordionItemState;
	#attrs = $derived({
		"data-state": openClosedAttrs(this.item.isSelected),
		"data-disabled": dataDisabledAttrs(this.item.isDisabled),
		"data-value": this.item.value,
		"data-accordion-content": "",
	} as const);

	constructor(item: AccordionItemState) {
		this.item = item;
	}

	get props() {
		return this.#attrs;
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
	value: Box<string> | Box<string[]>;
	id: ReadonlyBox<string>;
	disabled: ReadonlyBox<boolean>;
	forceVisible: ReadonlyBox<boolean>;
};

export function setAccordionRootState(props: InitAccordionProps) {
	if (props.type === "single") {
		const { value, type, ...rest } = props;
		return setContext(
			ACCORDION_ROOT_KEY,
			new AccordionSingleState({ ...rest, value: value as Box<string> })
		);
	} else {
		const { value, type, ...rest } = props;
		return setContext(
			ACCORDION_ROOT_KEY,
			new AccordionMultiState({ ...rest, value: value as Box<string[]> })
		);
	}
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
