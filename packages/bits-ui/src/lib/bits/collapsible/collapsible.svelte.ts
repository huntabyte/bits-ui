import { afterTick, attachRef, type WithRefProps } from "svelte-toolbelt";
import { Context, watch } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import {
	createBitsAttrs,
	getAriaExpanded,
	getDataDisabled,
	getDataOpenClosed,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import type { BitsKeyboardEvent, BitsMouseEvent } from "$lib/internal/types.js";

const collapsibleAttrs = createBitsAttrs({
	component: "collapsible",
	parts: ["root", "content", "trigger"],
});

type CollapsibleRootStateProps = WithRefProps &
	WritableBoxedValues<{
		open: boolean;
	}> &
	ReadableBoxedValues<{
		disabled: boolean;
	}>;

class CollapsibleRootState {
	readonly opts: CollapsibleRootStateProps;
	contentNode = $state<HTMLElement | null>(null);

	constructor(opts: CollapsibleRootStateProps) {
		this.opts = opts;
		this.toggleOpen = this.toggleOpen.bind(this);
	}

	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-state": getDataOpenClosed(this.opts.open.current),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				[collapsibleAttrs.root]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

type CollapsibleContentStateProps = WithRefProps &
	ReadableBoxedValues<{
		forceMount: boolean;
	}>;
class CollapsibleContentState {
	readonly opts: CollapsibleContentStateProps;
	readonly root: CollapsibleRootState;
	#originalStyles: { transitionDuration: string; animationName: string } | undefined;
	#isMountAnimationPrevented = $state(false);
	#width = $state(0);
	#height = $state(0);
	present = $derived.by(() => this.opts.forceMount.current || this.root.opts.open.current);

	constructor(opts: CollapsibleContentStateProps, root: CollapsibleRootState) {
		this.opts = opts;
		this.root = root;
		this.#isMountAnimationPrevented = root.opts.open.current;

		$effect.pre(() => {
			const rAF = requestAnimationFrame(() => {
				this.#isMountAnimationPrevented = false;
			});

			return () => {
				cancelAnimationFrame(rAF);
			};
		});

		watch([() => this.opts.ref.current, () => this.present], ([node]) => {
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
		open: this.root.opts.open.current,
	}));

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: {
					"--bits-collapsible-content-height": this.#height
						? `${this.#height}px`
						: undefined,
					"--bits-collapsible-content-width": this.#width
						? `${this.#width}px`
						: undefined,
				},
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				[collapsibleAttrs.content]: "",
				...attachRef(this.opts.ref, (v) => (this.root.contentNode = v)),
			}) as const
	);
}

type CollapsibleTriggerStateProps = WithRefProps &
	ReadableBoxedValues<{
		disabled: boolean | null | undefined;
	}>;

class CollapsibleTriggerState {
	readonly opts: CollapsibleTriggerStateProps;
	readonly root: CollapsibleRootState;
	#isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);

	constructor(opts: CollapsibleTriggerStateProps, root: CollapsibleRootState) {
		this.opts = opts;
		this.root = root;
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.#isDisabled) return;
		if (e.button !== 0) return e.preventDefault();
		this.root.toggleOpen();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;

		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.root.toggleOpen();
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				type: "button",
				disabled: this.#isDisabled,
				"aria-controls": this.root.contentNode?.id,
				"aria-expanded": getAriaExpanded(this.root.opts.open.current),
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				"data-disabled": getDataDisabled(this.#isDisabled),
				[collapsibleAttrs.trigger]: "",
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...attachRef(this.opts.ref),
			}) as const
	);
}

const CollapsibleRootContext = new Context<CollapsibleRootState>("Collapsible.Root");

export function useCollapsibleRoot(props: CollapsibleRootStateProps) {
	return CollapsibleRootContext.set(new CollapsibleRootState(props));
}

export function useCollapsibleTrigger(
	props: CollapsibleTriggerStateProps
): CollapsibleTriggerState {
	return new CollapsibleTriggerState(props, CollapsibleRootContext.get());
}

export function useCollapsibleContent(
	props: CollapsibleContentStateProps
): CollapsibleContentState {
	return new CollapsibleContentState(props, CollapsibleRootContext.get());
}
