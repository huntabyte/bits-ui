import { SvelteMap } from "svelte/reactivity";
import { attachRef, type ReadableBoxedValues, type WritableBoxedValues } from "svelte-toolbelt";
import { Context, watch } from "runed";
import type { TabsActivationMode } from "./types.js";
import {
	createBitsAttrs,
	getAriaOrientation,
	getAriaSelected,
	getDataDisabled,
	getDataOrientation,
	getDisabled,
	getHidden,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import type {
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	WithRefOpts,
} from "$lib/internal/types.js";
import type { Orientation } from "$lib/shared/index.js";
import { RovingFocusGroup } from "$lib/internal/roving-focus-group.svelte.js";

const tabsAttrs = createBitsAttrs({
	component: "tabs",
	parts: ["root", "list", "trigger", "content"],
});
type TabsRootStateProps = WithRefOpts<
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
	readonly opts: TabsRootStateProps;
	rovingFocusGroup: RovingFocusGroup;
	triggerIds = $state<string[]>([]);
	// holds the trigger ID for each value to associate it with the content
	readonly valueToTriggerId = new SvelteMap<string, string>();
	// holds the content ID for each value to associate it with the trigger
	readonly valueToContentId = new SvelteMap<string, string>();

	constructor(opts: TabsRootStateProps) {
		this.opts = opts;

		this.rovingFocusGroup = new RovingFocusGroup({
			candidateAttr: tabsAttrs.trigger,
			rootNode: this.opts.ref,
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

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				[tabsAttrs.root]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

//
// LIST
//

type TabsListStateProps = WithRefOpts;

class TabsListState {
	readonly opts: TabsListStateProps;
	readonly root: TabsRootState;
	#isDisabled = $derived.by(() => this.root.opts.disabled.current);

	constructor(opts: TabsListStateProps, root: TabsRootState) {
		this.opts = opts;
		this.root = root;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "tablist",
				"aria-orientation": getAriaOrientation(this.root.opts.orientation.current),
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				[tabsAttrs.list]: "",
				"data-disabled": getDataDisabled(this.#isDisabled),
				...attachRef(this.opts.ref),
			}) as const
	);
}

//
// TRIGGER
//

type TabsTriggerStateProps = WithRefOpts<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
	}>
>;

class TabsTriggerState {
	readonly opts: TabsTriggerStateProps;
	readonly root: TabsRootState;
	#tabIndex = $state(0);
	readonly #isActive = $derived.by(
		() => this.root.opts.value.current === this.opts.value.current
	);
	readonly #isDisabled = $derived.by(
		() => this.opts.disabled.current || this.root.opts.disabled.current
	);
	readonly #ariaControls = $derived.by(() =>
		this.root.valueToContentId.get(this.opts.value.current)
	);

	constructor(opts: TabsTriggerStateProps, root: TabsRootState) {
		this.opts = opts;
		this.root = root;

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

	readonly props = $derived.by(
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
				[tabsAttrs.trigger]: "",
				disabled: getDisabled(this.#isDisabled),
				tabindex: this.#tabIndex,
				//
				onclick: this.onclick,
				onfocus: this.onfocus,
				onkeydown: this.onkeydown,
				...attachRef(this.opts.ref),
			}) as const
	);
}
//
// CONTENT
//

type TabsContentStateProps = WithRefOpts<
	ReadableBoxedValues<{
		value: string;
	}>
>;

class TabsContentState {
	readonly opts: TabsContentStateProps;
	readonly root: TabsRootState;
	readonly #isActive = $derived.by(
		() => this.root.opts.value.current === this.opts.value.current
	);
	readonly #ariaLabelledBy = $derived.by(() =>
		this.root.valueToTriggerId.get(this.opts.value.current)
	);

	constructor(opts: TabsContentStateProps, root: TabsRootState) {
		this.opts = opts;
		this.root = root;

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
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				[tabsAttrs.content]: "",
				...attachRef(this.opts.ref),
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
