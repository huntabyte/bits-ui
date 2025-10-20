import {
	type ReadableBoxedValues,
	type WritableBoxedValues,
	attachRef,
	boxWith,
} from "svelte-toolbelt";
import { Context } from "runed";
import { kbd } from "$lib/internal/kbd.js";
import { createBitsAttrs, boolToStr, getDataOpenClosed } from "$lib/internal/attrs.js";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	OnChangeFn,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import { isElement } from "$lib/internal/is.js";
import type { Measurable } from "$lib/internal/floating-svelte/types.js";
import { PresenceManager } from "$lib/internal/presence-manager.svelte.js";

const popoverAttrs = createBitsAttrs({
	component: "popover",
	parts: ["root", "trigger", "content", "close", "overlay"],
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
	contentPresence: PresenceManager;
	triggerNode = $state<HTMLElement | null>(null);
	overlayNode = $state<HTMLElement | null>(null);
	overlayPresence: PresenceManager;

	constructor(opts: PopoverRootStateOpts) {
		this.opts = opts;

		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
		});

		this.overlayPresence = new PresenceManager({
			ref: boxWith(() => this.overlayNode),
			open: this.opts.open,
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
				"aria-expanded": boolToStr(this.root.opts.open.current),
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
			customAnchor: string | HTMLElement | null | Measurable;
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
		if (closestTrigger && closestTrigger === this.root.triggerNode) return;
		if (this.opts.customAnchor.current) {
			if (isElement(this.opts.customAnchor.current)) {
				if (this.opts.customAnchor.current.contains(e.target)) return;
			} else if (typeof this.opts.customAnchor.current === "string") {
				const el = document.querySelector(this.opts.customAnchor.current);
				if (el && el.contains(e.target)) return;
			}
		}
		this.root.handleClose();
	};

	onEscapeKeydown = (e: KeyboardEvent) => {
		this.opts.onEscapeKeydown.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};

	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}

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

interface PopoverOverlayStateOpts extends WithRefOpts {}

export class PopoverOverlayState {
	static create(opts: PopoverOverlayStateOpts) {
		return new PopoverOverlayState(opts, PopoverRootContext.get());
	}

	readonly opts: PopoverOverlayStateOpts;
	readonly root: PopoverRootState;
	readonly attachment: RefAttachment;

	constructor(opts: PopoverOverlayStateOpts, root: PopoverRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.overlayNode = v));
	}

	get shouldRender() {
		return this.root.overlayPresence.shouldRender;
	}

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[popoverAttrs.overlay]: "",
				style: {
					pointerEvents: "auto",
				},
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				...this.attachment,
			}) as const
	);
}
