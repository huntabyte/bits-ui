import { getContext, setContext } from "svelte";
import {
	getAriaChecked,
	getAriaPressed,
	getDataDisabled,
	getDataOrientation,
	getDisabledAttr,
} from "$lib/internal/attrs.js";
import {
	type Box,
	type BoxedValues,
	type ReadonlyBoxedValues,
	boxedState,
} from "$lib/internal/box.svelte.js";
import { verifyContextDeps } from "$lib/internal/context.js";
import { kbd } from "$lib/internal/kbd.js";
import { useNodeById } from "$lib/internal/useNodeById.svelte.js";
import { type UseRovingFocusReturn, useRovingFocus } from "$lib/internal/useRovingFocus.svelte.js";
import type { Orientation } from "$lib/shared/index.js";

const ROOT_ATTR = "data-toolbar-root";
// all links, buttons, and items must have the ITEM_ATTR for roving focus
const ITEM_ATTR = "data-toolbar-item";
const GROUP_ATTR = "data-toolbar-group";
const GROUP_ITEM_ATTR = "data-toolbar-group-item";
const LINK_ATTR = "data-toolbar-link";
const BUTTON_ATTR = "data-toolbar-button";

type ToolbarRootStateProps = ReadonlyBoxedValues<{
	orientation: Orientation;
	loop: boolean;
	id: string;
}>;

class ToolbarRootState {
	#id = undefined as unknown as ToolbarRootStateProps["id"];
	orientation = undefined as unknown as ToolbarRootStateProps["orientation"];
	#loop = undefined as unknown as ToolbarRootStateProps["loop"];
	#node = boxedState<HTMLElement | null>(null);
	rovingFocusGroup = undefined as unknown as UseRovingFocusReturn;

	constructor(props: ToolbarRootStateProps) {
		this.#id = props.id;
		this.orientation = props.orientation;
		this.#loop = props.loop;
		this.#node = useNodeById(this.#id);
		this.rovingFocusGroup = useRovingFocus({
			orientation: this.orientation,
			loop: this.#loop,
			rootNode: this.#node,
			candidateSelector: ITEM_ATTR,
		});
	}

	createGroup(props: InitToolbarGroupProps) {
		const { type, ...rest } = props;
		const groupState =
			type === "single"
				? new ToolbarGroupSingleState(rest as ToolbarGroupSingleStateProps, this)
				: new ToolbarGroupMultipleState(rest as ToolbarGroupMultipleStateProps, this);
		return groupState;
	}

	createLink(props: ToolbarLinkStateProps) {
		return new ToolbarLinkState(props, this);
	}

	createButton(props: ToolbarButtonStateProps) {
		return new ToolbarButtonState(props, this);
	}

	props = $derived({
		id: this.#id.value,
		role: "toolbar",
		"data-orientation": this.orientation.value,
		[ROOT_ATTR]: "",
	} as const);
}

type ToolbarGroupBaseStateProps = ReadonlyBoxedValues<{
	id: string;
	disabled: boolean;
}>;

class ToolbarGroupBaseState {
	id = undefined as unknown as ToolbarGroupBaseStateProps["id"];
	node = boxedState<HTMLElement | null>(null);
	disabled = undefined as unknown as ToolbarGroupBaseStateProps["disabled"];
	root = undefined as unknown as ToolbarRootState;

	constructor(props: ToolbarGroupBaseStateProps, root: ToolbarRootState) {
		this.id = props.id;
		this.node = useNodeById(this.id);
		this.disabled = props.disabled;
		this.root = root;
	}

	props = $derived({
		id: this.id.value,
		[GROUP_ATTR]: "",
		role: "group",
		"data-orientation": getDataOrientation(this.root.orientation.value),
		"data-disabled": getDataDisabled(this.disabled.value),
	} as const);
}

//
// SINGLE
//

type ToolbarGroupSingleStateProps = ToolbarGroupBaseStateProps &
	BoxedValues<{
		value: string;
	}>;

