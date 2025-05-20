import { type WritableBox, attachRef } from "svelte-toolbelt";
import { Context } from "runed";
import {
	getAriaChecked,
	getAriaPressed,
	getDataDisabled,
	getDataOrientation,
	getDisabled,
} from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	type UseRovingFocusReturn,
	useRovingFocus,
} from "$lib/internal/use-roving-focus.svelte.js";
import type { Orientation } from "$lib/shared/index.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";

const TOOLBAR_ROOT_ATTR = "data-toolbar-root";
// all links, buttons, and items must have the ITEM_ATTR for roving focus
const TOOLBAR_ITEM_ATTR = "data-toolbar-item";
const TOOLBAR_GROUP_ATTR = "data-toolbar-group";
const TOOLBAR_GROUP_ITEM_ATTR = "data-toolbar-group-item";
const TOOLBAR_LINK_ATTR = "data-toolbar-link";
const TOOLBAR_BUTTON_ATTR = "data-toolbar-button";

type ToolbarRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		orientation: Orientation;
		loop: boolean;
	}>
>;

class ToolbarRootState {
	readonly opts: ToolbarRootStateProps;
	rovingFocusGroup: UseRovingFocusReturn;

	constructor(opts: ToolbarRootStateProps) {
		this.opts = opts;

		this.rovingFocusGroup = useRovingFocus({
			orientation: this.opts.orientation,
			loop: this.opts.loop,
			rootNodeId: this.opts.id,
			candidateAttr: TOOLBAR_ITEM_ATTR,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "toolbar",
				"data-orientation": this.opts.orientation.current,
				[TOOLBAR_ROOT_ATTR]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

type ToolbarGroupBaseStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
	}>
>;

class ToolbarGroupBaseState {
	readonly opts: ToolbarGroupBaseStateProps;
	readonly root: ToolbarRootState;

	constructor(opts: ToolbarGroupBaseStateProps, root: ToolbarRootState) {
		this.opts = opts;
		this.root = root;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[TOOLBAR_GROUP_ATTR]: "",
				role: "group",
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				...attachRef(this.opts.ref),
			}) as const
	);
}

//
// SINGLE
//

type ToolbarGroupSingleStateProps = ToolbarGroupBaseStateProps &
	WritableBoxedValues<{
		value: string;
	}>;

class ToolbarGroupSingleState extends ToolbarGroupBaseState {
	readonly opts: ToolbarGroupSingleStateProps;
	readonly root: ToolbarRootState;
	isMulti = false;
	anyPressed = $derived.by(() => this.opts.value.current !== "");

	constructor(opts: ToolbarGroupSingleStateProps, root: ToolbarRootState) {
		super(opts, root);

		this.opts = opts;
		this.root = root;
	}

	includesItem(item: string) {
		return this.opts.value.current === item;
	}

	toggleItem(item: string) {
		if (this.includesItem(item)) {
			this.opts.value.current = "";
		} else {
			this.opts.value.current = item;
		}
	}
}

//
// MULTIPLE
//

type ToolbarGroupMultipleStateProps = ToolbarGroupBaseStateProps &
	WritableBoxedValues<{
		value: string[];
	}>;

class ToolbarGroupMultipleState extends ToolbarGroupBaseState {
	readonly opts: ToolbarGroupMultipleStateProps;
	readonly root: ToolbarRootState;
	isMulti = true;
	anyPressed = $derived.by(() => this.opts.value.current.length > 0);

	constructor(opts: ToolbarGroupMultipleStateProps, root: ToolbarRootState) {
		super(opts, root);

		this.opts = opts;
		this.root = root;
	}

	includesItem(item: string) {
		return this.opts.value.current.includes(item);
	}

	toggleItem(item: string) {
		if (this.includesItem(item)) {
			this.opts.value.current = this.opts.value.current.filter((v) => v !== item);
		} else {
			this.opts.value.current = [...this.opts.value.current, item];
		}
	}
}

type ToolbarGroupState = ToolbarGroupSingleState | ToolbarGroupMultipleState;

//
// ITEM
//

type ToolbarGroupItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
	}>
>;

class ToolbarGroupItemState {
	readonly opts: ToolbarGroupItemStateProps;
	readonly group: ToolbarGroupState;
	readonly root: ToolbarRootState;
	#isDisabled = $derived.by(() => this.opts.disabled.current || this.group.opts.disabled.current);

