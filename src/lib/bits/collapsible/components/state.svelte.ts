import { mergeProps, type EventCallback, type OnChangeFn, composeHandlers } from "$lib/internal";
import { getDataDisabled, getDataOpenClosed } from "$lib/internal/new/helpers";
import { getContext, setContext } from "svelte";
import type { CollapsibleWithoutHTML } from "./types";

/**
 * The parameters used to initialize the state of the collapsible.
 */
type CollapsibleStateParams = Required<Omit<CollapsibleWithoutHTML, "onOpenChange">> & {
	onOpenChange?: OnChangeFn<boolean>;
};

const defaultState = {
	open: false,
	defaultOpen: false,
	disabled: false,
	onOpenChange: undefined
} satisfies CollapsibleStateParams;

export class CollapsibleState {
	open: CollapsibleStateParams["open"] = $state(defaultState.open);
	defaultOpen: CollapsibleStateParams["defaultOpen"] = $state(defaultState.defaultOpen);
	disabled: CollapsibleStateParams["disabled"] = $state(defaultState.disabled);
	onOpenChange: CollapsibleStateParams["onOpenChange"] = $state(defaultState.onOpenChange);

	/** Attributes */
	rootAttrs = $derived({
		"data-state": getDataOpenClosed(this.open),
		"data-disabled": getDataDisabled(this.disabled),
		"data-collapsible-root": ""
	});

	triggerAttrs = $derived({
		"data-state": getDataOpenClosed(this.open),
		"data-disabled": getDataDisabled(this.disabled),
		"data-collapsible-trigger": ""
	});

	contentAttrs = $derived({
		"data-state": getDataOpenClosed(this.open),
		"data-disabled": getDataDisabled(this.disabled),
		"data-collapsible-content": ""
	});

	constructor(init: Partial<CollapsibleStateParams> = {}) {
		const props = mergeProps(defaultState, init);
		this.open = props.open;
		this.defaultOpen = props.defaultOpen;
		this.disabled = props.disabled;
		this.onOpenChange = props.onOpenChange;

		$effect(() => {
			this.onOpenChange?.(this.open);
		});
	}

	toggle() {
		this.open = !this.open;
	}

	createTrigger(init: TriggerStateParams) {
		return new CollapsibleTriggerState(this, init);
	}
}

type TriggerStateParams = {
	onclick?: EventCallback<MouseEvent, HTMLButtonElement>;
};

const defaultTriggerState = {
	onclick: undefined
} satisfies TriggerStateParams;

class CollapsibleTriggerState {
	rootState: CollapsibleState;
	propsOnClick: TriggerStateParams["onclick"] = $state(undefined);

	constructor(rootState: CollapsibleState, init: Partial<TriggerStateParams> = {}) {
		const props = mergeProps(defaultTriggerState, init);
		this.rootState = rootState;
		this.propsOnClick = props.onclick;
	}

	onclick = composeHandlers<MouseEvent, HTMLButtonElement>(this.propsOnClick, () => {
		if (this.rootState.disabled) return;
		this.rootState.toggle();
	});
}

/**
 * CONTEXT METHODS
 */

const COLLAPSIBLE_ROOT_CONTEXT = "COLLAPSIBLE_ROOT_CONTEXT";

export function initCollapsibleState(props: Partial<CollapsibleStateParams>) {
	const state = new CollapsibleState(props);
	setContext(COLLAPSIBLE_ROOT_CONTEXT, state);
	return state;
}

export function getCollapsibleState(): CollapsibleState {
	return getContext(COLLAPSIBLE_ROOT_CONTEXT);
}