class ToolbarGroupSingleState extends ToolbarGroupBaseState {
	#value = undefined as unknown as ToolbarGroupSingleStateProps["value"];
	isMulti = false;
	anyPressed = $derived(this.#value.value !== "");

	constructor(props: ToolbarGroupSingleStateProps, root: ToolbarRootState) {
		super(props, root);
		this.#value = props.value;
	}

	createItem(props: ToolbarGroupItemStateProps) {
		return new ToolbarGroupItemState(props, this, this.root);
	}

	includesItem(item: string) {
		return this.#value.value === item;
	}

	toggleItem(item: string) {
		if (this.includesItem(item)) {
			this.#value.value = "";
		} else {
			this.#value.value = item;
		}
	}
}

//
// MULTIPLE
//

type ToolbarGroupMultipleStateProps = ToolbarGroupBaseStateProps &
	BoxedValues<{
		value: string[];
	}>;

class ToolbarGroupMultipleState extends ToolbarGroupBaseState {
	#value = undefined as unknown as ToolbarGroupMultipleStateProps["value"];
	isMulti = true;
	anyPressed = $derived(this.#value.value.length > 0);

	constructor(props: ToolbarGroupMultipleStateProps, root: ToolbarRootState) {
		super(props, root);
		this.#value = props.value;
	}

	createItem(props: ToolbarGroupItemStateProps) {
		return new ToolbarGroupItemState(props, this, this.root);
	}

	includesItem(item: string) {
		return this.#value.value.includes(item);
	}

	toggleItem(item: string) {
		if (this.includesItem(item)) {
			this.#value.value = this.#value.value.filter((v) => v !== item);
		} else {
			this.#value.value = [...this.#value.value, item];
		}
	}
}

type ToolbarGroupState = ToolbarGroupSingleState | ToolbarGroupMultipleState;

//
// ITEM
//

type ToolbarGroupItemStateProps = ReadonlyBoxedValues<{
	id: string;
	value: string;
	disabled: boolean;
}>;

class ToolbarGroupItemState {
	#id = undefined as unknown as ToolbarGroupItemStateProps["id"];
	#group = undefined as unknown as ToolbarGroupState;
	#root = undefined as unknown as ToolbarRootState;
	#value = undefined as unknown as ToolbarGroupItemStateProps["value"];
	#node = boxedState<HTMLElement | null>(null);
	#disabled = undefined as unknown as ToolbarGroupItemStateProps["disabled"];
	#isDisabled = $derived(this.#disabled.value || this.#group.disabled.value);

	constructor(
		props: ToolbarGroupItemStateProps,
		group: ToolbarGroupState,
		root: ToolbarRootState
	) {
		this.#value = props.value;
		this.#disabled = props.disabled;
		this.#group = group;
		this.#root = root;
		this.#id = props.id;
		this.#node = useNodeById(this.#id);
	}

	toggleItem() {
		if (this.#isDisabled) return;
		this.#group.toggleItem(this.#value.value);
	}

	#onclick = () => {
		this.toggleItem();
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (this.#isDisabled) return;
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			this.toggleItem();
			return;
		}

		this.#root.rovingFocusGroup.handleKeydown(this.#node.value, e);
	};

	#isPressed = $derived(this.#group.includesItem(this.#value.value));

	#ariaChecked = $derived.by(() => {
		return this.#group.isMulti ? undefined : getAriaChecked(this.#isPressed);
	});

