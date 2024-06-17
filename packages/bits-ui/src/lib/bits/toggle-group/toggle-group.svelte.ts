import { type WritableBox, box } from "svelte-toolbelt";
import {
	getAriaChecked,
	getAriaPressed,
	getDataDisabled,
	getDataOrientation,
	getDisabledAttr,
} from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import { useRefById } from "$lib/internal/useNodeById.svelte.js";
import type { Orientation } from "$lib/shared/index.js";
import { type UseRovingFocusReturn, useRovingFocus } from "$lib/internal/useRovingFocus.svelte.js";
import { createContext } from "$lib/internal/createContext.js";
import type { WithRefProps } from "$lib/internal/types.js";

const ROOT_ATTR = "data-toggle-group-root";
const ITEM_ATTR = "data-toggle-group-item";

type ToggleGroupBaseStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		rovingFocus: boolean;
		loop: boolean;
		orientation: Orientation;
	}>
>;

class ToggleGroupBaseState {
	id: ToggleGroupBaseStateProps["id"];
	ref: ToggleGroupBaseStateProps["ref"];
	disabled: ToggleGroupBaseStateProps["disabled"];
	rovingFocus: ToggleGroupBaseStateProps["rovingFocus"];
	loop: ToggleGroupBaseStateProps["loop"];
	orientation: ToggleGroupBaseStateProps["orientation"];
	rovingFocusGroup: UseRovingFocusReturn;

	constructor(props: ToggleGroupBaseStateProps) {
		this.id = props.id;
		this.ref = props.ref;
		this.disabled = props.disabled;
		this.rovingFocus = props.rovingFocus;
		this.loop = props.loop;
		this.orientation = props.orientation;
		this.rovingFocusGroup = useRovingFocus({
			candidateSelector: ITEM_ATTR,
			rootNodeId: this.id,
			loop: this.loop,
			orientation: this.orientation,
		});

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				[ROOT_ATTR]: "",
				role: "group",
				"data-orientation": getDataOrientation(this.orientation.value),
				"data-disabled": getDataDisabled(this.disabled.value),
			}) as const
	);
}

//
// SINGLE
//

type ToggleGroupSingleStateProps = ToggleGroupBaseStateProps &
	WritableBoxedValues<{
		value: string;
	}>;

class ToggleGroupSingleState extends ToggleGroupBaseState {
	#value: ToggleGroupSingleStateProps["value"];
	isMulti = false;
	anyPressed = $derived.by(() => this.#value.value !== "");

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
	WritableBoxedValues<{
		value: string[];
	}>;

class ToggleGroupMultipleState extends ToggleGroupBaseState {
	#value: ToggleGroupMultipleStateProps["value"];
	isMulti = true;
	anyPressed = $derived.by(() => this.#value.value.length > 0);

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

type ToggleGroupItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
	}> & {
		rootState: ToggleGroupState;
	}
>;

class ToggleGroupItemState {
	#id: ToggleGroupItemStateProps["id"];
	#ref: ToggleGroupItemStateProps["ref"];
	#root: ToggleGroupItemStateProps["rootState"];
	#value: ToggleGroupItemStateProps["value"];
	#disabled: ToggleGroupItemStateProps["disabled"];
	#isDisabled = $derived.by(() => this.#disabled.value || this.#root.disabled.value);

	constructor(props: ToggleGroupItemStateProps) {
		this.#value = props.value;
		this.#disabled = props.disabled;
		this.#root = props.rootState;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
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

		this.#root.rovingFocusGroup.handleKeydown(this.#ref.value, e);
	};

	#isPressed = $derived.by(() => this.#root.includesItem(this.#value.value));

	#ariaChecked = $derived.by(() => {
		return this.#root.isMulti ? undefined : getAriaChecked(this.#isPressed);
	});

	#ariaPressed = $derived.by(() => {
		return this.#root.isMulti ? getAriaPressed(this.#isPressed) : undefined;
	});

	#tabIndex = $derived.by(() =>
		!this.#root.rovingFocus.value ? 0 : this.#root.rovingFocusGroup.getTabIndex(this.#ref.value)
	);

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				role: this.#root.isMulti ? undefined : "radio",
				tabindex: this.#tabIndex,
				"data-orientation": getDataOrientation(this.#root.orientation.value),
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-state": getToggleItemDataState(this.#isPressed),
				"data-value": this.#value.value,
				"aria-pressed": this.#ariaPressed,
				"aria-checked": this.#ariaChecked,
				disabled: getDisabledAttr(this.#isDisabled),
				[ITEM_ATTR]: "",
				//
				onclick: this.#onclick,
				onkeydown: this.#onkeydown,
			}) as const
	);
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

const [setToggleGroupRootContext, getToggleGroupRootContext] =
	createContext<ToggleGroupState>("ToggleGroup.Root");

type InitToggleGroupProps = WithRefProps<
	{
		type: "single" | "multiple";
		value: WritableBox<string> | WritableBox<string[]>;
	} & ReadableBoxedValues<{
		disabled: boolean;
		rovingFocus: boolean;
		loop: boolean;
		orientation: Orientation;
	}>
>;

export function useToggleGroupRoot(props: InitToggleGroupProps) {
	const { type, ...rest } = props;
	const rootState =
		type === "single"
			? new ToggleGroupSingleState(rest as ToggleGroupSingleStateProps)
			: new ToggleGroupMultipleState(rest as ToggleGroupMultipleStateProps);
	return setToggleGroupRootContext(rootState);
}

export function useToggleGroupItem(props: Omit<ToggleGroupItemStateProps, "rootState">) {
	const rootState = getToggleGroupRootContext();
	return new ToggleGroupItemState({ ...props, rootState });
}
