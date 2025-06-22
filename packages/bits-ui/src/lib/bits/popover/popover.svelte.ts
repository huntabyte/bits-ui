import {
	type ReadableBoxedValues,
	type WritableBoxedValues,
	attachRef,
	box,
} from "svelte-toolbelt";
import { Context } from "runed";
import { kbd } from "$lib/internal/kbd.js";
import { createBitsAttrs, getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	OnChangeFn,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import { isElement } from "$lib/internal/is.js";
import { OpenChangeComplete } from "$lib/internal/open-change-complete.js";

const popoverAttrs = createBitsAttrs({
	component: "popover",
	parts: ["root", "trigger", "content", "close"],
});

const PopoverRootContext = new Context<PopoverRootState>("Popover.Root");

interface PopoverRootStateOpts
	extends WritableBoxedValues<{
			open: boolean;
		}>,
		ReadableBoxedValues<{
			onOpenChangeComplete: OnChangeFn<boolean>;
		}> {}

export class PopoverRootState {
	static create(opts: PopoverRootStateOpts) {
		return PopoverRootContext.set(new PopoverRootState(opts));
	}

	readonly opts: PopoverRootStateOpts;
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);

	constructor(opts: PopoverRootStateOpts) {
		this.opts = opts;

		new OpenChangeComplete({
			ref: box.with(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
		});
	}

	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}

	handleClose() {
		if (!this.opts.open.current) return;
		this.opts.open.current = false;
	}
}

interface PopoverTriggerStateOpts extends WithRefOpts, ReadableBoxedValues<{ disabled: boolean }> {}

export class PopoverTriggerState {
	static create(opts: PopoverTriggerStateOpts) {
		return new PopoverTriggerState(opts, PopoverRootContext.get());
	}

	readonly opts: PopoverTriggerStateOpts;
	readonly root: PopoverRootState;
	readonly attachment: RefAttachment;

	constructor(opts: PopoverTriggerStateOpts, root: PopoverRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.triggerNode = v));

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		if (e.button !== 0) return;
		this.root.toggleOpen();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.opts.disabled.current) return;
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE)) return;
		e.preventDefault();
		this.root.toggleOpen();
	}

	#getAriaControls() {
		if (this.root.opts.open.current && this.root.contentNode?.id) {
			return this.root.contentNode?.id;
		}
		return undefined;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-haspopup": "dialog",
				"aria-expanded": getAriaExpanded(this.root.opts.open.current),
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				"aria-controls": this.#getAriaControls(),
				[popoverAttrs.trigger]: "",
				disabled: this.opts.disabled.current,
				//
				onkeydown: this.onkeydown,
				onclick: this.onclick,
				...this.attachment,
			}) as const
	);
}

interface PopoverContentStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			onInteractOutside: (e: PointerEvent) => void;
			onEscapeKeydown: (e: KeyboardEvent) => void;
			onCloseAutoFocus: (e: Event) => void;
		}> {}

export class PopoverContentState {
	static create(opts: PopoverContentStateOpts) {
		return new PopoverContentState(opts, PopoverRootContext.get());
	}

	readonly opts: PopoverContentStateOpts;
	readonly root: PopoverRootState;
	readonly attachment: RefAttachment;

	constructor(opts: PopoverContentStateOpts, root: PopoverRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.contentNode = v));
	}

	onInteractOutside = (e: PointerEvent) => {
		this.opts.onInteractOutside.current(e);
		if (e.defaultPrevented) return;
		if (!isElement(e.target)) return;

		const closestTrigger = e.target.closest(popoverAttrs.selector("trigger"));
		if (closestTrigger === this.root.triggerNode) return;
		this.root.handleClose();
	};

	onEscapeKeydown = (e: KeyboardEvent) => {
		this.opts.onEscapeKeydown.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};

	onCloseAutoFocus = (e: Event) => {
		this.opts.onCloseAutoFocus.current(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
		this.root.triggerNode?.focus();
	};

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				tabindex: -1,
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				[popoverAttrs.content]: "",
				style: {
					pointerEvents: "auto",
				},
				...this.attachment,
			}) as const
	);

	readonly popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onCloseAutoFocus: this.onCloseAutoFocus,
	};
}

interface PopoverCloseStateOpts extends WithRefOpts {}

export class PopoverCloseState {
	static create(opts: PopoverCloseStateOpts) {
		return new PopoverCloseState(opts, PopoverRootContext.get());
	}

	readonly opts: PopoverCloseStateOpts;
	readonly root: PopoverRootState;
	readonly attachment: RefAttachment;

	constructor(opts: PopoverCloseStateOpts, root: PopoverRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(_: BitsPointerEvent) {
		this.root.handleClose();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE)) return;
		e.preventDefault();
		this.root.handleClose();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				type: "button",
				[popoverAttrs.close]: "",
				...this.attachment,
			}) as const
	);
}
