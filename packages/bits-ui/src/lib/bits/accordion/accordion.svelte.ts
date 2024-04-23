import { getContext, setContext } from "svelte";
import {
	type Box,
	type BoxedValues,
	type ReadonlyBox,
	type ReadonlyBoxedValues,
	afterTick,
	getAriaDisabled,
	getAriaExpanded,
	getAttrAndSelector,
	getDataDisabled,
	getDataOpenClosed,
	kbd,
	useNodeById,
	verifyContextDeps,
} from "$lib/internal/index.js";

const [ROOT_ATTR] = getAttrAndSelector("accordion-root");
const [TRIGGER_ATTR, TRIGGER_SELECTOR] = getAttrAndSelector("accordion-trigger");
const [CONTENT_ATTR] = getAttrAndSelector("accordion-content");
const [ITEM_ATTR] = getAttrAndSelector("accordion-item");
const [HEADER_ATTR] = getAttrAndSelector("accordion-header");

//
// BASE
//

type AccordionBaseStateProps = ReadonlyBoxedValues<{
	id: string;
	disabled: boolean;
}>;

class AccordionBaseState {
	id = undefined as unknown as ReadonlyBox<string>;
	node: Box<HTMLElement | null>;
	disabled: ReadonlyBox<boolean>;

	constructor(props: AccordionBaseStateProps) {
		this.id = props.id;
		this.disabled = props.disabled;

		this.node = useNodeById(this.id);
	}

	getTriggerNodes() {
		const node = this.node.value;
		if (!node) return [];
		return Array.from(node.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR)).filter(
			(el) => !el.hasAttribute("data-disabled")
		);
	}

	props = $derived({
		id: this.id.value,
		[ROOT_ATTR]: "",
	} as const);
}

//
// SINGLE
//

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

//
// MULTIPLE
//

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
			this.#value.value = [...this.#value.value, item];
		}
	}
}

//
// ITEM
//

type AccordionItemStateProps = ReadonlyBoxedValues<{
	value: string;
	disabled: boolean;
}> & {
	rootState: AccordionState;
};

export class AccordionItemState {
	value = undefined as unknown as ReadonlyBox<string>;
	disabled = undefined as unknown as ReadonlyBox<boolean>;
	root = undefined as unknown as AccordionState;
	isSelected = $derived(this.root.includesItem(this.value.value));
	isDisabled = $derived(this.disabled.value || this.root.disabled.value);

	constructor(props: AccordionItemStateProps) {
		this.value = props.value;
		this.disabled = props.disabled;
		this.root = props.rootState;
	}

	updateValue() {
		this.root.toggleItem(this.value.value);
	}

	createTrigger(props: AccordionTriggerStateProps) {
		return new AccordionTriggerState(props, this);
	}

	createContent(props: AccordionContentStateProps) {
		return new AccordionContentState(props, this);
	}

	createHeader(props: AccordionHeaderStateProps) {
		return new AccordionHeaderState(props, this);
	}

	props = $derived({
		[ITEM_ATTR]: "",
		"data-state": getDataOpenClosed(this.isSelected),
		"data-disabled": getDataDisabled(this.isDisabled),
	} as const);
}

//
// TRIGGER
//

type AccordionTriggerStateProps = ReadonlyBoxedValues<{
	disabled: boolean;
	id: string;
}>;

class AccordionTriggerState {
	#disabled = undefined as unknown as ReadonlyBox<boolean>;
	#id = undefined as unknown as ReadonlyBox<string>;
	#node: Box<HTMLElement | null>;
	#root = undefined as unknown as AccordionState;
	#itemState = undefined as unknown as AccordionItemState;
	#isDisabled = $derived(
		this.#disabled.value || this.#itemState.disabled.value || this.#root.disabled.value
	);

	constructor(props: AccordionTriggerStateProps, itemState: AccordionItemState) {
		this.#disabled = props.disabled;
		this.#itemState = itemState;
		this.#root = itemState.root;
		this.#id = props.id;

		this.#node = useNodeById(this.#id);
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

	props = $derived({
		id: this.#id.value,
		disabled: this.#isDisabled,
		"aria-expanded": getAriaExpanded(this.#itemState.isSelected),
		"aria-disabled": getAriaDisabled(this.#isDisabled),
		"data-disabled": getDataDisabled(this.#isDisabled),
		"data-state": getDataOpenClosed(this.#itemState.isSelected),
		[TRIGGER_ATTR]: "",
		//
		onclick: this.#onclick,
		onkeydown: this.#onkeydown,
	} as const);
}

//
// CONTENT
//

type AccordionContentStateProps = ReadonlyBoxedValues<{
	forceMount: boolean;
	id: string;
}>;

class AccordionContentState {
	item = undefined as unknown as AccordionItemState;
	node: Box<HTMLElement | null>;
	#id = undefined as unknown as ReadonlyBox<string>;
	#originalStyles: { transitionDuration: string; animationName: string } | undefined = undefined;
	#isMountAnimationPrevented = false;
	#width = $state(0);
	#height = $state(0);
	#forceMount = undefined as unknown as ReadonlyBox<boolean>;

	present = $derived(this.#forceMount.value || this.item.isSelected);

	constructor(props: AccordionContentStateProps, item: AccordionItemState) {
		this.item = item;
		this.#forceMount = props.forceMount;
		this.#isMountAnimationPrevented = this.item.isSelected;
		this.#id = props.id;

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

			afterTick(() => {
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

	props = $derived({
		id: this.#id.value,
		"data-state": getDataOpenClosed(this.item.isSelected),
		"data-disabled": getDataDisabled(this.item.isDisabled),
		[CONTENT_ATTR]: "",
		style: {
			"--bits-accordion-content-height": `${this.#height}px`,
			"--bits-accordion-content-width": `${this.#width}px`,
		},
	} as const);
}

type AccordionHeaderStateProps = ReadonlyBoxedValues<{
	level: 1 | 2 | 3 | 4 | 5 | 6;
}>;

class AccordionHeaderState {
	#item = undefined as unknown as AccordionItemState;
	#level = undefined as unknown as AccordionHeaderStateProps["level"];
	constructor(props: AccordionHeaderStateProps, item: AccordionItemState) {
		this.#level = props.level;
		this.#item = item;
	}

	props = $derived({
		role: "heading",
		"aria-level": this.#level.value,
		"data-heading-level": this.#level.value,
		"data-state": getDataOpenClosed(this.#item.isSelected),
		[HEADER_ATTR]: "",
	} as const);
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
	verifyContextDeps(ACCORDION_ROOT_KEY);
	return getContext<AccordionState>(ACCORDION_ROOT_KEY);
}

export function setAccordionItemState(props: Omit<AccordionItemStateProps, "rootState">) {
	const rootState = getAccordionRootState();
	const itemState = new AccordionItemState({ ...props, rootState });
	setContext(ACCORDION_ITEM_KEY, itemState);
	return itemState;
}

export function getAccordionItemState() {
	verifyContextDeps(ACCORDION_ITEM_KEY);
	return getContext<AccordionItemState>(ACCORDION_ITEM_KEY);
}

export function getAccordionTriggerState(props: AccordionTriggerStateProps): AccordionTriggerState {
	const itemState = getAccordionItemState();
	return itemState.createTrigger(props);
}

export function getAccordionContentState(props: AccordionContentStateProps): AccordionContentState {
	const itemState = getAccordionItemState();
	return itemState.createContent(props);
}

export function getAccordionHeaderState(props: AccordionHeaderStateProps): AccordionHeaderState {
	return getAccordionItemState().createHeader(props);
}
