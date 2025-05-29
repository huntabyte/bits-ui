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
import { createBitsAttrs } from "$lib/internal/attrs.js";

const accordionAttrs = createBitsAttrs({
	component: "accordion",
	parts: ["root", "trigger", "content", "item", "header"],
});

type AccordionBaseStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		orientation: Orientation;
		loop: boolean;
	}>
>;

type AccordionSingleStateProps = AccordionBaseStateProps & WritableBoxedValues<{ value: string }>;
type AccordionMultiStateProps = AccordionBaseStateProps & WritableBoxedValues<{ value: string[] }>;
type AccordionState = AccordionSingleState | AccordionMultiState;

type AccordionItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
	}> & {
		rootState: AccordionState;
	}
>;

type AccordionTriggerStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean | null | undefined;
	}>
>;

type AccordionContentStateProps = WithRefProps<
	ReadableBoxedValues<{
		forceMount: boolean;
	}>
>;

type AccordionHeaderStateProps = WithRefProps<
	ReadableBoxedValues<{
		level: 1 | 2 | 3 | 4 | 5 | 6;
	}>
>;

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

// Base class
abstract class AccordionBaseState {
	readonly opts: AccordionBaseStateProps;
	readonly rovingFocusGroup: UseRovingFocusReturn;
	abstract readonly isMulti: boolean;

	constructor(opts: AccordionBaseStateProps) {
		this.opts = opts;
		this.rovingFocusGroup = useRovingFocus({
			rootNode: this.opts.ref,
			candidateAttr: accordionAttrs.trigger,
			loop: this.opts.loop,
			orientation: this.opts.orientation,
		});
	}

	abstract includesItem(item: string): boolean;
	abstract toggleItem(item: string): void;

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				[accordionAttrs.root]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

// Single accordion
export class AccordionSingleState extends AccordionBaseState {
	readonly opts: AccordionSingleStateProps;
	readonly isMulti = false as const;

	constructor(opts: AccordionSingleStateProps) {
		super(opts);
		this.opts = opts;
	}

	includesItem = (item: string): boolean => this.opts.value.current === item;

	toggleItem = (item: string): void => {
		this.opts.value.current = this.includesItem(item) ? "" : item;
	};
}

// Multiple accordion
export class AccordionMultiState extends AccordionBaseState {
	readonly #value: AccordionMultiStateProps["value"];
	readonly isMulti = true as const;

	constructor(props: AccordionMultiStateProps) {
		super(props);
		this.#value = props.value;
	}

	includesItem = (item: string): boolean => this.#value.current.includes(item);

	toggleItem = (item: string): void => {
		this.#value.current = this.includesItem(item)
			? this.#value.current.filter((v) => v !== item)
			: [...this.#value.current, item];
	};
}

// Item state
export class AccordionItemState {
	readonly opts: AccordionItemStateProps;
	readonly root: AccordionState;
	readonly isActive = $derived.by(() => this.root.includesItem(this.opts.value.current));
	readonly isDisabled = $derived.by(
		() => this.opts.disabled.current || this.root.opts.disabled.current
	);

	constructor(opts: AccordionItemStateProps) {
		this.opts = opts;
		this.root = opts.rootState;
	}

	updateValue = (): void => {
		this.root.toggleItem(this.opts.value.current);
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-state": getDataOpenClosed(this.isActive),
				"data-disabled": getDataDisabled(this.isDisabled),
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				[accordionAttrs.item]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

// Trigger state
class AccordionTriggerState {
	readonly opts: AccordionTriggerStateProps;
	readonly itemState: AccordionItemState;
	readonly #root: AccordionState;
	readonly #isDisabled = $derived.by(
		() =>
			this.opts.disabled.current ||
			this.itemState.opts.disabled.current ||
			this.#root.opts.disabled.current
	);

	constructor(opts: AccordionTriggerStateProps, itemState: AccordionItemState) {
		this.opts = opts;
		this.itemState = itemState;
		this.#root = itemState.root;
	}

	onclick = (e: BitsMouseEvent): void => {
		if (this.#isDisabled || e.button !== 0) {
			e.preventDefault();
			return;
		}
		this.itemState.updateValue();
	};

	onkeydown = (e: BitsKeyboardEvent): void => {
		if (this.#isDisabled) return;

		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.itemState.updateValue();
			return;
		}

		this.#root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.#isDisabled,
				"aria-expanded": getAriaExpanded(this.itemState.isActive),
				"aria-disabled": getAriaDisabled(this.#isDisabled),
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-state": getDataOpenClosed(this.itemState.isActive),
				"data-orientation": getDataOrientation(this.#root.opts.orientation.current),
				[accordionAttrs.trigger]: "",
				tabindex: 0,
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...attachRef(this.opts.ref),
			}) as const
	);
}

// Content state with improved animation handling
class AccordionContentState {
	readonly opts: AccordionContentStateProps;
	readonly item: AccordionItemState;

