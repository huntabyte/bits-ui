import { type WritableBox, attachRef } from "svelte-toolbelt";
import { Context } from "runed";
import {
	createBitsAttrs,
	getAriaChecked,
	getAriaPressed,
	getDataDisabled,
	getDataOrientation,
	getDisabled,
} from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import type { Orientation } from "$lib/shared/index.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";
import { RovingFocusGroup } from "$lib/internal/roving-focus-group.svelte.js";

export const toolbarAttrs = createBitsAttrs({
	component: "toolbar",
	parts: ["root", "item", "group", "group-item", "link", "button"],
});

type ToolbarRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		orientation: Orientation;
		loop: boolean;
	}>
>;

class ToolbarRootState {
	readonly opts: ToolbarRootStateProps;
	rovingFocusGroup: RovingFocusGroup;

	constructor(opts: ToolbarRootStateProps) {
		this.opts = opts;

		this.rovingFocusGroup = new RovingFocusGroup({
			orientation: this.opts.orientation,
			loop: this.opts.loop,
			rootNode: this.opts.ref,
			candidateAttr: toolbarAttrs.item,
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "toolbar",
				"data-orientation": this.opts.orientation.current,
				[toolbarAttrs.root]: "",
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

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[toolbarAttrs.group]: "",
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
	readonly isMulti = false as const;
	readonly anyPressed = $derived.by(() => this.opts.value.current !== "");

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
	readonly isMulti = true as const;
	readonly anyPressed = $derived.by(() => this.opts.value.current.length > 0);

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
	readonly #isDisabled = $derived.by(
		() => this.opts.disabled.current || this.group.opts.disabled.current
	);

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

	readonly isPressed = $derived.by(() => this.group.includesItem(this.opts.value.current));

	readonly #ariaChecked = $derived.by(() => {
		return this.group.isMulti ? undefined : getAriaChecked(this.isPressed, false);
	});

	readonly #ariaPressed = $derived.by(() => {
		return this.group.isMulti ? getAriaPressed(this.isPressed) : undefined;
	});

	#tabIndex = $state(0);

	readonly props = $derived.by(
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
				[toolbarAttrs.item]: "",
				[toolbarAttrs["group-item"]]: "",
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

	readonly #role = $derived.by(() => {
		if (!this.opts.ref.current) return undefined;
		const tagName = this.opts.ref.current.tagName;
		if (tagName !== "A") return "link" as const;
		return undefined;
	});

	#tabIndex = $state(0);

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[toolbarAttrs.link]: "",
				[toolbarAttrs.item]: "",
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

	readonly #role = $derived.by(() => {
		if (!this.opts.ref.current) return undefined;
		const tagName = this.opts.ref.current.tagName;
		if (tagName !== "BUTTON") return "button" as const;
		return undefined;
	});

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[toolbarAttrs.item]: "",
				[toolbarAttrs.button]: "",
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
