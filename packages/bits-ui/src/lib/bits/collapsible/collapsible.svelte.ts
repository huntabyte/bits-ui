import { afterTick, useRefById, type WithRefProps } from "svelte-toolbelt";
import { Context, watch } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { getAriaExpanded, getDataDisabled, getDataOpenClosed } from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import type { BitsKeyboardEvent, BitsMouseEvent } from "$lib/internal/types.js";

const COLLAPSIBLE_ROOT_ATTR = "data-collapsible-root";
const COLLAPSIBLE_CONTENT_ATTR = "data-collapsible-content";
const COLLAPSIBLE_TRIGGER_ATTR = "data-collapsible-trigger";

type CollapsibleRootStateProps = WithRefProps &
	WritableBoxedValues<{
		open: boolean;
	}> &
	ReadableBoxedValues<{
		disabled: boolean;
	}>;

class CollapsibleRootState {
	contentNode = $state<HTMLElement | null>(null);

	constructor(readonly opts: CollapsibleRootStateProps) {
		this.toggleOpen = this.toggleOpen.bind(this);

		useRefById(opts);
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
				[COLLAPSIBLE_ROOT_ATTR]: "",
			}) as const
	);
}

type CollapsibleContentStateProps = WithRefProps &
	ReadableBoxedValues<{
		forceMount: boolean;
	}>;
class CollapsibleContentState {
	#originalStyles: { transitionDuration: string; animationName: string } | undefined;
	#isMountAnimationPrevented = $state(false);
	#width = $state(0);
	#height = $state(0);
	present = $derived.by(() => this.opts.forceMount.current || this.root.opts.open.current);

	constructor(
		readonly opts: CollapsibleContentStateProps,
		readonly root: CollapsibleRootState
	) {
		this.#isMountAnimationPrevented = root.opts.open.current;

		useRefById({
			...opts,
			deps: () => this.present,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
		});

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
				[COLLAPSIBLE_CONTENT_ATTR]: "",
			}) as const
	);
}

type CollapsibleTriggerStateProps = WithRefProps &
	ReadableBoxedValues<{
		disabled: boolean | null | undefined;
	}>;

class CollapsibleTriggerState {
	#isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);

	constructor(
		readonly opts: CollapsibleTriggerStateProps,
		readonly root: CollapsibleRootState
	) {
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);

		useRefById(opts);
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
				[COLLAPSIBLE_TRIGGER_ATTR]: "",
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
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
