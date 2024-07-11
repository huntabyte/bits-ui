import {
	type ReadableBoxedValues,
	type WritableBoxedValues,
	afterTick,
	getAriaExpanded,
	getDataDisabled,
	getDataOpenClosed,
	useRefById,
} from "$lib/internal/index.js";
import { createContext } from "$lib/internal/createContext.js";

const ROOT_ATTR = "data-collapsible-root";
const CONTENT_ATTR = "data-collapsible-content";
const TRIGGER_ATTR = "data-collapsible-trigger";

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
		this.open.value = !this.open.value;
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
				id: this.#id.value,
				"data-state": getDataOpenClosed(this.open.value),
				"data-disabled": getDataDisabled(this.disabled.value),
				[ROOT_ATTR]: "",
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

	present = $derived.by(() => this.#forceMount.value || this.root.open.value);

	constructor(props: CollapsibleContentStateProps, root: CollapsibleRootState) {
		this.root = root;
		this.#isMountAnimationPrevented = root.open.value;
		this.#forceMount = props.forceMount;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			condition: () => this.present,
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

		$effect(() => {
			this.present;
			const node = this.#ref.value;
			if (!node) return;

			afterTick(() => {
				if (!this.#ref.value) return;
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

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
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
}

type CollapsibleTriggerStateProps = ReadableBoxedValues<{
	id: string;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class CollapsibleTriggerState {
	#root: CollapsibleRootState;
	#ref: CollapsibleTriggerStateProps["ref"];
	#id: CollapsibleTriggerStateProps["id"];

	constructor(props: CollapsibleTriggerStateProps, root: CollapsibleRootState) {
		this.#root = root;
		this.#id = props.id;
		this.#ref = props.ref;

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
				id: this.#id.value,
				type: "button",
				"aria-controls": this.#root.contentNode?.id,
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
