import { getContext, onMount, setContext, tick } from "svelte";
import {
	type Box,
	type BoxedValues,
	type EventCallback,
	type OnChangeFn,
	box,
	composeHandlers,
	dataDisabledAttrs,
	generateId,
	getAriaDisabled,
	getAriaExpanded,
	getDataDisabled,
	getDataOpenClosed,
	kbd,
	styleToString,
	verifyContextDeps,
} from "$lib/internal/index.js";

/**
 * BASE
 */
type AccordionBaseStateProps = BoxedValues<{
	id: string;
	disabled: boolean;
	forceVisible: boolean;
}>;

interface AccordionRootAttrs {
	id: string;
	"data-accordion-root": string;
}

class AccordionBaseState {
	id = box(() => generateId());
	disabled = box(() => false);
	forceVisible = box(() => false);
	attrs: AccordionRootAttrs = $derived({
		id: this.id.value,
		"data-accordion-root": "",
	});

	constructor(props: AccordionBaseStateProps) {
		this.id = props.id ?? this.id;
		this.disabled = props.disabled ?? this.disabled;
		this.forceVisible = props.forceVisible ?? this.forceVisible;
	}

	get props() {
		return this.attrs;
	}
}

/**
 * SINGLE
 */

type AccordionSingleStateProps = AccordionBaseStateProps & BoxedValues<{ value: string }>;

export class AccordionSingleState extends AccordionBaseState {
	#value = box(() => "");
	isMulti = false as const;

	constructor(props: AccordionSingleStateProps) {
		super(props);
		this.#value = props.value ?? this.#value;
	}

	get value() {
		return this.#value.value;
	}

	set value(v: string) {
		this.#value.value = v;
	}
}

/**
 * MULTIPLE
 */
interface AccordionMultiStateProps extends AccordionBaseStateProps {
	value?: Box<string[]>;
}

export class AccordionMultiState extends AccordionBaseState {
	#value = box<string[]>(() => []);
	isMulti = true as const;

	constructor(props: AccordionMultiStateProps) {
		super(props);

		this.#value = props.value ?? this.#value;
	}

	get value() {
		return this.#value.value;
	}

	set value(v: string[]) {
		this.#value.value = v;
	}
}

/**
 * ITEM
 */

type AccordionItemStateProps = BoxedValues<{
	value: string;
	disabled: boolean;
}> & {
	rootState: AccordionState;
};

interface AccordionItemAttrs {
	"data-accordion-item": string;
}

export class AccordionItemState {
	#value: Box<string>;
	disabled = box(() => false);
	root: AccordionState = undefined as unknown as AccordionState;
	#attrs: AccordionItemAttrs = {
		"data-accordion-item": "",
	};
	isDisabled = $derived(this.disabled.value || this.root.disabled.value);
	isSelected = $state(false);

	constructor(props: AccordionItemStateProps) {
		this.#value = props.value;
		this.disabled = props.disabled;
		this.root = props.rootState;

		this.isSelected = this.root.isMulti
			? this.root.value.includes(this.value)
			: this.root.value === this.value;

		$effect.pre(() => {
			if (this.root.isMulti) {
				this.isSelected = this.root.value.includes(this.value);
			} else {
				this.isSelected = this.root.value === this.value;
			}
		});
	}

	get value() {
		return this.#value.value;
	}

	updateValue() {
		if (this.root.isMulti) {
			if (this.root.value.includes(this.value)) {
				this.root.value = this.root.value.filter((v) => v !== this.value);
			} else {
				this.root.value = [...this.root.value, this.value];
			}
		} else {
			if (this.root.value === this.value) {
				this.root.value = "";
			} else {
				this.root.value = this.value;
			}
		}
	}

	get props() {
		return this.#attrs;
	}

	createTrigger(props: AccordionTriggerStateProps) {
		return new AccordionTriggerState(props, this);
	}

	createContent(props: AccordionContentStateProps) {
		return new AccordionContentState(props, this);
	}
}

/**
 * TRIGGER
 */

type AccordionTriggerStateProps = BoxedValues<{
	onclick: EventCallback<MouseEvent>;
	onkeydown: EventCallback<KeyboardEvent>;
	disabled: boolean;
	id: string;
}>;

