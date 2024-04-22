import { getContext, setContext } from "svelte";
import {
	type Box,
	type BoxedValues,
	type ReadonlyBox,
	type ReadonlyBoxedValues,
	afterTick,
	boxedState,
	getAriaExpanded,
	getDataDisabled,
	getDataOpenClosed,
	readonlyBoxedState,
	useId,
	useNodeById,
	verifyContextDeps,
} from "$lib/internal/index.js";

type CollapsibleRootStateProps = BoxedValues<{
	open: boolean;
}> &
	ReadonlyBoxedValues<{
		disabled: boolean;
	}>;

class CollapsibleRootState {
	open = undefined as unknown as Box<boolean>;
	disabled = undefined as unknown as ReadonlyBox<boolean>;
	contentId = readonlyBoxedState(useId());
	props = $derived({
		"data-state": getDataOpenClosed(this.open.value),
		"data-disabled": getDataDisabled(this.disabled.value),
		"data-collapsible-root": "",
	} as const);

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

type CollapsibleContentStateProps = ReadonlyBoxedValues<{
	id: string;
	forceMount: boolean;
}>;

class CollapsibleContentState {
	root = undefined as unknown as CollapsibleRootState;
	#originalStyles: { transitionDuration: string; animationName: string } | undefined;
	node = boxedState<HTMLElement | null>(null);
	#isMountAnimationPrevented = $state(false);
	#width = $state(0);
	#height = $state(0);
	#forceMount = undefined as unknown as ReadonlyBox<boolean>;
	props = $derived({
		id: this.root.contentId.value,
		"data-state": getDataOpenClosed(this.root.open.value),
		"data-disabled": getDataDisabled(this.root.disabled.value),
		"data-collapsible-content": "",
		style: {
			"--bits-collapsible-content-height": this.#height ? `${this.#height}px` : undefined,
			"--bits-collapsible-content-width": this.#width ? `${this.#width}px` : undefined,
		},
	} as const);
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

	props = $derived({
		type: "button",
		"aria-controls": this.#root.contentId.value,
		"aria-expanded": getAriaExpanded(this.#root.open.value),
		"data-state": getDataOpenClosed(this.#root.open.value),
		"data-disabled": getDataDisabled(this.#root.disabled.value),
		disabled: this.#root.disabled.value,
		"data-collapsible-trigger": "",
		//
		onclick: this.#onclick,
	} as const);
}

export const COLLAPSIBLE_ROOT_KEY = Symbol("Collapsible.Root");

export function setCollapsibleRootState(props: CollapsibleRootStateProps) {
	return setContext(COLLAPSIBLE_ROOT_KEY, new CollapsibleRootState(props));
}

export function getCollapsibleRootState() {
	verifyContextDeps(COLLAPSIBLE_ROOT_KEY);
	return getContext<CollapsibleRootState>(COLLAPSIBLE_ROOT_KEY);
}

export function getCollapsibleTriggerState(): CollapsibleTriggerState {
	return getCollapsibleRootState().createTrigger();
}

export function getCollapsibleContentState(
	props: CollapsibleContentStateProps
): CollapsibleContentState {
	return getCollapsibleRootState().createContent(props);
}