	#originalStyles: { transitionDuration: string; animationName: string } | undefined = undefined;
	#isMountAnimationPrevented = false;
	#dimensions = $state({ width: 0, height: 0 });

	readonly present = $derived.by(() => this.opts.forceMount.current || this.item.isActive);

	constructor(opts: AccordionContentStateProps, item: AccordionItemState) {
		this.opts = opts;
		this.item = item;
		this.#isMountAnimationPrevented = this.item.isActive;

		// Prevent mount animations on initial render
		$effect(() => {
			const rAF = requestAnimationFrame(() => {
				this.#isMountAnimationPrevented = false;
			});
			return () => cancelAnimationFrame(rAF);
		});

		// Handle dimension updates
		watch([() => this.present, () => this.opts.ref.current], this.#updateDimensions);
	}

	#updateDimensions = ([_, node]: [boolean, HTMLElement | null]): void => {
		if (!node) return;

		afterTick(() => {
			const element = this.opts.ref.current;
			if (!element) return;

			// store original styles on first run
			this.#originalStyles ??= {
				transitionDuration: element.style.transitionDuration,
				animationName: element.style.animationName,
			};

			// temporarily disable animations for measurement
			element.style.transitionDuration = "0s";
			element.style.animationName = "none";

			const rect = element.getBoundingClientRect();
			this.#dimensions = { width: rect.width, height: rect.height };

			// restore animations if not initial mount
			if (!this.#isMountAnimationPrevented && this.#originalStyles) {
				element.style.transitionDuration = this.#originalStyles.transitionDuration;
				element.style.animationName = this.#originalStyles.animationName;
			}
		});
	};

	readonly snippetProps = $derived.by(() => ({ open: this.item.isActive }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-state": getDataOpenClosed(this.item.isActive),
				"data-disabled": getDataDisabled(this.item.isDisabled),
				"data-orientation": getDataOrientation(this.item.root.opts.orientation.current),
				[accordionAttrs.content]: "",
				style: {
					"--bits-accordion-content-height": `${this.#dimensions.height}px`,
					"--bits-accordion-content-width": `${this.#dimensions.width}px`,
				},
				...attachRef(this.opts.ref),
			}) as const
	);
}

// Header state
class AccordionHeaderState {
	readonly opts: AccordionHeaderStateProps;
	readonly item: AccordionItemState;

	constructor(opts: AccordionHeaderStateProps, item: AccordionItemState) {
		this.opts = opts;
		this.item = item;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "heading",
				"aria-level": this.opts.level.current,
				"data-heading-level": this.opts.level.current,
				"data-state": getDataOpenClosed(this.item.isActive),
				"data-orientation": getDataOrientation(this.item.root.opts.orientation.current),
				[accordionAttrs.header]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

const AccordionRootContext = new Context<AccordionState>("Accordion.Root");
const AccordionItemContext = new Context<AccordionItemState>("Accordion.Item");

export function useAccordionRoot(props: InitAccordionProps): AccordionState {
	const { type, ...rest } = props;
	const rootState =
		type === "single"
			? new AccordionSingleState(rest as AccordionSingleStateProps)
			: new AccordionMultiState(rest as AccordionMultiStateProps);
	return AccordionRootContext.set(rootState);
}

export function useAccordionItem(
	props: Omit<AccordionItemStateProps, "rootState">
): AccordionItemState {
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
