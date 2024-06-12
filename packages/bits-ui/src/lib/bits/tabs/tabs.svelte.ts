import type { WritableBox } from "svelte-toolbelt";
import type { TabsActivationMode } from "./types.js";
import {
	type ReadableBoxedValues,
	type WritableBoxedValues,
	getAriaOrientation,
	getDataDisabled,
	getDataOrientation,
	getDisabledAttr,
	getHiddenAttr,
	isBrowser,
	kbd,
	useNodeById,
} from "$lib/internal/index.js";
import type { Orientation } from "$lib/shared/index.js";
import { type UseRovingFocusReturn, useRovingFocus } from "$lib/internal/useRovingFocus.svelte.js";
import { createContext } from "$lib/internal/createContext.js";

const ROOT_ATTR = "data-tabs-root";
const LIST_ATTR = "data-tabs-list";
const TRIGGER_ATTR = "data-tabs-trigger";
const CONTENT_ATTR = "data-tabs-content";

type TabsRootStateProps = ReadableBoxedValues<{
	id: string;
	orientation: Orientation;
	loop: boolean;
	activationMode: TabsActivationMode;
	disabled: boolean;
}> &
	WritableBoxedValues<{
		value: string;
	}>;

class TabsRootState {
	id: TabsRootStateProps["id"];
	node: WritableBox<HTMLElement | null>;
	orientation: TabsRootStateProps["orientation"];
	loop: TabsRootStateProps["loop"];
	activationMode: TabsRootStateProps["activationMode"];
	value: TabsRootStateProps["value"];
	disabled: TabsRootStateProps["disabled"];
	rovingFocusGroup: UseRovingFocusReturn;
	triggerIds = $state<string[]>([]);

	constructor(props: TabsRootStateProps) {
		this.id = props.id;
		this.orientation = props.orientation;
		this.loop = props.loop;
		this.activationMode = props.activationMode;
		this.value = props.value;
		this.disabled = props.disabled;
		this.node = useNodeById(this.id);
		this.rovingFocusGroup = useRovingFocus({
			candidateSelector: TRIGGER_ATTR,
			rootNodeId: this.id,
			loop: this.loop,
			orientation: this.orientation,
		});
	}

	setValue(v: string) {
		this.value.value = v;
	}

	createList() {
		return new TabsListState(this);
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
				id: this.id.value,
				"data-orientation": getDataOrientation(this.orientation.value),
				[ROOT_ATTR]: "",
			}) as const
	);
}

//
// LIST
//

class TabsListState {
	#root: TabsRootState;
	#isDisabled = $derived.by(() => this.#root.disabled.value);

	constructor(root: TabsRootState) {
		this.#root = root;
	}

	props = $derived.by(
		() =>
			({
				role: "tablist",
				"aria-orientation": getAriaOrientation(this.#root.orientation.value),
				"data-orientation": getDataOrientation(this.#root.orientation.value),
				[LIST_ATTR]: "",
				"data-disabled": getDataDisabled(this.#isDisabled),
			}) as const
	);
}

//
// TRIGGER
//

type TabsTriggerStateProps = ReadableBoxedValues<{
	id: string;
	value: string;
	disabled: boolean;
}>;

class TabsTriggerState {
	#root: TabsRootState;
	#id: TabsTriggerStateProps["id"];
	#disabled: TabsTriggerStateProps["disabled"];
	#value: TabsTriggerStateProps["value"];
	#isActive = $derived.by(() => this.#root.value.value === this.#value.value);
	#isDisabled = $derived.by(() => this.#disabled.value || this.#root.disabled.value);
	#tabIndex = $state(0);

	constructor(props: TabsTriggerStateProps, root: TabsRootState) {
		this.#root = root;
		this.#id = props.id;
		this.#value = props.value;
		this.#disabled = props.disabled;

		$effect(() => {
			if (this.#root.triggerIds.length) {
				this.#tabIndex = this.#root.rovingFocusGroup.getTabIndex(this.#getNode());
			}
		});
	}

	#getNode() {
		if (!isBrowser) return null;
		return document.getElementById(this.#id.value);
	}

	activate() {
		if (this.#root.value.value === this.#value.value) return;
		this.#root.setValue(this.#value.value);
	}

	#onfocus = () => {
		if (this.#root.activationMode.value !== "automatic" || this.#disabled.value) return;

		this.activate();
	};

	#onclick = (e: MouseEvent) => {
		const node = document.getElementById(this.#id.value);
		if (!node || this.#isDisabled) return;
		e.preventDefault();
		node.focus();
		this.activate();
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (this.#isDisabled) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.activate();
			return;
		}
		this.#root.rovingFocusGroup.handleKeydown(this.#getNode(), e);
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				role: "tab",
				"data-state": getTabDataState(this.#isActive),
				"data-value": this.#value.value,
				"data-orientation": getDataOrientation(this.#root.orientation.value),
				"data-disabled": getDataDisabled(this.#disabled.value),
				[TRIGGER_ATTR]: "",
				disabled: getDisabledAttr(this.#disabled.value),
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

type TabsContentStateProps = ReadableBoxedValues<{
	value: string;
}>;

class TabsContentState {
	#root: TabsRootState;
	#value: TabsContentStateProps["value"];
	#isActive = $derived.by(() => this.#root.value.value === this.#value.value);

	constructor(props: TabsContentStateProps, root: TabsRootState) {
		this.#root = root;
		this.#value = props.value;
	}

	props = $derived.by(
		() =>
			({
				role: "tabpanel",
				hidden: getHiddenAttr(!this.#isActive),
				tabindex: 0,
				"data-value": this.#value.value,
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

export function useTabsList() {
	return getTabsRootContext().createList();
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
