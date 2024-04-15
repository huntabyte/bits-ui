import { getContext, onMount, setContext } from "svelte";
import { getAriaExpanded, getDataDisabled, getDataOpenClosed } from "$lib/internal/attrs.js";
import {
	type Box,
	type BoxedValues,
	type ReadonlyBox,
	type ReadonlyBoxedValues,
	box,
	boxedState,
	readonlyBox,
	readonlyBoxedState,
	watch,
} from "$lib/internal/box.svelte.js";
import { generateId } from "$lib/internal/id.js";
import { styleToString } from "$lib/internal/style.js";
import { type EventCallback, composeHandlers } from "$lib/internal/events.js";

type CollapsibleRootStateProps = BoxedValues<{
	open: boolean;
}> &
	ReadonlyBoxedValues<{
		disabled: boolean;
	}>;

class CollapsibleRootState {
	open = undefined as unknown as Box<boolean>;
	disabled = undefined as unknown as ReadonlyBox<boolean>;
	#attrs = $derived({
		"data-state": getDataOpenClosed(this.open.value),
		"data-disabled": getDataDisabled(this.disabled.value),
		"data-collapsible-root": "",
	} as const);
	contentId = readonlyBoxedState(generateId());

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
	presentEl: HTMLElement | undefined;
}> &
	ReadonlyBoxedValues<{
		id: string;
	}>;

class CollapsibleContentState {
	root = undefined as unknown as CollapsibleRootState;
	currentStyle = boxedState<{ transitionDuration: string; animationName: string } | undefined>(
		undefined
	);
	isMountAnimationPrevented = $state(false);
	width = boxedState(0);
	height = boxedState(0);
	presentEl: Box<HTMLElement | undefined> = boxedState<HTMLElement | undefined>(undefined);
	present = $derived(this.root.open);
	#attrs = $derived({
		id: this.root.contentId.value,
		"data-state": getDataOpenClosed(this.root.open.value),
		"data-disabled": getDataDisabled(this.root.disabled.value),
		"data-collapsible-content": "",
		style: styleToString({
			"--bits-collapsible-content-height": this.height.value
				? `${this.height.value}px`
				: undefined,
			"--bits-collapsible-content-width": this.width.value
				? `${this.width.value}px`
				: undefined,
		}),
	} as const);

	constructor(props: CollapsibleContentStateProps, root: CollapsibleRootState) {
		this.root = root;
		this.isMountAnimationPrevented = root.open.value;
		this.presentEl = props.presentEl;
		this.root.contentId = props.id;

		onMount(() => {
			requestAnimationFrame(() => {
				this.isMountAnimationPrevented = false;
			});
		});

		$effect.pre(() => {
			// eslint-disable-next-line no-unused-expressions
			this.root.open.value;
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
			if (!this.isMountAnimationPrevented) {
				const { animationName, transitionDuration } = this.currentStyle.value;
				node.style.transitionDuration = transitionDuration;
				node.style.animationName = animationName;
			}
		});
	}

	get props() {
		return this.#attrs;
	}
}

type CollapsibleTriggerStateProps = ReadonlyBoxedValues<{
	onclick: EventCallback<MouseEvent>;
}>;

class CollapsibleTriggerState {
	root = undefined as unknown as CollapsibleRootState;
	onclickProp = boxedState<CollapsibleTriggerStateProps["onclick"]>(readonlyBox(() => () => {}));

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
		this.onclickProp.value = props.onclick;
	}

	onclick = composeHandlers(this.onclickProp, () => {
		this.root.toggleOpen();
	});

	get props() {
		return {
			...this.#attrs,
			onclick: this.onclick,
		};
	}
}

export const COLLAPSIBLE_ROOT_KEY = "Collapsible.Root";

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
