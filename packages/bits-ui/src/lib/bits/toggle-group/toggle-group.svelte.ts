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
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import { RovingFocusGroup } from "$lib/internal/roving-focus-group.js";

export const toggleGroupAttrs = createBitsAttrs({
	component: "toggle-group",
	parts: ["root", "item"],
});

const ToggleGroupRootContext = new Context<ToggleGroup>("ToggleGroup.Root");

interface ToggleGroupBaseStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			rovingFocus: boolean;
			loop: boolean;
			orientation: Orientation;
		}> {}

abstract class ToggleGroupBaseState {
	readonly opts: ToggleGroupBaseStateOpts;
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly attachment: RefAttachment;

	constructor(opts: ToggleGroupBaseStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		this.rovingFocusGroup = new RovingFocusGroup({
			candidateAttr: toggleGroupAttrs.item,
			rootNode: opts.ref,
			loop: opts.loop,
			orientation: opts.orientation,
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[toggleGroupAttrs.root]: "",
				role: "group",
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				...this.attachment,
			}) as const
	);
}

interface ToggleGroupSingleStateOpts
	extends ToggleGroupBaseStateOpts,
		WritableBoxedValues<{
			value: string;
		}> {}

class ToggleGroupSingleState extends ToggleGroupBaseState {
	readonly opts: ToggleGroupSingleStateOpts;
	isMulti = false;
	readonly anyPressed = $derived.by(() => this.opts.value.current !== "");

	constructor(opts: ToggleGroupSingleStateOpts) {
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

interface ToggleGroupMultipleStateOpts
	extends ToggleGroupBaseStateOpts,
		WritableBoxedValues<{
			value: string[];
		}> {}

class ToggleGroupMultipleState extends ToggleGroupBaseState {
	readonly opts: ToggleGroupMultipleStateOpts;
	isMulti = true;
	readonly anyPressed = $derived.by(() => this.opts.value.current.length > 0);

	constructor(opts: ToggleGroupMultipleStateOpts) {
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

type ToggleGroup = ToggleGroupSingleState | ToggleGroupMultipleState;

interface ToggleGroupRootOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			rovingFocus: boolean;
			loop: boolean;
			orientation: Orientation;
		}> {
	type: "single" | "multiple";
	value: WritableBox<string> | WritableBox<string[]>;
}

export class ToggleGroupRootState {
	static create(opts: ToggleGroupRootOpts): ToggleGroup {
		const { type, ...rest } = opts;
		const rootState =
			type === "single"
				? new ToggleGroupSingleState(rest as ToggleGroupSingleStateOpts)
				: new ToggleGroupMultipleState(rest as ToggleGroupMultipleStateOpts);
		return ToggleGroupRootContext.set(rootState);
	}
}

interface ToggleGroupItemStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			value: string;
			disabled: boolean;
		}> {}

export class ToggleGroupItemState {
	static create(opts: ToggleGroupItemStateOpts) {
		return new ToggleGroupItemState(opts, ToggleGroupRootContext.get());
	}
	readonly opts: ToggleGroupItemStateOpts;
	readonly root: ToggleGroup;
	readonly attachment: RefAttachment;
	readonly #isDisabled = $derived.by(
		() => this.opts.disabled.current || this.root.opts.disabled.current
	);
	readonly isPressed = $derived.by(() => this.root.includesItem(this.opts.value.current));

	readonly #ariaChecked = $derived.by(() => {
		return this.root.isMulti ? undefined : getAriaChecked(this.isPressed, false);
	});

	readonly #ariaPressed = $derived.by(() => {
		return this.root.isMulti ? getAriaPressed(this.isPressed) : undefined;
	});

	constructor(opts: ToggleGroupItemStateOpts, root: ToggleGroup) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
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

	#tabIndex = $state(0);

	readonly snippetProps = $derived.by(() => ({
		pressed: this.isPressed,
	}));

	readonly props = $derived.by(
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
				...this.attachment,
			}) as const
	);
}

function getToggleItemDataState(condition: boolean) {
	return condition ? "on" : "off";
}