	constructor(
		opts: ToolbarGroupItemStateProps,
		group: ToolbarGroupState,
		root: ToolbarRootState
	) {
		this.opts = opts;
		this.group = group;
		this.root = root;

		$effect(() => {
			this.#tabIndex = this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current);
		});

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	#toggleItem() {
		if (this.#isDisabled) return;
		this.group.toggleItem(this.opts.value.current);
	}

	onclick(_: BitsMouseEvent) {
		if (this.#isDisabled) return;
		this.#toggleItem();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			this.#toggleItem();
			return;
		}

		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}

	isPressed = $derived.by(() => this.group.includesItem(this.opts.value.current));

	#ariaChecked = $derived.by(() => {
		return this.group.isMulti ? undefined : getAriaChecked(this.isPressed, false);
	});

	#ariaPressed = $derived.by(() => {
		return this.group.isMulti ? getAriaPressed(this.isPressed) : undefined;
	});

	#tabIndex = $state(0);

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: this.group.isMulti ? undefined : "radio",
				tabindex: this.#tabIndex,
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-state": getToggleItemDataState(this.isPressed),
				"data-value": this.opts.value.current,
				"aria-pressed": this.#ariaPressed,
				"aria-checked": this.#ariaChecked,
				[TOOLBAR_ITEM_ATTR]: "",
				[TOOLBAR_GROUP_ITEM_ATTR]: "",
				disabled: getDisabled(this.#isDisabled),
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...attachRef(this.opts.ref),
			}) as const
	);
}

type ToolbarLinkStateProps = WithRefProps;

class ToolbarLinkState {
	readonly opts: ToolbarLinkStateProps;
	readonly root: ToolbarRootState;

	constructor(opts: ToolbarLinkStateProps, root: ToolbarRootState) {
		this.opts = opts;
		this.root = root;

		$effect(() => {
			this.#tabIndex = this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current);
		});

		this.onkeydown = this.onkeydown.bind(this);
	}

	onkeydown(e: BitsKeyboardEvent) {
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}

	#role = $derived.by(() => {
		if (!this.opts.ref.current) return undefined;
		const tagName = this.opts.ref.current.tagName;
		if (tagName !== "A") return "link" as const;
		return undefined;
	});

	#tabIndex = $state(0);

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[TOOLBAR_LINK_ATTR]: "",
				[TOOLBAR_ITEM_ATTR]: "",
				role: this.#role,
				tabindex: this.#tabIndex,
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				//
				onkeydown: this.onkeydown,
				...attachRef(this.opts.ref),
			}) as const
	);
}

type ToolbarButtonStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
	}>
>;

class ToolbarButtonState {
	readonly opts: ToolbarButtonStateProps;
	readonly root: ToolbarRootState;

	constructor(opts: ToolbarButtonStateProps, root: ToolbarRootState) {
		this.opts = opts;
		this.root = root;

		$effect(() => {
			this.#tabIndex = this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current);
		});

		this.onkeydown = this.onkeydown.bind(this);
	}

	onkeydown(e: BitsKeyboardEvent) {
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}

	#tabIndex = $state(0);

	#role = $derived.by(() => {
		if (!this.opts.ref.current) return undefined;
		const tagName = this.opts.ref.current.tagName;
		if (tagName !== "BUTTON") return "button" as const;
		return undefined;
	});

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[TOOLBAR_ITEM_ATTR]: "",
				[TOOLBAR_BUTTON_ATTR]: "",
				role: this.#role,
				tabindex: this.#tabIndex,
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				disabled: getDisabled(this.opts.disabled.current),
				//
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

const ToolbarRootContext = new Context<ToolbarRootState>("Toolbar.Root");
const ToolbarGroupContext = new Context<ToolbarGroupState>("Toolbar.Group");

export function useToolbarRoot(props: ToolbarRootStateProps) {
	return ToolbarRootContext.set(new ToolbarRootState(props));
}

type InitToolbarGroupProps = WithRefProps<
	{
		type: "single" | "multiple";
		value: WritableBox<string> | WritableBox<string[]>;
	} & ReadableBoxedValues<{
		disabled: boolean;
	}>
>;

export function useToolbarGroup(props: InitToolbarGroupProps) {
	const { type, ...rest } = props;
	const rootState = ToolbarRootContext.get();
	const groupState =
		type === "single"
			? new ToolbarGroupSingleState(rest as ToolbarGroupSingleStateProps, rootState)
			: new ToolbarGroupMultipleState(rest as ToolbarGroupMultipleStateProps, rootState);

	return ToolbarGroupContext.set(groupState);
}

export function useToolbarGroupItem(props: ToolbarGroupItemStateProps) {
	const group = ToolbarGroupContext.get();
	return new ToolbarGroupItemState(props, group, group.root);
}

export function useToolbarButton(props: ToolbarButtonStateProps) {
	return new ToolbarButtonState(props, ToolbarRootContext.get());
}

export function useToolbarLink(props: ToolbarLinkStateProps) {
	return new ToolbarLinkState(props, ToolbarRootContext.get());
}
