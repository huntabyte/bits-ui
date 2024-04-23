import { getContext, setContext } from "svelte";
import type { TabsActivationMode } from "./types.js";
import {
	type Box,
	type BoxedValues,
	type ReadonlyBoxedValues,
	boxedState,
	getAriaOrientation,
	getAttrAndSelector,
	getDataDisabled,
	getDataOrientation,
	getDirectionalKeys,
	getDisabledAttr,
	getElemDirection,
	getHiddenAttr,
	kbd,
	useNodeById,
	verifyContextDeps,
} from "$lib/internal/index.js";
import type { Orientation } from "$lib/shared/index.js";

const [ROOT_ATTR] = getAttrAndSelector("tabs-root");
const [LIST_ATTR] = getAttrAndSelector("tabs-list");
const [TRIGGER_ATTR, TRIGGER_SELECTOR] = getAttrAndSelector("tabs-trigger");
const [CONTENT_ATTR] = getAttrAndSelector("tabs-content");

type TabsRootStateProps = ReadonlyBoxedValues<{
	id: string;
	orientation: Orientation;
	loop: boolean;
	activationMode: TabsActivationMode;
	disabled: boolean;
}> &
	BoxedValues<{
		value: string;
	}>;

class TabsRootState {
	id = undefined as unknown as TabsRootStateProps["id"];
	node = undefined as unknown as Box<HTMLElement | null>;
	orientation = undefined as unknown as TabsRootStateProps["orientation"];
	loop = undefined as unknown as TabsRootStateProps["loop"];
	activationMode = undefined as unknown as TabsRootStateProps["activationMode"];
	value = undefined as unknown as TabsRootStateProps["value"];
	activeTabId = boxedState("");
	anyActive = $derived(this.value.value !== "");
	disabled = undefined as unknown as TabsRootStateProps["disabled"];

	constructor(props: TabsRootStateProps) {
		this.id = props.id;
		this.orientation = props.orientation;
		this.loop = props.loop;
		this.activationMode = props.activationMode;
		this.value = props.value;
		this.disabled = props.disabled;
		this.node = useNodeById(this.id);
	}

	getTriggerNodes() {
		const node = this.node.value;
		if (!node) return [];
		return Array.from(node.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR)).filter(
			(el) => !el.hasAttribute("data-disabled")
		);
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

	props = $derived({
		id: this.id.value,
		"data-orientation": getDataOrientation(this.orientation.value),
		[ROOT_ATTR]: "",
	} as const);
}

//
// LIST
//

class TabsListState {
	#root = undefined as unknown as TabsRootState;
	#isDisabled = $derived(this.#root.disabled.value);

	constructor(root: TabsRootState) {
		this.#root = root;
	}

	props = $derived({
		role: "tablist",
		"aria-orientation": getAriaOrientation(this.#root.orientation.value),
		"data-orientation": getDataOrientation(this.#root.orientation.value),
		[LIST_ATTR]: "",
		"data-disabled": getDataDisabled(this.#isDisabled),
	} as const);
}

//
// TRIGGER
//

type TabsTriggerStateProps = ReadonlyBoxedValues<{
	id: string;
	value: string;
	disabled: boolean;
}>;

class TabsTriggerState {
	#root = undefined as unknown as TabsRootState;
	#id = undefined as unknown as TabsTriggerStateProps["id"];
	#node = undefined as unknown as Box<HTMLElement | null>;
	#disabled = undefined as unknown as TabsTriggerStateProps["disabled"];
	#value = undefined as unknown as TabsTriggerStateProps["value"];
	#isActive = $derived(this.#root.value.value === this.#value.value);
	#isDisabled = $derived(this.#disabled.value || this.#root.disabled.value);

	constructor(props: TabsTriggerStateProps, root: TabsRootState) {
		this.#root = root;
		this.#id = props.id;
		this.#value = props.value;
		this.#node = useNodeById(this.#id);
		this.#disabled = props.disabled;
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
		if (!this.#node.value || this.#isDisabled) return;
		e.preventDefault();
		this.#node.value.focus();
		this.activate();
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (this.#isDisabled) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.activate();
			return;
		}

		const node = this.#node.value;
		const rootNode = this.#root.node.value;
		if (!node || !rootNode) return;

		const items = this.#root.getTriggerNodes();
		if (!items.length) return;
		const currentIndex = items.indexOf(node);
		const dir = getElemDirection(rootNode);
		const { nextKey, prevKey } = getDirectionalKeys(dir, this.#root.orientation.value);

		const loop = this.#root.loop.value;

		const keyToIndex = {
			[nextKey]: currentIndex + 1,
			[prevKey]: currentIndex - 1,
			[kbd.HOME]: 0,
			[kbd.END]: items.length - 1,
		};

		let itemIndex = keyToIndex[e.key];
		if (itemIndex === undefined) return;
		e.preventDefault();

		if (itemIndex < 0 && loop) {
			itemIndex = items.length - 1;
		} else if (itemIndex === items.length && loop) {
			itemIndex = 0;
		}

		const itemToFocus = items[itemIndex];
		if (!itemToFocus) return;
		itemToFocus.focus();
		this.#root.activeTabId.value = itemToFocus.id;
	};

	#tabIndex = $derived.by(() => {
		const node = this.#node.value;
		if (!node) return -1;
		const items = this.#root.getTriggerNodes();
		const anyActive = this.#root.anyActive;
		if (!anyActive && items[0] === node) {
			this.#root.activeTabId.value = this.#id.value;
			return 0;
		} else if (!this.#root.activeTabId.value && items[0] === node) {
			this.#root.activeTabId.value = this.#id.value;
			return 0;
		} else if (this.#id.value === this.#root.activeTabId.value) {
			return 0;
		}

		return -1;
	});

	props = $derived({
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
	} as const);
}

//
// CONTENT
//

type TabsContentStateProps = ReadonlyBoxedValues<{
	value: string;
}>;

class TabsContentState {
	#root = undefined as unknown as TabsRootState;
	#value = undefined as unknown as TabsContentStateProps["value"];
	#isActive = $derived(this.#root.value.value === this.#value.value);

	constructor(props: TabsContentStateProps, root: TabsRootState) {
		this.#root = root;
		this.#value = props.value;
	}

	props = $derived({
		role: "tabpanel",
		hidden: getHiddenAttr(!this.#isActive),
		tabindex: 0,
		"data-value": this.#value.value,
		"data-state": getTabDataState(this.#isActive),
		[CONTENT_ATTR]: "",
	} as const);
}

//
// CONTEXT METHODS
//

const TABS_ROOT_KEY = Symbol("Tabs.Root");

export function setTabsRootState(props: TabsRootStateProps) {
	return setContext(TABS_ROOT_KEY, new TabsRootState(props));
}

export function getTabsRootState(): TabsRootState {
	verifyContextDeps(TABS_ROOT_KEY);
	return getContext(TABS_ROOT_KEY);
}

export function setTabsTriggerState(props: TabsTriggerStateProps) {
	return getTabsRootState().createTrigger(props);
}

export function setTabsListState() {
	return getTabsRootState().createList();
}

export function setTabsContentState(props: TabsContentStateProps) {
	return getTabsRootState().createContent(props);
}

//
// HELPERS
//

function getTabDataState(condition: boolean): "active" | "inactive" {
	return condition ? "active" : "inactive";
}
