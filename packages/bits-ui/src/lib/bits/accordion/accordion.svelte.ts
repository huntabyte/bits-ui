import type { WritableBox } from "runed";
import {
	type Box,
	type ReadableBoxedValues,
	type WritableBoxedValues,
	afterTick,
	getAriaDisabled,
	getAriaExpanded,
	getAriaOrientation,
	getDataDisabled,
	getDataOpenClosed,
	getDataOrientation,
	kbd,
	useNodeById,
} from "$lib/internal/index.js";
import { type UseRovingFocusReturn, useRovingFocus } from "$lib/internal/useRovingFocus.svelte.js";
import type { Orientation } from "$lib/shared/index.js";
import { createContext } from "$lib/internal/createContext.js";

const ROOT_ATTR = "accordion-root";
const TRIGGER_ATTR = "accordion-trigger";
const CONTENT_ATTR = "accordion-content";
const ITEM_ATTR = "accordion-item";
const HEADER_ATTR = "accordion-header";

//
// BASE
//

type AccordionBaseStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean;
	orientation: Orientation;
	loop: boolean;
}>;

class AccordionBaseState {
	id = undefined as unknown as AccordionBaseStateProps["id"];
	node: WritableBox<HTMLElement | null>;
	disabled = undefined as unknown as AccordionBaseStateProps["disabled"];
	#loop = undefined as unknown as AccordionBaseStateProps["loop"];
	orientation = undefined as unknown as AccordionBaseStateProps["orientation"];
	rovingFocusGroup: UseRovingFocusReturn;

	constructor(props: AccordionBaseStateProps) {
		this.id = props.id;
		this.disabled = props.disabled;
		this.node = useNodeById(this.id);
		this.orientation = props.orientation;
		this.#loop = props.loop;
		this.rovingFocusGroup = useRovingFocus({
			rootNode: this.node,
			candidateSelector: TRIGGER_ATTR,
			loop: this.#loop,
			orientation: this.orientation,
		});
	}

	props = $derived({
		id: this.id.value,
		"data-orientation": getDataOrientation(this.orientation.value),
		"data-disabled": getDataDisabled(this.disabled.value),
		"aria-orientation": getAriaOrientation(this.orientation.value),
		[ROOT_ATTR]: "",
	} as const);
}

//
// SINGLE
//

type AccordionSingleStateProps = AccordionBaseStateProps & WritableBoxedValues<{ value: string }>;

export class AccordionSingleState extends AccordionBaseState {
	#value: AccordionSingleStateProps["value"];
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

type AccordionMultiStateProps = AccordionBaseStateProps & WritableBoxedValues<{ value: string[] }>;

export class AccordionMultiState extends AccordionBaseState {
	#value: AccordionMultiStateProps["value"];
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

type AccordionItemStateProps = ReadableBoxedValues<{
	value: string;
	disabled: boolean;
}> & {
	rootState: AccordionState;
};

export class AccordionItemState {
	value = undefined as unknown as AccordionItemStateProps["value"];
	disabled = undefined as unknown as AccordionItemStateProps["disabled"];
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

type AccordionTriggerStateProps = ReadableBoxedValues<{
	disabled: boolean;
	id: string;
}>;

class AccordionTriggerState {
	#disabled = undefined as unknown as AccordionTriggerStateProps["disabled"];
	#id = undefined as unknown as AccordionTriggerStateProps["id"];
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
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.#itemState.updateValue();
			return;
		}

		this.#root.rovingFocusGroup.handleKeydown(this.#node.value, e);
	};

	props = $derived({
		id: this.#id.value,
		disabled: this.#isDisabled,
		"aria-expanded": getAriaExpanded(this.#itemState.isSelected),
		"aria-disabled": getAriaDisabled(this.#isDisabled),
		"data-disabled": getDataDisabled(this.#isDisabled),
		"data-state": getDataOpenClosed(this.#itemState.isSelected),
		"data-orientation": getDataOrientation(this.#root.orientation.value),
		[TRIGGER_ATTR]: "",
		tabindex: 0,
		//
		onclick: this.#onclick,
		onkeydown: this.#onkeydown,
	} as const);
}

//
// CONTENT
//

type AccordionContentStateProps = ReadableBoxedValues<{
	forceMount: boolean;
	id: string;
}>;

class AccordionContentState {
	item = undefined as unknown as AccordionItemState;
	node: WritableBox<HTMLElement | null>;
	#id = undefined as unknown as AccordionContentStateProps["id"];
	#originalStyles: { transitionDuration: string; animationName: string } | undefined = undefined;
	#isMountAnimationPrevented = false;
	#width = $state(0);
	#height = $state(0);
	#forceMount = undefined as unknown as AccordionContentStateProps["forceMount"];

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
		"data-orientation": getDataOrientation(this.item.root.orientation.value),
		[CONTENT_ATTR]: "",
		style: {
			"--bits-accordion-content-height": `${this.#height}px`,
			"--bits-accordion-content-width": `${this.#width}px`,
		},
	} as const);
}

type AccordionHeaderStateProps = ReadableBoxedValues<{
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
		"data-orientation": getDataOrientation(this.#item.root.orientation.value),
		[HEADER_ATTR]: "",
	} as const);
}

//
// CONTEXT METHODS
//

type AccordionState = AccordionSingleState | AccordionMultiState;

type InitAccordionProps = {
	type: "single" | "multiple";
	value: Box<string> | Box<string[]>;
} & ReadableBoxedValues<{
	id: string;
	disabled: boolean;
	orientation: Orientation;
	loop: boolean;
}>;

const [setAccordionRootContext, getAccordionRootContext] =
	createContext<AccordionState>("Accordion.Root");
const [setAccordionItemContext, getAccordionItemContext] =
	createContext<AccordionItemState>("Accordion.Item");

export function useAccordionRoot(props: InitAccordionProps) {
	const { type, ...rest } = props;
	const rootState =
		type === "single"
			? new AccordionSingleState(rest as AccordionSingleStateProps)
			: new AccordionMultiState(rest as AccordionMultiStateProps);
	return setAccordionRootContext(rootState);
}

export function useAccordionItem(props: Omit<AccordionItemStateProps, "rootState">) {
	const rootState = getAccordionRootContext();
	return setAccordionItemContext(new AccordionItemState({ ...props, rootState }));
}

export function useAccordionTrigger(props: AccordionTriggerStateProps): AccordionTriggerState {
	return getAccordionItemContext().createTrigger(props);
}

export function useAccordionContent(props: AccordionContentStateProps): AccordionContentState {
	return getAccordionItemContext().createContent(props);
}

export function useAccordionHeader(props: AccordionHeaderStateProps): AccordionHeaderState {
	return getAccordionItemContext().createHeader(props);
}
