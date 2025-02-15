import { SvelteMap } from "svelte/reactivity";
import { useRefById } from "svelte-toolbelt";
import { Context, watch } from "runed";
import type { TabsActivationMode } from "./types.js";
import {
	getAriaOrientation,
	getAriaSelected,
	getDataDisabled,
	getDataOrientation,
	getDisabled,
	getHidden,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type {
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	WithRefProps,
} from "$lib/internal/types.js";
import type { Orientation } from "$lib/shared/index.js";
import {
	type UseRovingFocusReturn,
	useRovingFocus,
} from "$lib/internal/use-roving-focus.svelte.js";

const TABS_ROOT_ATTR = "data-tabs-root";
const TABS_LIST_ATTR = "data-tabs-list";
const TABS_TRIGGER_ATTR = "data-tabs-trigger";
const TABS_CONTENT_ATTR = "data-tabs-content";

type TabsRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		orientation: Orientation;
		loop: boolean;
		activationMode: TabsActivationMode;
		disabled: boolean;
	}> &
		WritableBoxedValues<{
			value: string;
		}>
>;

class TabsRootState {
	rovingFocusGroup: UseRovingFocusReturn;
	triggerIds = $state<string[]>([]);
	// holds the trigger ID for each value to associate it with the content
	valueToTriggerId = new SvelteMap<string, string>();
	// holds the content ID for each value to associate it with the trigger
	valueToContentId = new SvelteMap<string, string>();

	constructor(readonly opts: TabsRootStateProps) {
		useRefById(opts);

		this.rovingFocusGroup = useRovingFocus({
			candidateSelector: `[${TABS_TRIGGER_ATTR}]:not([data-disabled])`,
			rootNodeId: this.opts.id,
			loop: this.opts.loop,
			orientation: this.opts.orientation,
		});
	}

	registerTrigger(id: string, value: string) {
		this.triggerIds.push(id);
		this.valueToTriggerId.set(value, id);

		// returns the deregister function
		return () => {
			this.triggerIds = this.triggerIds.filter((triggerId) => triggerId !== id);
			this.valueToTriggerId.delete(value);
		};
	}

	registerContent(id: string, value: string) {
		this.valueToContentId.set(value, id);

		// returns the deregister function
		return () => {
			this.valueToContentId.delete(value);
		};
	}

	setValue(v: string) {
		this.opts.value.current = v;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				[TABS_ROOT_ATTR]: "",
			}) as const
	);
}

//
// LIST
//

type TabsListStateProps = WithRefProps;

class TabsListState {
	#isDisabled = $derived.by(() => this.root.opts.disabled.current);

	constructor(
		readonly opts: TabsListStateProps,
		readonly root: TabsRootState
	) {
		useRefById(opts);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "tablist",
				"aria-orientation": getAriaOrientation(this.root.opts.orientation.current),
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				[TABS_LIST_ATTR]: "",
				"data-disabled": getDataDisabled(this.#isDisabled),
			}) as const
	);
}

//
// TRIGGER
//

type TabsTriggerStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
	}>
>;

class TabsTriggerState {
	#isActive = $derived.by(() => this.root.opts.value.current === this.opts.value.current);
	#isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);
	#tabIndex = $state(0);
	#ariaControls = $derived.by(() => this.root.valueToContentId.get(this.opts.value.current));

	constructor(
		readonly opts: TabsTriggerStateProps,
		readonly root: TabsRootState
	) {
		useRefById(opts);

		watch([() => this.opts.id.current, () => this.opts.value.current], ([id, value]) => {
			return this.root.registerTrigger(id, value);
		});

		$effect(() => {
			this.root.triggerIds.length;
			if (this.#isActive || !this.root.opts.value.current) {
				this.#tabIndex = 0;
			} else {
				this.#tabIndex = -1;
			}
		});
		this.onfocus = this.onfocus.bind(this);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#activate() {
		if (this.root.opts.value.current === this.opts.value.current) return;
		this.root.setValue(this.opts.value.current);
	}

	onfocus(_: BitsFocusEvent) {
		if (this.root.opts.activationMode.current !== "automatic" || this.#isDisabled) return;
		this.#activate();
	}

	onclick(_: BitsMouseEvent) {
		if (this.#isDisabled) return;
		this.#activate();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.#activate();
			return;
		}
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "tab",
				"data-state": getTabDataState(this.#isActive),
				"data-value": this.opts.value.current,
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				"data-disabled": getDataDisabled(this.#isDisabled),
				"aria-selected": getAriaSelected(this.#isActive),
				"aria-controls": this.#ariaControls,
				[TABS_TRIGGER_ATTR]: "",
				disabled: getDisabled(this.#isDisabled),
				tabindex: this.#tabIndex,
				//
				onclick: this.onclick,
				onfocus: this.onfocus,
				onkeydown: this.onkeydown,
			}) as const
	);
}
//
// CONTENT
//

type TabsContentStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
	}>
>;

class TabsContentState {
	#isActive = $derived.by(() => this.root.opts.value.current === this.opts.value.current);
	#ariaLabelledBy = $derived.by(() => this.root.valueToTriggerId.get(this.opts.value.current));

	constructor(
		readonly opts: TabsContentStateProps,
		readonly root: TabsRootState
	) {
		useRefById(opts);

		watch([() => this.opts.id.current, () => this.opts.value.current], ([id, value]) => {
			return this.root.registerContent(id, value);
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "tabpanel",
				hidden: getHidden(!this.#isActive),
				tabindex: 0,
				"data-value": this.opts.value.current,
				"data-state": getTabDataState(this.#isActive),
				"aria-labelledby": this.#ariaLabelledBy,
				[TABS_CONTENT_ATTR]: "",
			}) as const
	);
}

const TabsRootContext = new Context<TabsRootState>("Tabs.Root");

export function useTabsRoot(props: TabsRootStateProps) {
	return TabsRootContext.set(new TabsRootState(props));
}

export function useTabsTrigger(props: TabsTriggerStateProps) {
	return new TabsTriggerState(props, TabsRootContext.get());
}

export function useTabsList(props: TabsListStateProps) {
	return new TabsListState(props, TabsRootContext.get());
}

export function useTabsContent(props: TabsContentStateProps) {
	return new TabsContentState(props, TabsRootContext.get());
}

function getTabDataState(condition: boolean): "active" | "inactive" {
	return condition ? "active" : "inactive";
}
