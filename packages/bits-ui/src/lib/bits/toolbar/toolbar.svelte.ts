import {
	type WritableBox,
	type WritableBoxedValues,
	type ReadableBoxedValues,
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

export const toolbarAttrs = createBitsAttrs({
	component: "toolbar",
	parts: ["root", "item", "group", "group-item", "link", "button"],
});

const ToolbarRootContext = new Context<ToolbarRootState>("Toolbar.Root");
const ToolbarGroupContext = new Context<ToolbarGroup>("Toolbar.Group");
interface ToolbarRootStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			orientation: Orientation;
			loop: boolean;
		}> {}

export class ToolbarRootState {
	static create(opts: ToolbarRootStateOpts) {
		return ToolbarRootContext.set(new ToolbarRootState(opts));
	}
	readonly opts: ToolbarRootStateOpts;
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly attachment: RefAttachment;

	constructor(opts: ToolbarRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);

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
				...this.attachment,
			}) as const
	);
}

interface ToolbarGroupBaseStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {}

abstract class ToolbarGroupBaseState {
	readonly opts: ToolbarGroupBaseStateOpts;
	readonly root: ToolbarRootState;
	readonly attachment: RefAttachment;

	constructor(opts: ToolbarGroupBaseStateOpts, root: ToolbarRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[toolbarAttrs.group]: "",
				role: "group",
				"data-orientation": getDataOrientation(this.root.opts.orientation.current),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				...this.attachment,
			}) as const
	);
}

interface ToolbarGroupSingleStateOpts
	extends ToolbarGroupBaseStateOpts,
		WritableBoxedValues<{
			value: string;
		}> {}

class ToolbarGroupSingleState extends ToolbarGroupBaseState {
	readonly opts: ToolbarGroupSingleStateOpts;
	readonly root: ToolbarRootState;
	readonly isMulti = false as const;
	readonly anyPressed = $derived.by(() => this.opts.value.current !== "");

	constructor(opts: ToolbarGroupSingleStateOpts, root: ToolbarRootState) {
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

interface ToolbarGroupMultipleStateOpts
	extends ToolbarGroupBaseStateOpts,
		WritableBoxedValues<{
			value: string[];
		}> {}

class ToolbarGroupMultipleState extends ToolbarGroupBaseState {
	readonly opts: ToolbarGroupMultipleStateOpts;
	readonly root: ToolbarRootState;
	readonly isMulti = true as const;
	readonly anyPressed = $derived.by(() => this.opts.value.current.length > 0);

	constructor(opts: ToolbarGroupMultipleStateOpts, root: ToolbarRootState) {
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

type ToolbarGroup = ToolbarGroupSingleState | ToolbarGroupMultipleState;

interface ToolbarGroupRootOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {
	type: "single" | "multiple";
	value: WritableBox<string> | WritableBox<string[]>;
}

export class ToolbarGroupState {
	static create(opts: ToolbarGroupRootOpts): ToolbarGroup {
		const { type, ...rest } = opts;
		const rootState = ToolbarRootContext.get();
		const groupState =
			type === "single"
				? new ToolbarGroupSingleState(rest as ToolbarGroupSingleStateOpts, rootState)
				: new ToolbarGroupMultipleState(rest as ToolbarGroupMultipleStateOpts, rootState);

		return ToolbarGroupContext.set(groupState);
	}
}

//
// ITEM
//

interface ToolbarGroupItemStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			value: string;
			disabled: boolean;
		}> {}

export class ToolbarGroupItemState {
	static create(opts: ToolbarGroupItemStateOpts) {
		const group = ToolbarGroupContext.get();
		return new ToolbarGroupItemState(opts, group, group.root);
	}
	readonly opts: ToolbarGroupItemStateOpts;
	readonly group: ToolbarGroup;
	readonly root: ToolbarRootState;
	readonly attachment: RefAttachment;
	readonly #isDisabled = $derived.by(
		() => this.opts.disabled.current || this.group.opts.disabled.current
	);

	constructor(opts: ToolbarGroupItemStateOpts, group: ToolbarGroup, root: ToolbarRootState) {
		this.opts = opts;
		this.group = group;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);

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
				...this.attachment,
			}) as const
	);
}

interface ToolbarLinkStateOpts extends WithRefOpts {}

export class ToolbarLinkState {
	static create(opts: ToolbarLinkStateOpts) {
		return new ToolbarLinkState(opts, ToolbarRootContext.get());
	}
	readonly opts: ToolbarLinkStateOpts;
	readonly root: ToolbarRootState;
	readonly attachment: RefAttachment;

	constructor(opts: ToolbarLinkStateOpts, root: ToolbarRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);

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
				...this.attachment,
			}) as const
	);
}

interface ToolbarButtonStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {}

export class ToolbarButtonState {
	static create(opts: ToolbarButtonStateOpts) {
		return new ToolbarButtonState(opts, ToolbarRootContext.get());
	}
	readonly opts: ToolbarButtonStateOpts;
	readonly root: ToolbarRootState;
	readonly attachment: RefAttachment;

	constructor(opts: ToolbarButtonStateOpts, root: ToolbarRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
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
				...this.attachment,
			}) as const
	);
}

//
// HELPERS
//

function getToggleItemDataState(condition: boolean) {
	return condition ? "on" : "off";
}
