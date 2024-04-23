import { getContext, setContext, untrack } from "svelte";
import {
	getAriaChecked,
	getAriaPressed,
	getAttrAndSelector,
	getDataDisabled,
	getDataOrientation,
} from "$lib/internal/attrs.js";
import {
	type Box,
	type BoxedValues,
	type ReadonlyBoxedValues,
	boxedState,
} from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import { getDirectionalKeys } from "$lib/internal/get-directional-keys.js";
import { getElemDirection } from "$lib/internal/locale.js";
import { useNodeById } from "$lib/internal/use-node-by-id.svelte.js";
import type { Orientation } from "$lib/shared/index.js";
import { verifyContextDeps } from "$lib/internal/context.js";
import {
	type UseRovingFocusReturn,
	useRovingFocus,
} from "$lib/internal/use-roving-focus.svelte.js";

const ROOT_ATTR = "toggle-group-root";
const ITEM_ATTR = "toggle-group-item";

type ToggleGroupBaseStateProps = ReadonlyBoxedValues<{
	id: string;
	disabled: boolean;
	rovingFocus: boolean;
	loop: boolean;
	orientation: Orientation;
}>;

class ToggleGroupBaseState {
	id = undefined as unknown as ToggleGroupBaseStateProps["id"];
	node: Box<HTMLElement | null>;
	disabled = undefined as unknown as ToggleGroupBaseStateProps["disabled"];
	rovingFocus = undefined as unknown as ToggleGroupBaseStateProps["rovingFocus"];
	loop = undefined as unknown as ToggleGroupBaseStateProps["loop"];
	orientation = undefined as unknown as ToggleGroupBaseStateProps["orientation"];
	rovingFocusGroup = undefined as unknown as UseRovingFocusReturn;

	constructor(props: ToggleGroupBaseStateProps) {
		this.id = props.id;
		this.node = useNodeById(this.id);
		this.disabled = props.disabled;
		this.rovingFocus = props.rovingFocus;
		this.loop = props.loop;
		this.orientation = props.orientation;
		this.rovingFocusGroup = useRovingFocus({
			candidateSelector: ITEM_ATTR,
			rootNode: this.node,
			loop: this.loop,
			orientation: this.orientation,
		});
	}

	props = $derived({
		id: this.id.value,
		[ROOT_ATTR]: "",
		role: "group",
		"data-orientation": getDataOrientation(this.orientation.value),
		"data-disabled": getDataDisabled(this.disabled.value),
	} as const);
}

//
// SINGLE
//

type ToggleGroupSingleStateProps = ToggleGroupBaseStateProps &
	BoxedValues<{
		value: string;
	}>;

class ToggleGroupSingleState extends ToggleGroupBaseState {
	#value = undefined as unknown as ToggleGroupSingleStateProps["value"];
	isMulti = false;
	anyPressed = $derived(this.#value.value !== "");

	constructor(props: ToggleGroupSingleStateProps) {
		super(props);
		this.#value = props.value;
	}

	includesItem(item: string) {
		return this.#value.value === item;
	}

	toggleItem(item: string, id: string) {
		if (this.includesItem(item)) {
			this.#value.value = "";
		} else {
			this.#value.value = item;
			this.rovingFocusGroup.setCurrentTabStopId(id);
		}
	}
}

//
// MULTIPLE
//

type ToggleGroupMultipleStateProps = ToggleGroupBaseStateProps &
	BoxedValues<{
		value: string[];
	}>;

class ToggleGroupMultipleState extends ToggleGroupBaseState {
	#value = undefined as unknown as ToggleGroupMultipleStateProps["value"];
	isMulti = true;
	anyPressed = $derived(this.#value.value.length > 0);

	constructor(props: ToggleGroupMultipleStateProps) {
		super(props);
		this.#value = props.value;
	}

	includesItem(item: string) {
		return this.#value.value.includes(item);
	}

	toggleItem(item: string, id: string) {
		if (this.includesItem(item)) {
			this.#value.value = this.#value.value.filter((v) => v !== item);
		} else {
			this.#value.value = [...this.#value.value, item];
			this.rovingFocusGroup.setCurrentTabStopId(id);
		}
	}
}

type ToggleGroupState = ToggleGroupSingleState | ToggleGroupMultipleState;

//
// ITEM
//

type ToggleGroupItemStateProps = ReadonlyBoxedValues<{
	id: string;
	value: string;
	disabled: boolean;
}> & {
	rootState: ToggleGroupState;
};

class ToggleGroupItemState {
	#id = undefined as unknown as ToggleGroupItemStateProps["id"];
	#root = undefined as unknown as ToggleGroupItemStateProps["rootState"];
	#value = undefined as unknown as ToggleGroupItemStateProps["value"];
	#node = boxedState<HTMLElement | null>(null);
	#disabled = undefined as unknown as ToggleGroupItemStateProps["disabled"];
	#isDisabled = $derived(this.#disabled.value || this.#root.disabled.value);

