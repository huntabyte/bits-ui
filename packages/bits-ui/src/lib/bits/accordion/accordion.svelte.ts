import {
	afterTick,
	attachRef,
	type Box,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "svelte-toolbelt";
import { Context, watch } from "runed";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefOpts } from "$lib/internal/types.js";
import {
	getAriaDisabled,
	getAriaExpanded,
	getDataDisabled,
	getDataOpenClosed,
	getDataOrientation,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import type { Orientation } from "$lib/shared/index.js";
import { createBitsAttrs } from "$lib/internal/attrs.js";
import { RovingFocusGroup } from "$lib/internal/roving-focus-group.svelte.js";

const accordionAttrs = createBitsAttrs({
	component: "accordion",
	parts: ["root", "trigger", "content", "item", "header"],
});

type AccordionBaseStateOpts = WithRefOpts<
	ReadableBoxedValues<{
		disabled: boolean;
		orientation: Orientation;
		loop: boolean;
	}>
>;

type AccordionSingleStateOpts = AccordionBaseStateOpts & WritableBoxedValues<{ value: string }>;
type AccordionMultiStateOpts = AccordionBaseStateOpts & WritableBoxedValues<{ value: string[] }>;
type AccordionRoot = AccordionSingleState | AccordionMultiState;

type AccordionItemStateOpts = WithRefOpts<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
	}> & {
		rootState: AccordionRoot;
	}
>;

type AccordionTriggerStateOpts = WithRefOpts<
	ReadableBoxedValues<{
		disabled: boolean | null | undefined;
	}>
>;

type AccordionContentStateOpts = WithRefOpts<
	ReadableBoxedValues<{
		forceMount: boolean;
	}>
>;

type AccordionHeaderStateProps = WithRefOpts<
	ReadableBoxedValues<{
		level: 1 | 2 | 3 | 4 | 5 | 6;
	}>
>;

type AccordionRootStateOpts = WithRefOpts<
	{
		type: "single" | "multiple";
		value: Box<string> | Box<string[]>;
	} & ReadableBoxedValues<{
		disabled: boolean;
		orientation: Orientation;
		loop: boolean;
	}>
>;

abstract class AccordionBaseState {
	readonly opts: AccordionBaseStateOpts;
	readonly rovingFocusGroup: RovingFocusGroup;
	abstract readonly isMulti: boolean;

	constructor(opts: AccordionBaseStateOpts) {
		this.opts = opts;
		this.rovingFocusGroup = new RovingFocusGroup({
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

class AccordionSingleState extends AccordionBaseState {
	readonly opts: AccordionSingleStateOpts;
	readonly isMulti = false as const;

	constructor(opts: AccordionSingleStateOpts) {
		super(opts);
		this.opts = opts;
		this.includesItem = this.includesItem.bind(this);
		this.toggleItem = this.toggleItem.bind(this);
	}

	includesItem(item: string): boolean {
		return this.opts.value.current === item;
	}

	toggleItem(item: string): void {
		this.opts.value.current = this.includesItem(item) ? "" : item;
	}
}

class AccordionMultiState extends AccordionBaseState {
	readonly #value: AccordionMultiStateOpts["value"];
	readonly isMulti = true as const;

	constructor(props: AccordionMultiStateOpts) {
		super(props);
		this.#value = props.value;
		this.includesItem = this.includesItem.bind(this);
		this.toggleItem = this.toggleItem.bind(this);
	}

	includesItem(item: string): boolean {
		return this.#value.current.includes(item);
	}

	toggleItem(item: string): void {
		this.#value.current = this.includesItem(item)
			? this.#value.current.filter((v) => v !== item)
			: [...this.#value.current, item];
	}
}

const AccordionRootContext = new Context<AccordionRoot>("Accordion.Root");

export class AccordionRootState {
	static create(props: AccordionRootStateOpts): AccordionRoot {
		const { type, ...rest } = props;
		const rootState =
			type === "single"
				? new AccordionSingleState(rest as AccordionSingleStateOpts)
				: new AccordionMultiState(rest as AccordionMultiStateOpts);
		return AccordionRootContext.set(rootState);
	}
}

const AccordionItemContext = new Context<AccordionItemState>("Accordion.Item");

export class AccordionItemState {
	static create(props: Omit<AccordionItemStateOpts, "rootState">): AccordionItemState {
		return AccordionItemContext.set(
			new AccordionItemState({ ...props, rootState: AccordionRootContext.get() })
		);
	}

	readonly opts: AccordionItemStateOpts;
	readonly root: AccordionRoot;
	readonly isActive = $derived.by(() => this.root.includesItem(this.opts.value.current));
	readonly isDisabled = $derived.by(
		() => this.opts.disabled.current || this.root.opts.disabled.current
	);

	constructor(opts: AccordionItemStateOpts) {
		this.opts = opts;
		this.root = opts.rootState;
		this.updateValue = this.updateValue.bind(this);
	}

	updateValue(): void {
		this.root.toggleItem(this.opts.value.current);
	}

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

export class AccordionTriggerState {
	readonly opts: AccordionTriggerStateOpts;
	readonly itemState: AccordionItemState;
	readonly #root: AccordionRoot;
	readonly #isDisabled = $derived.by(
		() =>
			this.opts.disabled.current ||
			this.itemState.opts.disabled.current ||
			this.#root.opts.disabled.current
	);

	constructor(opts: AccordionTriggerStateOpts, itemState: AccordionItemState) {
		this.opts = opts;
		this.itemState = itemState;
		this.#root = itemState.root;
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	static create(props: AccordionTriggerStateOpts): AccordionTriggerState {
		return new AccordionTriggerState(props, AccordionItemContext.get());
	}

	onclick(e: BitsMouseEvent): void {
		if (this.#isDisabled || e.button !== 0) {
			e.preventDefault();
			return;
		}
		this.itemState.updateValue();
	}

	onkeydown(e: BitsKeyboardEvent): void {
		if (this.#isDisabled) return;

		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.itemState.updateValue();
			return;
		}

		this.#root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}

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

export class AccordionContentState {
	readonly opts: AccordionContentStateOpts;
	readonly item: AccordionItemState;

	#originalStyles: { transitionDuration: string; animationName: string } | undefined = undefined;
	#isMountAnimationPrevented = false;
	#dimensions = $state({ width: 0, height: 0 });

	readonly open = $derived.by(() => this.opts.forceMount.current || this.item.isActive);

	constructor(opts: AccordionContentStateOpts, item: AccordionItemState) {
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
		watch([() => this.open, () => this.opts.ref.current], this.#updateDimensions);
	}

	static create(props: AccordionContentStateOpts): AccordionContentState {
		return new AccordionContentState(props, AccordionItemContext.get());
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

export class AccordionHeaderState {
	readonly opts: AccordionHeaderStateProps;
	readonly item: AccordionItemState;

	constructor(opts: AccordionHeaderStateProps, item: AccordionItemState) {
		this.opts = opts;
		this.item = item;
	}

	static create(props: AccordionHeaderStateProps): AccordionHeaderState {
		return new AccordionHeaderState(props, AccordionItemContext.get());
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