class AccordionTriggerState {
	disabled = box(() => false);
	id = box(() => generateId());
	root: AccordionState = undefined as unknown as AccordionState;
	itemState: AccordionItemState = undefined as unknown as AccordionItemState;
	onclickProp = box(() => () => {}) as unknown as AccordionTriggerStateProps["onclick"];
	onkeydownProp = box(() => () => {}) as unknown as AccordionTriggerStateProps["onkeydown"];

	// Disabled if the trigger itself, the item it belongs to, or the root is disabled
	isDisabled: boolean = $derived(
		this.disabled.value || this.itemState.disabled.value || this.root.disabled.value
	);
	attrs: Record<string, unknown> = $derived({
		id: this.id.value,
		disabled: this.isDisabled,
		"aria-expanded": getAriaExpanded(this.itemState.isSelected),
		"aria-disabled": getAriaDisabled(this.isDisabled),
		"data-disabled": getDataDisabled(this.isDisabled),
		"data-value": this.itemState.value,
		"data-state": getDataOpenClosed(this.itemState.isSelected),
		"data-accordion-trigger": "",
	});

	constructor(props: AccordionTriggerStateProps, itemState: AccordionItemState) {
		this.disabled = props.disabled;
		this.itemState = itemState;
		this.root = itemState.root;
		this.onclickProp = props.onclick;
		this.onkeydownProp = props.onkeydown;
		this.id = props.id;
	}

	onclick = composeHandlers(this.onclickProp.value, () => {
		if (this.isDisabled) return;
		this.itemState.updateValue();
	});

	onkeydown = composeHandlers(this.onkeydownProp.value, (e: KeyboardEvent) => {
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

type AccordionContentStateProps = BoxedValues<{
	presentEl: HTMLElement | undefined;
}>;

class AccordionContentState {
	item = undefined as unknown as AccordionItemState;
	currentStyle = box<Record<string, string>>({});
	isMountAnimationPrevented = box(false);
	width = box(0);
	height = box(0);
	presentEl: Box<HTMLElement | undefined> = box<HTMLElement | undefined>(undefined);

	#attrs: Record<string, unknown> = $derived({
		"data-state": getDataOpenClosed(this.item.isSelected),
		"data-disabled": dataDisabledAttrs(this.item.isDisabled),
		"data-value": this.item.value,
		"data-accordion-content": "",
		style: styleToString({
			"--bits-accordion-content-height": `${this.height.value}px`,
			"--bits-accordion-content-width": `${this.width.value}px`,
		}),
	});

	constructor(props: AccordionContentStateProps, item: AccordionItemState) {
		this.item = item;
		this.isMountAnimationPrevented.value = this.item.isSelected;
		this.presentEl = props.presentEl;

		onMount(() => {
			requestAnimationFrame(() => {
				this.isMountAnimationPrevented.value = false;
			});
		});

		$effect(() => {
			const node = this.presentEl.value;
			if (!node) return;

			this.currentStyle.value = this.currentStyle.value || {
				transitionDuration: node.style.transitionDuration,
				animationName: node.style.animationName,
			};

			// block any animations/transitions so the element renders at full dimensions
			node.style.transitionDuration = "0s";
			node.style.animationName = "none";

			// get the dimensions of the element
			const rect = node.getBoundingClientRect();
			this.height.value = rect.height;
			this.width.value = rect.width;

			// unblock any animations/transitions that were originally set if not the initial render
			if (!this.isMountAnimationPrevented.value) {
				const transitionDuration = this.currentStyle.value.transitionDuration;
				const animationName = this.currentStyle.value.animationName;
				console.log("transitionDuration", transitionDuration);
				console.log("animationName", animationName);
				if (transitionDuration) {
					node.style.transitionDuration = transitionDuration;
				}
				if (animationName) {
					node.style.animationName = animationName;
				}
			}
		});
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
	id: Box<string>;
	disabled: Box<boolean>;
	forceVisible: Box<boolean>;
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

export function getAccordionContentState(props: AccordionContentStateProps): AccordionContentState {
	verifyContextDeps(ACCORDION_ITEM_KEY);
	const itemState = getAccordionItemState();
	return itemState.createContent(props);
}