	constructor(props: ToggleGroupItemStateProps) {
		this.#value = props.value;
		this.#disabled = props.disabled;
		this.#root = props.rootState;
		this.#id = props.id;
		this.#node = useNodeById(this.#id);
	}

	toggleItem() {
		if (this.#isDisabled) return;
		this.#root.toggleItem(this.#value.value, this.#id.value);
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
		if (!this.#root.rovingFocus.value) return;

		this.#root.rovingFocusGroup.handleKeydown(this.#node.value, e);
	};

	#isPressed = $derived(this.#root.includesItem(this.#value.value));

	#ariaChecked = $derived.by(() => {
		return this.#root.isMulti ? undefined : getAriaChecked(this.#isPressed);
	});

	#ariaPressed = $derived.by(() => {
		return this.#root.isMulti ? undefined : getAriaPressed(this.#isPressed);
	});

	#tabIndex = $derived(
		!this.#root.rovingFocus.value
			? 0
			: this.#root.rovingFocusGroup.getTabIndex(this.#node.value).value
	);

	props = $derived({
		id: this.#id.value,
		role: this.#root.isMulti ? undefined : "radio",
		tabindex: this.#tabIndex,
		"data-orientation": getDataOrientation(this.#root.orientation.value),
		"data-disabled": getDataDisabled(this.#isDisabled),
		"data-state": getToggleItemDataState(this.#isPressed),
		"data-value": this.#value.value,
		"aria-pressed": this.#ariaPressed,
		"aria-checked": this.#ariaChecked,
		[ITEM_ATTR]: "",
		//
		onclick: this.#onclick,
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

const TOGGLE_GROUP_ROOT_KEY = Symbol("ToggleGroup.Root");

type InitToggleGroupProps = {
	type: "single" | "multiple";
	value: Box<string> | Box<string[]>;
} & ReadonlyBoxedValues<{
	id: string;
	disabled: boolean;
	rovingFocus: boolean;
	loop: boolean;
	orientation: Orientation;
}>;

export function setToggleGroupRootState(props: InitToggleGroupProps) {
	const { type, ...rest } = props;
	const rootState =
		type === "single"
			? new ToggleGroupSingleState(rest as ToggleGroupSingleStateProps)
			: new ToggleGroupMultipleState(rest as ToggleGroupMultipleStateProps);
	return setContext(TOGGLE_GROUP_ROOT_KEY, rootState);
}

export function getToggleGroupRootState(): ToggleGroupState {
	verifyContextDeps(TOGGLE_GROUP_ROOT_KEY);
	return getContext(TOGGLE_GROUP_ROOT_KEY);
}

export function setToggleGroupItemState(props: Omit<ToggleGroupItemStateProps, "rootState">) {
	const rootState = getToggleGroupRootState();
	return new ToggleGroupItemState({ ...props, rootState });
}
