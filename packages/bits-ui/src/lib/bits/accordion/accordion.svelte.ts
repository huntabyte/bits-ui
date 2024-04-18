import { getContext, setContext } from "svelte";
import {
	type Box,
	type BoxedValues,
	type EventCallback,
	type ReadonlyBox,
	type ReadonlyBoxedValues,
	boxedState,
	composeHandlers,
	getAriaDisabled,
	getAriaExpanded,
	getDataDisabled,
	getDataOpenClosed,
	kbd,
	styleToString,
	verifyContextDeps,
} from "$lib/internal/index.js";
import type { StyleProperties } from "$lib/shared/index.js";
import { withTick } from "$lib/internal/with-tick.js";
import { useNodeById } from "$lib/internal/elements.svelte.js";

/**
 * BASE
 */
type AccordionBaseStateProps = ReadonlyBoxedValues<{
	id: string;
	disabled: boolean;
}>;

class AccordionBaseState {
	id: ReadonlyBox<string>;
	node: Box<HTMLElement | null>;
	disabled: ReadonlyBox<boolean>;

	constructor(props: AccordionBaseStateProps) {
		this.id = props.id;
		this.disabled = props.disabled;

		this.node = useNodeById(this.id);
	}

	getTriggerNodes() {
		if (!this.node.value) return [];
		return Array.from(
			this.node.value.querySelectorAll<HTMLElement>("[data-accordion-trigger]")
		).filter((el) => !el.dataset.disabled);
	}

