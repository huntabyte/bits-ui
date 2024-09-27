import { untrack } from "svelte";
import type { TabsActivationMode } from "./types.js";
import {
	getAriaOrientation,
	getDataDisabled,
	getDataOrientation,
	getDisabled,
	getHidden,
} from "$lib/internal/attrs.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import type { Orientation } from "$lib/shared/index.js";
import { type UseRovingFocusReturn, useRovingFocus } from "$lib/internal/useRovingFocus.svelte.js";
import { createContext } from "$lib/internal/createContext.js";

const ROOT_ATTR = "data-tabs-root";
const LIST_ATTR = "data-tabs-list";
const TRIGGER_ATTR = "data-tabs-trigger";
const CONTENT_ATTR = "data-tabs-content";

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
	#id: TabsRootStateProps["id"];
	ref: TabsRootStateProps["ref"];
	orientation: TabsRootStateProps["orientation"];
	loop: TabsRootStateProps["loop"];
	activationMode: TabsRootStateProps["activationMode"];
	value: TabsRootStateProps["value"];
	disabled: TabsRootStateProps["disabled"];
	rovingFocusGroup: UseRovingFocusReturn;
	triggerIds = $state<string[]>([]);

	constructor(props: TabsRootStateProps) {
		this.#id = props.id;
		this.ref = props.ref;
		this.orientation = props.orientation;
		this.loop = props.loop;
		this.activationMode = props.activationMode;
		this.value = props.value;
		this.disabled = props.disabled;

		useRefById({
			id: this.#id,
			ref: this.ref,
		});

		this.rovingFocusGroup = useRovingFocus({
			candidateAttr: TRIGGER_ATTR,
			rootNodeId: this.#id,
			loop: this.loop,
			orientation: this.orientation,
		});
	}

	registerTrigger = (id: string) => {
		this.triggerIds.push(id);
	};

	deRegisterTrigger = (id: string) => {
		this.triggerIds = this.triggerIds.filter((triggerId) => triggerId !== id);
	};

	setValue = (v: string) => {
		this.value.current = v;
	};

	createList(props: TabsListStateProps) {
		return new TabsListState(props, this);
	}

	createTrigger(props: TabsTriggerStateProps) {
		return new TabsTriggerState(props, this);
	}

	createContent(props: TabsContentStateProps) {
		return new TabsContentState(props, this);
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"data-orientation": getDataOrientation(this.orientation.current),
				[ROOT_ATTR]: "",
			}) as const
	);
}

//
// LIST
//

type TabsListStateProps = WithRefProps;

class TabsListState {
	#id: TabsListStateProps["id"];
	#ref: TabsListStateProps["ref"];
	#root: TabsRootState;
	#isDisabled = $derived.by(() => this.#root.disabled.current);

	constructor(props: TabsListStateProps, root: TabsRootState) {
		this.#root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "tablist",
				"aria-orientation": getAriaOrientation(this.#root.orientation.current),
				"data-orientation": getDataOrientation(this.#root.orientation.current),
				[LIST_ATTR]: "",
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
	#root: TabsRootState;
	#id: TabsTriggerStateProps["id"];
	#ref: TabsTriggerStateProps["ref"];
	#disabled: TabsTriggerStateProps["disabled"];
	#value: TabsTriggerStateProps["value"];
	#isActive = $derived.by(() => this.#root.value.current === this.#value.current);
	#isDisabled = $derived.by(() => this.#disabled.current || this.#root.disabled.current);
	#tabIndex = $state(0);

	constructor(props: TabsTriggerStateProps, root: TabsRootState) {
		this.#root = root;
		this.#id = props.id;
		this.#ref = props.ref;
		this.#value = props.value;
		this.#disabled = props.disabled;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		$effect(() => {
			// we want to track the value
			const id = this.#id.current;
			// on mount register the trigger
			untrack(() => this.#root.registerTrigger(id));

			return () => {
				// deregister on ID change or unmount
				this.#root.deRegisterTrigger(id);
			};
		});

		$effect(() => {
			if (this.#root.triggerIds.length) {
				this.#tabIndex = this.#root.rovingFocusGroup.getTabIndex(this.#ref.current);
			}
		});
	}

	activate = () => {
		if (this.#root.value.current === this.#value.current) return;
		this.#root.setValue(this.#value.current);
	};

	#onfocus = () => {
		if (this.#root.activationMode.current !== "automatic" || this.#disabled.current) return;
		this.activate();
	};

	#onclick = (e: MouseEvent) => {
		if (!this.#ref.current || this.#isDisabled) return;
		e.preventDefault();
		this.#ref.current.focus();
		this.activate();
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (this.#isDisabled) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.activate();
			return;
		}
		this.#root.rovingFocusGroup.handleKeydown(this.#ref.current, e);
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "tab",
				"data-state": getTabDataState(this.#isActive),
				"data-value": this.#value.current,
				"data-orientation": getDataOrientation(this.#root.orientation.current),
				"data-disabled": getDataDisabled(this.#disabled.current),
				[TRIGGER_ATTR]: "",
				disabled: getDisabled(this.#disabled.current),
				tabindex: this.#tabIndex,
				//
				onclick: this.#onclick,
				onfocus: this.#onfocus,
				onkeydown: this.#onkeydown,
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
	#root: TabsRootState;
	#id: TabsContentStateProps["id"];
	#ref: TabsContentStateProps["ref"];
	#value: TabsContentStateProps["value"];
	#isActive = $derived.by(() => this.#root.value.current === this.#value.current);

	constructor(props: TabsContentStateProps, root: TabsRootState) {
		this.#root = root;
		this.#value = props.value;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				role: "tabpanel",
				hidden: getHidden(!this.#isActive),
				tabindex: 0,
				"data-value": this.#value.current,
				"data-state": getTabDataState(this.#isActive),
				[CONTENT_ATTR]: "",
			}) as const
	);
}

//
// CONTEXT METHODS
//

const [setTabsRootContext, getTabsRootContext] = createContext<TabsRootState>("Tabs.Root");

export function useTabsRoot(props: TabsRootStateProps) {
	return setTabsRootContext(new TabsRootState(props));
}

export function useTabsTrigger(props: TabsTriggerStateProps) {
	return getTabsRootContext().createTrigger(props);
}

export function useTabsList(props: TabsListStateProps) {
	return getTabsRootContext().createList(props);
}

export function useTabsContent(props: TabsContentStateProps) {
	return getTabsRootContext().createContent(props);
}

//
// HELPERS
//

function getTabDataState(condition: boolean): "active" | "inactive" {
	return condition ? "active" : "inactive";
}
