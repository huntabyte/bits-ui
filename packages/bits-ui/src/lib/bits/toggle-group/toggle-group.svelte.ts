import {
	type WritableBox,
	type ReadableBoxedValues,
	type WritableBoxedValues,
	attachRef,
} from "svelte-toolbelt";
import { Context } from "runed";
import {
	createBitsAttrs,
	getAriaChecked,
	getAriaPressed,
	getDataDisabled,
	getDataOrientation,
	getDisabled,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import type { Orientation } from "$lib/shared/index.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";
import { RovingFocusGroup } from "$lib/internal/roving-focus-group.svelte.js";

export const toggleGroupAttrs = createBitsAttrs({
	component: "toggle-group",
	parts: ["root", "item"],
});

type ToggleGroupBaseStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		rovingFocus: boolean;
		loop: boolean;
		orientation: Orientation;
	}>
>;

class ToggleGroupBaseState {
	readonly opts: ToggleGroupBaseStateProps;
	rovingFocusGroup: RovingFocusGroup;

	constructor(opts: ToggleGroupBaseStateProps) {
		this.opts = opts;
		this.rovingFocusGroup = new RovingFocusGroup({
			candidateAttr: toggleGroupAttrs.item,
			rootNode: opts.ref,
			loop: opts.loop,
			orientation: opts.orientation,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[toggleGroupAttrs.root]: "",
				role: "group",
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				...attachRef(this.opts.ref),
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
	readonly opts: ToggleGroupSingleStateProps;
	isMulti = false;
	anyPressed = $derived.by(() => this.opts.value.current !== "");

	constructor(opts: ToggleGroupSingleStateProps) {
		super(opts);
		this.opts = opts;
	}

	includesItem(item: string) {
		return this.opts.value.current === item;
	}

	toggleItem(item: string, id: string) {
		if (this.includesItem(item)) {
			this.opts.value.current = "";
		} else {
			this.opts.value.current = item;
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
	readonly opts: ToggleGroupMultipleStateProps;
	isMulti = true;
	anyPressed = $derived.by(() => this.opts.value.current.length > 0);

	constructor(opts: ToggleGroupMultipleStateProps) {
		super(opts);

		this.opts = opts;
	}

	includesItem(item: string) {
		return this.opts.value.current.includes(item);
	}

	toggleItem(item: string, id: string) {
		if (this.includesItem(item)) {
			this.opts.value.current = this.opts.value.current.filter((v) => v !== item);
		} else {
			this.opts.value.current = [...this.opts.value.current, item];
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
	}>
>;

class ToggleGroupItemState {
	readonly opts: ToggleGroupItemStateProps;
	readonly root: ToggleGroupState;
	#isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);

	constructor(opts: ToggleGroupItemStateProps, root: ToggleGroupState) {
		this.opts = opts;
		this.root = root;

		$effect(() => {
			if (!this.root.opts.rovingFocus.current) {
				this.#tabIndex = 0;
			} else {
				this.#tabIndex = this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current);
			}
		});

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#toggleItem() {
		if (this.#isDisabled) return;
		this.root.toggleItem(this.opts.value.current, this.opts.id.current);
	}

	onclick(_: BitsMouseEvent) {
		if (this.#isDisabled) return;
		this.root.toggleItem(this.opts.value.current, this.opts.id.current);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			this.#toggleItem();
			return;
		}
		if (!this.root.opts.rovingFocus.current) return;

		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}

	isPressed = $derived.by(() => this.root.includesItem(this.opts.value.current));

	#ariaChecked = $derived.by(() => {
		return this.root.isMulti ? undefined : getAriaChecked(this.isPressed, false);
	});

	#ariaPressed = $derived.by(() => {
		return this.root.isMulti ? getAriaPressed(this.isPressed) : undefined;
	});

	#tabIndex = $state(0);

	snippetProps = $derived.by(() => ({
		pressed: this.isPressed,
	}));

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: this.root.isMulti ? undefined : "radio",
				tabindex: this.#tabIndex,
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-state": getToggleItemDataState(this.isPressed),
				"data-value": this.opts.value.current,
				"aria-pressed": this.#ariaPressed,
				"aria-checked": this.#ariaChecked,
				disabled: getDisabled(this.#isDisabled),
				[toggleGroupAttrs.item]: "",
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...attachRef(this.opts.ref),
			}) as const
	);
}

//
// HELPERS
//

function getToggleItemDataState(condition: boolean) {
	return condition ? "on" : "off";
}

const ToggleGroupRootContext = new Context<ToggleGroupState>("ToggleGroup.Root");

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
	return ToggleGroupRootContext.set(rootState);
}

export function useToggleGroupItem(props: Omit<ToggleGroupItemStateProps, "rootState">) {
	return new ToggleGroupItemState(props, ToggleGroupRootContext.get());
}
