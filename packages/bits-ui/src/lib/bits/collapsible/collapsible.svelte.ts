import { box } from "svelte-toolbelt";
import {
	type ReadableBoxedValues,
	type WritableBoxedValues,
	afterTick,
	getAriaExpanded,
	getDataDisabled,
	getDataOpenClosed,
	useId,
	useNodeById,
} from "$lib/internal/index.js";
import { createContext } from "$lib/internal/createContext.js";

const ROOT_ATTR = "data-collapsible-root";
const CONTENT_ATTR = "data-collapsible-content";
const TRIGGER_ATTR = "data-collapsible-trigger";

type CollapsibleRootStateProps = WritableBoxedValues<{
	open: boolean;
}> &
	ReadableBoxedValues<{
		disabled: boolean;
	}>;

class CollapsibleRootState {
	open = undefined as unknown as CollapsibleRootStateProps["open"];
	disabled = undefined as unknown as CollapsibleRootStateProps["disabled"];
	contentId = box.with(() => useId());
	props = $derived.by(
		() =>
			({
				"data-state": getDataOpenClosed(this.open.value),
				"data-disabled": getDataDisabled(this.disabled.value),
				[ROOT_ATTR]: "",
			}) as const
	);

	constructor(props: CollapsibleRootStateProps) {
		this.open = props.open;
		this.disabled = props.disabled;
	}

	toggleOpen() {
		this.open.value = !this.open.value;
	}

	createContent(props: CollapsibleContentStateProps) {
		return new CollapsibleContentState(props, this);
	}

	createTrigger() {
		return new CollapsibleTriggerState(this);
	}
}

type CollapsibleContentStateProps = ReadableBoxedValues<{
	id: string;
	forceMount: boolean;
}>;

class CollapsibleContentState {
	root = undefined as unknown as CollapsibleRootState;
	#originalStyles: { transitionDuration: string; animationName: string } | undefined;
	node = box<HTMLElement | null>(null);
	#isMountAnimationPrevented = $state(false);
	#width = $state(0);
	#height = $state(0);
	#forceMount = undefined as unknown as CollapsibleContentStateProps["forceMount"];
	props = $derived.by(
		() =>
			({
				id: this.root.contentId.value,
				"data-state": getDataOpenClosed(this.root.open.value),
				"data-disabled": getDataDisabled(this.root.disabled.value),
				style: {
					"--bits-collapsible-content-height": this.#height
						? `${this.#height}px`
						: undefined,
					"--bits-collapsible-content-width": this.#width
						? `${this.#width}px`
						: undefined,
				},
				[CONTENT_ATTR]: "",
			}) as const
	);
	present = $derived(this.#forceMount.value || this.root.open.value);

	constructor(props: CollapsibleContentStateProps, root: CollapsibleRootState) {
		this.root = root;
		this.#isMountAnimationPrevented = root.open.value;
		this.#forceMount = props.forceMount;
		this.root.contentId = props.id;

		this.node = useNodeById(this.root.contentId);

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
}

class CollapsibleTriggerState {
	#root = undefined as unknown as CollapsibleRootState;

	constructor(root: CollapsibleRootState) {
		this.#root = root;
	}

	#onclick = () => {
		this.#root.toggleOpen();
	};

	props = $derived.by(
		() =>
			({
				type: "button",
				"aria-controls": this.#root.contentId.value,
				"aria-expanded": getAriaExpanded(this.#root.open.value),
				"data-state": getDataOpenClosed(this.#root.open.value),
				"data-disabled": getDataDisabled(this.#root.disabled.value),
				disabled: this.#root.disabled.value,
				[TRIGGER_ATTR]: "",
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

export function useCollapsibleTrigger(): CollapsibleTriggerState {
	return getCollapsibleRootContext().createTrigger();
}

export function useCollapsibleContent(
	props: CollapsibleContentStateProps
): CollapsibleContentState {
	return getCollapsibleRootContext().createContent(props);
}
