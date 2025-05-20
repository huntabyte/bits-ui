import { afterTick, attachRef } from "svelte-toolbelt";
import { Context, watch } from "runed";
import type { Box, ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";
import {
	getAriaDisabled,
	getAriaExpanded,
	getDataDisabled,
	getDataOpenClosed,
	getDataOrientation,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	type UseRovingFocusReturn,
	useRovingFocus,
} from "$lib/internal/use-roving-focus.svelte.js";
import type { Orientation } from "$lib/shared/index.js";

const ACCORDION_ROOT_ATTR = "data-accordion-root";
const ACCORDION_TRIGGER_ATTR = "data-accordion-trigger";
const ACCORDION_CONTENT_ATTR = "data-accordion-content";
const ACCORDION_ITEM_ATTR = "data-accordion-item";
const ACCORDION_HEADER_ATTR = "data-accordion-header";

//
// BASE
//

type AccordionBaseStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		orientation: Orientation;
		loop: boolean;
	}>
>;

class AccordionBaseState {
	readonly opts: AccordionBaseStateProps;
	rovingFocusGroup: UseRovingFocusReturn;

	constructor(opts: AccordionBaseStateProps) {
		this.opts = opts;

		this.rovingFocusGroup = useRovingFocus({
			rootNodeId: this.opts.id,
			candidateAttr: ACCORDION_TRIGGER_ATTR,
			loop: this.opts.loop,
			orientation: this.opts.orientation,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				[ACCORDION_ROOT_ATTR]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

//
// SINGLE
//

type AccordionSingleStateProps = AccordionBaseStateProps & WritableBoxedValues<{ value: string }>;

export class AccordionSingleState extends AccordionBaseState {
	readonly opts: AccordionSingleStateProps;
	isMulti = false as const;

	constructor(opts: AccordionSingleStateProps) {
		super(opts);
		this.opts = opts;
		this.includesItem = this.includesItem.bind(this);
		this.toggleItem = this.toggleItem.bind(this);
	}

	includesItem(item: string) {
		return this.opts.value.current === item;
	}

	toggleItem(item: string) {
		this.opts.value.current = this.includesItem(item) ? "" : item;
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

		this.includesItem = this.includesItem.bind(this);
		this.toggleItem = this.toggleItem.bind(this);
	}

	includesItem(item: string) {
		return this.#value.current.includes(item);
	}

	toggleItem(item: string) {
		if (this.includesItem(item)) {
			this.#value.current = this.#value.current.filter((v) => v !== item);
		} else {
			this.#value.current = [...this.#value.current, item];
		}
	}
}

//
// ITEM
//

type AccordionItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
	}> & {
		rootState: AccordionState;
	}
>;

export class AccordionItemState {
	readonly opts: AccordionItemStateProps;
	root: AccordionState;
	isActive = $derived.by(() => this.root.includesItem(this.opts.value.current));
	isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);

	constructor(opts: AccordionItemStateProps) {
		this.opts = opts;
		this.root = opts.rootState;

		this.updateValue = this.updateValue.bind(this);
	}

	updateValue() {
		this.root.toggleItem(this.opts.value.current);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-state": getDataOpenClosed(this.isActive),
				"data-disabled": getDataDisabled(this.isDisabled),
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				[ACCORDION_ITEM_ATTR]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

//
// TRIGGER
//

type AccordionTriggerStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean | null | undefined;
	}>
>;

class AccordionTriggerState {
	readonly opts: AccordionTriggerStateProps;
	readonly itemState: AccordionItemState;
	#root: AccordionState;
	#isDisabled = $derived.by(
		() =>
			this.opts.disabled.current ||
			this.itemState.opts.disabled.current ||
			this.#root.opts.disabled.current
	);

	constructor(opts: AccordionTriggerStateProps, itemState: AccordionItemState) {
		this.opts = opts;
		this.itemState = itemState;
		this.#root = itemState.root;
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.#isDisabled) return;
		if (e.button !== 0) return e.preventDefault();
		this.itemState.updateValue();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.itemState.updateValue();
			return;
		}

		this.#root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.#isDisabled,
				"aria-expanded": getAriaExpanded(this.itemState.isActive),
				"aria-disabled": getAriaDisabled(this.#isDisabled),
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-state": getDataOpenClosed(this.itemState.isActive),
				"data-orientation": getDataOrientation(this.#root.opts.orientation.current),
				[ACCORDION_TRIGGER_ATTR]: "",
				tabindex: 0,
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...attachRef(this.opts.ref),
			}) as const
	);
}

//
// CONTENT
//

type AccordionContentStateProps = WithRefProps<
	ReadableBoxedValues<{
		forceMount: boolean;
	}>
>;
class AccordionContentState {
	readonly opts: AccordionContentStateProps;
	readonly item: AccordionItemState;
	#originalStyles: { transitionDuration: string; animationName: string } | undefined = undefined;
	#isMountAnimationPrevented = false;
	#width = $state(0);
	#height = $state(0);

