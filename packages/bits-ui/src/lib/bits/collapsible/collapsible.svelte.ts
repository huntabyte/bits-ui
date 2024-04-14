import { getContext, onMount, setContext } from "svelte";
import { getAriaExpanded, getDataDisabled, getDataOpenClosed } from "$lib/internal/attrs.js";
import { type Box, type BoxedValues, box, watch } from "$lib/internal/box.svelte.js";
import { generateId } from "$lib/internal/id.js";
import { styleToString } from "$lib/internal/style.js";
import { type EventCallback, composeHandlers } from "$lib/internal/events.js";

type CollapsibleRootStateProps = BoxedValues<{
	open: boolean;
	disabled: boolean;
}>;

class CollapsibleRootState {
	open: Box<boolean> = box(() => false);
	disabled: Box<boolean> = box(() => false);
	#attrs = $derived({
		"data-state": getDataOpenClosed(this.open.value),
		"data-disabled": getDataDisabled(this.disabled.value),
		"data-collapsible-root": "",
	} as const);
	contentId = box(generateId());

	constructor(props: CollapsibleRootStateProps) {
		this.open = props.open;
		this.disabled = props.disabled;
	}

	get props() {
		return this.#attrs;
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
}

type CollapsibleContentStateProps = BoxedValues<{
	id: string;
	presentEl: HTMLElement | undefined;
}>;

class CollapsibleContentState {
	root = undefined as unknown as CollapsibleRootState;
	currentStyle = box<Record<string, string>>({});
	isMountAnimationPrevented = box(this.root.open.value);
	width = box(0);
	height = box(0);
	presentEl: Box<HTMLElement | undefined> = box<HTMLElement | undefined>(undefined);
	#attrs = $derived({
		id: this.root.contentId.value,
		"data-state": getDataOpenClosed(this.root.open.value),
		"data-disabled": getDataDisabled(this.root.disabled.value),
		"data-collapsible-content": "",
		style: styleToString({
			"--bits-collapsible-content-height": `${this.height.value}px`,
			"--bits-collapsible-content-width": `${this.width.value}px`,
		}),
	} as const);

	constructor(props: CollapsibleContentStateProps, root: CollapsibleRootState) {
		this.root = root;
		this.presentEl = props.presentEl;
		this.root.contentId = props.id;

		onMount(() => {
			requestAnimationFrame(() => {
				this.isMountAnimationPrevented.value = false;
			});
		});

		$effect(() => {
			const node = this.presentEl.value;
			if (!node) return;
			this.currentStyle.value = this.currentStyle.value || {
				transitionDuration: node.style.transitionDuration,
				animationName: node.style.animationName,
			};

			// block any animations/transitions so the element renders at full dimensions
			node.style.transitionDuration = "0s";
			node.style.animationName = "none";

			// get the dimensions of the element
			const rect = node.getBoundingClientRect();
			this.height.value = rect.height;
			this.width.value = rect.width;

			// unblock any animations/transitions that were originally set if not the initial render
			if (!this.isMountAnimationPrevented.value) {
				const transitionDuration = this.currentStyle.value.transitionDuration;
				const animationName = this.currentStyle.value.animationName;
				if (transitionDuration) {
					node.style.transitionDuration = transitionDuration;
				}
				if (animationName) {
					node.style.animationName = animationName;
				}
			}
		});
	}

	get props() {
		return this.#attrs;
	}
}

type CollapsibleTriggerStateProps = BoxedValues<{
	onclick: EventCallback<MouseEvent>;
}>;

class CollapsibleTriggerState {
	root = undefined as unknown as CollapsibleRootState;
	onclickProp = box(() => () => {}) as unknown as CollapsibleTriggerStateProps["onclick"];
	#attrs = $derived({
		type: "button",
		"aria-controls": this.root.contentId.value,
		"aria-expanded": getAriaExpanded(this.root.open.value),
		"data-state": getDataOpenClosed(this.root.open.value),
		"data-disabled": getDataDisabled(this.root.disabled.value),
		disabled: this.root.disabled.value,
		"data-collapsible-trigger": "",
	} as const);

	constructor(props: CollapsibleTriggerStateProps, root: CollapsibleRootState) {
		this.root = root;
		this.onclickProp = props.onclick ?? this.onclickProp;
	}

	onclick = composeHandlers(this.onclickProp.value, () => {
		this.root.toggleOpen();
	});

	get props() {
		return {
			...this.#attrs,
			onclick: this.onclick,
		};
	}
}

export const COLLAPSIBLE_ROOT_KEY = Symbol("Collapsible.Root");

export function setCollapsibleRootState(props: CollapsibleRootStateProps) {
	return setContext(COLLAPSIBLE_ROOT_KEY, new CollapsibleRootState(props));
}

export function getCollapsibleRootState(): CollapsibleRootState {
	return getContext(COLLAPSIBLE_ROOT_KEY);
}

export function getCollapsibleTriggerState(
	props: CollapsibleTriggerStateProps
): CollapsibleTriggerState {
	return getCollapsibleRootState().createTrigger(props);
}

export function getCollapsibleContentState(
	props: CollapsibleContentStateProps
): CollapsibleContentState {
	return getCollapsibleRootState().createContent(props);
}
