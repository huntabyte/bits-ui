import { type ReadableBoxedValues, attachRef } from "svelte-toolbelt";
import { Context } from "runed";
import type { WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import { createBitsAttrs, getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	WithRefProps,
} from "$lib/internal/types.js";
import { isElement } from "$lib/internal/is.js";

const popoverAttrs = createBitsAttrs({
	component: "popover",
	parts: ["root", "trigger", "content", "close"],
});

type PopoverRootStateProps = WritableBoxedValues<{
	open: boolean;
}>;

class PopoverRootState {
	readonly opts: PopoverRootStateProps;
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);

	constructor(opts: PopoverRootStateProps) {
		this.opts = opts;
	}

	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}

	handleClose() {
		if (!this.opts.open.current) return;
		this.opts.open.current = false;
	}
}

type PopoverTriggerStateProps = WithRefProps & ReadableBoxedValues<{ disabled: boolean }>;

class PopoverTriggerState {
	readonly opts: PopoverTriggerStateProps;
	readonly root: PopoverRootState;

	constructor(opts: PopoverTriggerStateProps, root: PopoverRootState) {
		this.opts = opts;
		this.root = root;

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

	props = $derived.by(
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
				...attachRef(this.opts.ref, (v) => (this.root.triggerNode = v)),
			}) as const
	);
}

type PopoverContentStateProps = WithRefProps &
	ReadableBoxedValues<{
		onInteractOutside: (e: PointerEvent) => void;
		onEscapeKeydown: (e: KeyboardEvent) => void;
		onCloseAutoFocus: (e: Event) => void;
	}>;
class PopoverContentState {
	readonly opts: PopoverContentStateProps;
	readonly root: PopoverRootState;

	constructor(opts: PopoverContentStateProps, root: PopoverRootState) {
		this.opts = opts;
		this.root = root;
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

	snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				tabindex: -1,
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				[popoverAttrs.content]: "",
				style: {
					pointerEvents: "auto",
				},
				...attachRef(this.opts.ref, (v) => (this.root.contentNode = v)),
			}) as const
	);

	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onCloseAutoFocus: this.onCloseAutoFocus,
	};
}

type PopoverCloseStateProps = WithRefProps;

class PopoverCloseState {
	readonly opts: PopoverCloseStateProps;
	readonly root: PopoverRootState;

	constructor(opts: PopoverCloseStateProps, root: PopoverRootState) {
		this.opts = opts;
		this.root = root;

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

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				type: "button",
				[popoverAttrs.close]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

//
// CONTEXT METHODS
//
const PopoverRootContext = new Context<PopoverRootState>("Popover.Root");

export function usePopoverRoot(props: PopoverRootStateProps) {
	return PopoverRootContext.set(new PopoverRootState(props));
}

export function usePopoverTrigger(props: PopoverTriggerStateProps) {
	return new PopoverTriggerState(props, PopoverRootContext.get());
}

export function usePopoverContent(props: PopoverContentStateProps) {
	return new PopoverContentState(props, PopoverRootContext.get());
}

export function usePopoverClose(props: PopoverCloseStateProps) {
	return new PopoverCloseState(props, PopoverRootContext.get());
}