	present = $derived.by(() => this.opts.forceMount.current || this.item.isActive);

	constructor(opts: AccordionContentStateProps, item: AccordionItemState) {
		this.opts = opts;
		this.item = item;
		this.#isMountAnimationPrevented = this.item.isActive;

		$effect.pre(() => {
			const rAF = requestAnimationFrame(() => {
				this.#isMountAnimationPrevented = false;
			});

			return () => {
				cancelAnimationFrame(rAF);
			};
		});

		watch([() => this.present, () => this.opts.ref.current], ([_, node]) => {
			if (!node) return;
			afterTick(() => {
				if (!this.opts.ref.current) return;
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

	snippetProps = $derived.by(() => ({
		open: this.item.isActive,
	}));

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-state": getDataOpenClosed(this.item.isActive),
				"data-disabled": getDataDisabled(this.item.isDisabled),
				"data-orientation": getDataOrientation(this.item.root.opts.orientation.current),
				[ACCORDION_CONTENT_ATTR]: "",
				style: {
					"--bits-accordion-content-height": `${this.#height}px`,
					"--bits-accordion-content-width": `${this.#width}px`,
				},
				...attachRef(this.opts.ref),
			}) as const
	);
}

type AccordionHeaderStateProps = WithRefProps<
	ReadableBoxedValues<{
		level: 1 | 2 | 3 | 4 | 5 | 6;
	}>
>;

class AccordionHeaderState {
	readonly opts: AccordionHeaderStateProps;
	readonly item: AccordionItemState;

	constructor(opts: AccordionHeaderStateProps, item: AccordionItemState) {
		this.opts = opts;
		this.item = item;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "heading",
				"aria-level": this.opts.level.current,
				"data-heading-level": this.opts.level.current,
				"data-state": getDataOpenClosed(this.item.isActive),
				"data-orientation": getDataOrientation(this.item.root.opts.orientation.current),
				[ACCORDION_HEADER_ATTR]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

//
// CONTEXT METHODS
//

type AccordionState = AccordionSingleState | AccordionMultiState;

type InitAccordionProps = WithRefProps<
	{
		type: "single" | "multiple";
		value: Box<string> | Box<string[]>;
	} & ReadableBoxedValues<{
		disabled: boolean;
		orientation: Orientation;
		loop: boolean;
	}>
>;

const AccordionRootContext = new Context<AccordionState>("Accordion.Root");
const AccordionItemContext = new Context<AccordionItemState>("Accordion.Item");

export function useAccordionRoot(props: InitAccordionProps) {
	const { type, ...rest } = props;
	const rootState =
		type === "single"
			? new AccordionSingleState(rest as AccordionSingleStateProps)
			: new AccordionMultiState(rest as AccordionMultiStateProps);
	return AccordionRootContext.set(rootState);
}

export function useAccordionItem(props: Omit<AccordionItemStateProps, "rootState">) {
	const rootState = AccordionRootContext.get();
	return AccordionItemContext.set(new AccordionItemState({ ...props, rootState }));
}

export function useAccordionTrigger(props: AccordionTriggerStateProps): AccordionTriggerState {
	return new AccordionTriggerState(props, AccordionItemContext.get());
}

export function useAccordionContent(props: AccordionContentStateProps): AccordionContentState {
	return new AccordionContentState(props, AccordionItemContext.get());
}

export function useAccordionHeader(props: AccordionHeaderStateProps): AccordionHeaderState {
	return new AccordionHeaderState(props, AccordionItemContext.get());
}