	get props() {
		return {
			id: this.id.value,
			"data-accordion-root": "",
		} as const;
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

type AccordionMultiStateProps = AccordionBaseStateProps & BoxedValues<{ value: string[] }>;

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
			this.#value.value.push(item);
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
	disabled: ReadonlyBox<boolean>;
	root: AccordionState;

	constructor(props: AccordionItemStateProps) {
		this.#value = props.value;
		this.disabled = props.disabled;
		this.root = props.rootState;
	}

	get value() {
		return this.#value.value;
	}

	get isSelected() {
		return this.root.includesItem(this.value);
	}

	get isDisabled() {
		return this.disabled.value || this.root.disabled.value;
	}

	updateValue() {
		this.root.toggleItem(this.value);
	}

	get props() {
		return {
			"data-accordion-item": "",
			"data-state": getDataOpenClosed(this.isSelected),
			"data-disabled": getDataDisabled(this.isDisabled),
		} as const;
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

type AccordionTriggerStateProps = ReadonlyBoxedValues<{
	onclick: EventCallback<MouseEvent>;
	onkeydown: EventCallback<KeyboardEvent>;
	disabled: boolean;
	id: string;
}>;

class AccordionTriggerState {
	#disabled: ReadonlyBox<boolean>;
	#id: ReadonlyBox<string>;
	#node: Box<HTMLElement | null>;
	#root: AccordionState;
	#itemState: AccordionItemState;
	#composedClick: EventCallback<MouseEvent>;
	#composedKeydown: EventCallback<KeyboardEvent>;

	constructor(props: AccordionTriggerStateProps, itemState: AccordionItemState) {
		this.#disabled = props.disabled;
		this.#itemState = itemState;
		this.#root = itemState.root;
		this.#id = props.id;
		this.#composedClick = composeHandlers(props.onclick, this.#onclick);
		this.#composedKeydown = composeHandlers(props.onkeydown, this.#onkeydown);

		this.#node = useNodeById(this.#id);
	}

	get #isDisabled() {
		return this.#disabled.value || this.#itemState.disabled.value || this.#root.disabled.value;
	}

	#onclick = () => {
		if (this.#isDisabled) return;
		this.#itemState.updateValue();
	};

	#onkeydown = (e: KeyboardEvent) => {
		const handledKeys = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.HOME, kbd.END, kbd.SPACE, kbd.ENTER];
		if (this.#isDisabled || !handledKeys.includes(e.key)) return;

		e.preventDefault();

		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			this.#itemState.updateValue();
			return;
		}

		if (!this.#root.node.value || !this.#node.value) return;

		const candidateItems = this.#root.getTriggerNodes();
		if (!candidateItems.length) return;

		const currentIndex = candidateItems.indexOf(this.#node.value);

		const keyToIndex = {
			[kbd.ARROW_DOWN]: (currentIndex + 1) % candidateItems.length,
			[kbd.ARROW_UP]: (currentIndex - 1 + candidateItems.length) % candidateItems.length,
			[kbd.HOME]: 0,
			[kbd.END]: candidateItems.length - 1,
		};

		candidateItems[keyToIndex[e.key]!]?.focus();
	};

	get props() {
		return {
			id: this.#id.value,
			disabled: this.#isDisabled,
			"aria-expanded": getAriaExpanded(this.#itemState.isSelected),
			"aria-disabled": getAriaDisabled(this.#isDisabled),
			"data-disabled": getDataDisabled(this.#isDisabled),
			"data-value": this.#itemState.value,
			"data-state": getDataOpenClosed(this.#itemState.isSelected),
			"data-accordion-trigger": "",
			//
			onclick: this.#composedClick,
			onkeydown: this.#composedKeydown,
		} as const;
	}
}

/**
 * CONTENT
 */

type AccordionContentStateProps = ReadonlyBoxedValues<{
	forceMount: boolean;
	id: string;
	style: StyleProperties;
}>;

class AccordionContentState {
	item: AccordionItemState;
	node: Box<HTMLElement | null>;
	#id: ReadonlyBox<string>;
	#originalStyles: { transitionDuration: string; animationName: string } | undefined = undefined;
	#isMountAnimationPrevented = false;
	#width = $state(0);
	#height = $state(0);
	#forceMount: ReadonlyBox<boolean>;
	#styleProp: ReadonlyBox<StyleProperties>;

	constructor(props: AccordionContentStateProps, item: AccordionItemState) {
		this.item = item;
		this.#forceMount = props.forceMount;
		this.#isMountAnimationPrevented = this.item.isSelected;
		this.#id = props.id;
		this.#styleProp = props.style;

		this.node = useNodeById(this.#id);

		$effect.pre(() => {
			const rAF = requestAnimationFrame(() => {
				this.#isMountAnimationPrevented = false;
			});

			return () => {
				cancelAnimationFrame(rAF);
			};
		});

		$effect(() => {
			// eslint-disable-next-line no-unused-expressions
			this.present;
			const node = this.node.value;
			if (!node) return;

			withTick(() => {
				if (!this.node) return;
				// get the dimensions of the element
				this.#originalStyles = this.#originalStyles || {
					transitionDuration: node.style.transitionDuration,
					animationName: node.style.animationName,
				};

				// block any animations/transitions so the element renders at full dimensions
				node.style.transitionDuration = "0s";
				node.style.animationName = "none";

				const rect = node.getBoundingClientRect();
				this.#height = rect.height;
				this.#width = rect.width;

				// unblock any animations/transitions that were originally set if not the initial render
				if (!this.#isMountAnimationPrevented) {
					const { animationName, transitionDuration } = this.#originalStyles;
					node.style.transitionDuration = transitionDuration;
					node.style.animationName = animationName;
				}
			});
		});
	}

	get present() {
		return this.#forceMount.value || this.item.isSelected;
	}

	get props() {
		return {
			id: this.#id.value,
			"data-state": getDataOpenClosed(this.item.isSelected),
			"data-disabled": getDataDisabled(this.item.isDisabled),
			"data-value": this.item.value,
			"data-accordion-content": "",
			style: styleToString({
				...this.#styleProp.value,
				"--bits-accordion-content-height": `${this.#height}px`,
				"--bits-accordion-content-width": `${this.#width}px`,
			}),
		} as const;
	}
}

//
// CONTEXT METHODS
//

export const ACCORDION_ROOT_KEY = Symbol("Accordion.Root");
export const ACCORDION_ITEM_KEY = Symbol("Accordion.Item");

type AccordionState = AccordionSingleState | AccordionMultiState;

type InitAccordionProps = {
	type: "single" | "multiple";
	value: Box<string> | Box<string[]>;
	id: ReadonlyBox<string>;
	disabled: ReadonlyBox<boolean>;
};

export function setAccordionRootState(props: InitAccordionProps) {
	const { type, ...rest } = props;
	const rootState =
		type === "single"
			? new AccordionSingleState(rest as AccordionSingleStateProps)
			: new AccordionMultiState(rest as AccordionMultiStateProps);
	return setContext(ACCORDION_ROOT_KEY, rootState);
}

export function getAccordionRootState() {
	return getContext<AccordionState>(ACCORDION_ROOT_KEY);
}

export function setAccordionItemState(props: Omit<AccordionItemStateProps, "rootState">) {
	verifyContextDeps(ACCORDION_ROOT_KEY);
	const rootState = getAccordionRootState();
	const itemState = new AccordionItemState({ ...props, rootState });
	setContext(ACCORDION_ITEM_KEY, itemState);
	return itemState;
}

export function getAccordionItemState() {
	return getContext<AccordionItemState>(ACCORDION_ITEM_KEY);
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