	#ariaPressed = $derived.by(() => {
		return this.#group.isMulti ? undefined : getAriaPressed(this.#isPressed);
	});

	#tabIndex = $derived(this.#root.rovingFocusGroup.getTabIndex(this.#node.value).value);

	props = $derived({
		id: this.#id.value,
		role: this.#group.isMulti ? undefined : "radio",
		tabindex: this.#tabIndex,
		"data-orientation": getDataOrientation(this.#root.orientation.value),
		"data-disabled": getDataDisabled(this.#isDisabled),
		"data-state": getToggleItemDataState(this.#isPressed),
		"data-value": this.#value.value,
		"aria-pressed": this.#ariaPressed,
		"aria-checked": this.#ariaChecked,
		[ITEM_ATTR]: "",
		[GROUP_ITEM_ATTR]: "",
		disabled: getDisabledAttr(this.#isDisabled),
		//
		onclick: this.#onclick,
		onkeydown: this.#onkeydown,
	});
}

type ToolbarLinkStateProps = ReadonlyBoxedValues<{
	id: string;
}>;

class ToolbarLinkState {
	#id = undefined as unknown as ToolbarLinkStateProps["id"];
	#node = boxedState<HTMLElement | null>(null);
	#root = undefined as unknown as ToolbarRootState;

	constructor(props: ToolbarLinkStateProps, root: ToolbarRootState) {
		this.#root = root;
		this.#id = props.id;
		this.#node = useNodeById(this.#id);
	}

	#onkeydown = (e: KeyboardEvent) => {
		this.#root.rovingFocusGroup.handleKeydown(this.#node.value, e);
	};

	#role = $derived.by(() => {
		if (!this.#node.value) return undefined;
		const tagName = this.#node.value.tagName;
		if (tagName !== "A") return "link" as const;
		return undefined;
	});

	#tabIndex = $derived(this.#root.rovingFocusGroup.getTabIndex(this.#node.value).value);

	props = $derived({
		id: this.#id.value,
		[LINK_ATTR]: "",
		[ITEM_ATTR]: "",
		role: this.#role,
		tabindex: this.#tabIndex,
		"data-orientation": getDataOrientation(this.#root.orientation.value),
		//
		onkeydown: this.#onkeydown,
	});
}

type ToolbarButtonStateProps = ReadonlyBoxedValues<{
	id: string;
	disabled: boolean;
}>;

class ToolbarButtonState {
	#id = undefined as unknown as ToolbarButtonStateProps["id"];
	#root = undefined as unknown as ToolbarRootState;
	#node = boxedState<HTMLElement | null>(null);
	#disabled = undefined as unknown as ToolbarButtonStateProps["disabled"];

	constructor(props: ToolbarButtonStateProps, root: ToolbarRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#node = useNodeById(this.#id);
		this.#disabled = props.disabled;
	}

	#onkeydown = (e: KeyboardEvent) => {
		this.#root.rovingFocusGroup.handleKeydown(this.#node.value, e);
	};

	#tabIndex = $derived(this.#root.rovingFocusGroup.getTabIndex(this.#node.value).value);

	#role = $derived.by(() => {
		if (!this.#node.value) return undefined;
		const tagName = this.#node.value.tagName;
		if (tagName !== "BUTTON") return "button" as const;
		return undefined;
	});

	props = $derived({
		id: this.#id.value,
		[ITEM_ATTR]: "",
		[BUTTON_ATTR]: "",
		role: this.#role,
		tabindex: this.#tabIndex,
		"data-disabled": getDataDisabled(this.#disabled.value),
		"data-orientation": getDataOrientation(this.#root.orientation.value),
		disabled: getDisabledAttr(this.#disabled.value),
		//
		onkeydown: this.#onkeydown,
	});
}

//
// HELPERS
//

function getToggleItemDataState(condition: boolean) {
	return condition ? "on" : "off";
}

//
// CONTEXT METHODS
//

const TOOLBAR_ROOT_KEY = Symbol("Toolbar.Root");
const TOOLBAR_GROUP_KEY = Symbol("Toolbar.Group");

export function setToolbarRootState(props: ToolbarRootStateProps) {
	return setContext(TOOLBAR_ROOT_KEY, new ToolbarRootState(props));
}

export function getToolbarRootState(): ToolbarRootState {
	verifyContextDeps(TOOLBAR_ROOT_KEY);
	return getContext(TOOLBAR_ROOT_KEY);
}

type InitToolbarGroupProps = {
	type: "single" | "multiple";
	value: Box<string> | Box<string[]>;
} & ReadonlyBoxedValues<{
	id: string;
	disabled: boolean;
}>;

export function setToolbarGroupState(props: InitToolbarGroupProps) {
	const groupState = getToolbarRootState().createGroup(props);
	return setContext(TOOLBAR_GROUP_KEY, groupState);
}

export function getToolbarGroupState(): ToolbarGroupState {
	verifyContextDeps(TOOLBAR_GROUP_KEY);
	return getContext(TOOLBAR_GROUP_KEY);
}

export function setToolbarGroupItemState(props: ToolbarGroupItemStateProps) {
	return getToolbarGroupState().createItem(props);
}

export function setToolbarButtonState(props: ToolbarButtonStateProps) {
	return getToolbarRootState().createButton(props);
}

export function setToolbarLinkState(props: ToolbarLinkStateProps) {
	return getToolbarRootState().createLink(props);
}
