import { useRefById } from "$lib/internal/useRefById.svelte.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { afterTick } from "$lib/internal/afterTick.js";
import { getAriaExpanded, getDataDisabled, getDataOpenClosed } from "$lib/internal/attrs.js";
import { createContext } from "$lib/internal/createContext.js";

const COLLAPSIBLE_ROOT_ATTR = "data-collapsible-root";
const COLLAPSIBLE_CONTENT_ATTR = "data-collapsible-content";
const COLLAPSIBLE_TRIGGER_ATTR = "data-collapsible-trigger";

type CollapsibleRootStateProps = WritableBoxedValues<{
	open: boolean;
	ref: HTMLElement | null;
}> &
	ReadableBoxedValues<{
		disabled: boolean;
		id: string;
	}>;

class CollapsibleRootState {
	#id: CollapsibleRootStateProps["id"];
	#ref: CollapsibleRootStateProps["ref"];
	open: CollapsibleRootStateProps["open"];
	disabled: CollapsibleRootStateProps["disabled"];
	contentNode = $state<HTMLElement | null>(null);
	contentId = $state<string | undefined>(undefined);

	constructor(props: CollapsibleRootStateProps) {
		this.open = props.open;
		this.disabled = props.disabled;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	toggleOpen() {
		this.open.current = !this.open.current;
	}

	createContent(props: CollapsibleContentStateProps) {
		return new CollapsibleContentState(props, this);
	}

	createTrigger(props: CollapsibleTriggerStateProps) {
		return new CollapsibleTriggerState(props, this);
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"data-state": getDataOpenClosed(this.open.current),
				"data-disabled": getDataDisabled(this.disabled.current),
				[COLLAPSIBLE_ROOT_ATTR]: "",
			}) as const
	);
}

type CollapsibleContentStateProps = ReadableBoxedValues<{
	id: string;
	forceMount: boolean;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class CollapsibleContentState {
	#id: CollapsibleContentStateProps["id"];
	#ref: CollapsibleContentStateProps["ref"];
	root: CollapsibleRootState;
	#originalStyles: { transitionDuration: string; animationName: string } | undefined;
	#isMountAnimationPrevented = $state(false);
	#width = $state(0);
	#height = $state(0);
	#forceMount: CollapsibleContentStateProps["forceMount"];

	present = $derived.by(() => this.#forceMount.current || this.root.open.current);

	constructor(props: CollapsibleContentStateProps, root: CollapsibleRootState) {
		this.root = root;
		this.#isMountAnimationPrevented = root.open.current;
		this.#forceMount = props.forceMount;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			deps: () => this.present,
			onRefChange: (node) => {
				this.root.contentNode = node;
				this.root.contentId = node?.id;
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

		$effect(() => {
			this.present;
			const node = this.#ref.current;
			if (!node) return;

			afterTick(() => {
				if (!this.#ref.current) return;
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
		open: this.root.open.current,
	}));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				style: {
					"--bits-collapsible-content-height": this.#height
						? `${this.#height}px`
						: undefined,
					"--bits-collapsible-content-width": this.#width
						? `${this.#width}px`
						: undefined,
				},
				"data-state": getDataOpenClosed(this.root.open.current),
				"data-disabled": getDataDisabled(this.root.disabled.current),
				[COLLAPSIBLE_CONTENT_ATTR]: "",
			}) as const
	);
}

type CollapsibleTriggerStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean | null | undefined;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class CollapsibleTriggerState {
	#root: CollapsibleRootState;
	#ref: CollapsibleTriggerStateProps["ref"];
	#id: CollapsibleTriggerStateProps["id"];
	#disabled: CollapsibleTriggerStateProps["disabled"];
	#isDisabled = $derived.by(() => this.#disabled.current || this.#root.disabled.current);

	constructor(props: CollapsibleTriggerStateProps, root: CollapsibleRootState) {
		this.#root = root;
		this.#id = props.id;
		this.#ref = props.ref;
		this.#disabled = props.disabled;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onclick = () => {
		this.#root.toggleOpen();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				type: "button",
				disabled: this.#isDisabled,
				"aria-controls": this.#root.contentId,
				"aria-expanded": getAriaExpanded(this.#root.open.current),
				"data-state": getDataOpenClosed(this.#root.open.current),
				"data-disabled": getDataDisabled(this.#isDisabled),
				[COLLAPSIBLE_TRIGGER_ATTR]: "",
				//
				onclick: this.#onclick,
			}) as const
	);
}

const [setCollapsibleRootContext, getCollapsibleRootContext] =
	createContext<CollapsibleRootState>("Collapsible.Root");

export function useCollapsibleRoot(props: CollapsibleRootStateProps) {
	return setCollapsibleRootContext(new CollapsibleRootState(props));
}

export function useCollapsibleTrigger(
	props: CollapsibleTriggerStateProps
): CollapsibleTriggerState {
	return getCollapsibleRootContext().createTrigger(props);
}

export function useCollapsibleContent(
	props: CollapsibleContentStateProps
): CollapsibleContentState {
	return getCollapsibleRootContext().createContent(props);
}
