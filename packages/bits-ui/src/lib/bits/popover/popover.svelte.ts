import { type ReadableBoxedValues, afterSleep, afterTick, useRefById } from "svelte-toolbelt";
import type { WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import { getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import { createContext } from "$lib/internal/create-context.js";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	WithRefProps,
} from "$lib/internal/types.js";

type PopoverRootStateProps = WritableBoxedValues<{
	open: boolean;
}>;

class PopoverRootState {
	open: PopoverRootStateProps["open"];
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	contentId = $derived(this.contentNode?.id);

	constructor(props: PopoverRootStateProps) {
		this.open = props.open;
	}

	toggleOpen() {
		this.open.current = !this.open.current;
	}

	handleClose() {
		if (!this.open.current) return;
		this.open.current = false;
	}
}

type PopoverTriggerStateProps = WithRefProps & ReadableBoxedValues<{ disabled: boolean }>;

class PopoverTriggerState {
	#id: PopoverTriggerStateProps["id"];
	#ref: PopoverTriggerStateProps["ref"];
	#disabled: PopoverTriggerStateProps["disabled"];
	#root: PopoverRootState;

	constructor(props: PopoverTriggerStateProps, root: PopoverRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#ref = props.ref;
		this.#disabled = props.disabled;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.triggerNode = node;
			},
		});

		this.onclick = this.onclick.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.#disabled.current) return;
		if (e.button !== 0) return;
		this.#root.toggleOpen();
	}

	onpointerdown(e: BitsPointerEvent) {
		if (this.#disabled.current) return;
		if (e.button !== 0) return;
		// We prevent default to prevent focus from moving to the trigger
		// since this action will open the popover and focus will move to the content
		e.preventDefault();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#disabled.current) return;
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE)) return;
		e.preventDefault();
		this.#root.toggleOpen();
	}

	#getAriaControls() {
		if (this.#root.open.current && this.#root.contentId) {
			return this.#root.contentId;
		}
		return undefined;
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"aria-haspopup": "dialog",
				"aria-expanded": getAriaExpanded(this.#root.open.current),
				"data-state": getDataOpenClosed(this.#root.open.current),
				"aria-controls": this.#getAriaControls(),
				"data-popover-trigger": "",
				disabled: this.#disabled.current,
				//
				onpointerdown: this.onpointerdown,
				onkeydown: this.onkeydown,
				onclick: this.onclick,
			}) as const
	);
}

type PopoverContentStateProps = WithRefProps;
class PopoverContentState {
	#id: PopoverContentStateProps["id"];
	#ref: PopoverContentStateProps["ref"];
	root: PopoverRootState;

	constructor(props: PopoverContentStateProps, root: PopoverRootState) {
		this.#id = props.id;
		this.root = root;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			deps: () => this.root.open.current,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
		});
	}

	snippetProps = $derived.by(() => ({ open: this.root.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				tabindex: -1,
				"data-state": getDataOpenClosed(this.root.open.current),
				"data-popover-content": "",
				style: {
					pointerEvents: "auto",
				},
			}) as const
	);
}

type PopoverCloseStateProps = WithRefProps;

class PopoverCloseState {
	#id: PopoverCloseStateProps["id"];
	#ref: PopoverCloseStateProps["ref"];
	#root: PopoverRootState;

	constructor(props: PopoverCloseStateProps, root: PopoverRootState) {
		this.#root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			deps: () => this.#root.open.current,
		});
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(_: BitsPointerEvent) {
		this.#root.handleClose();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE)) return;
		e.preventDefault();
		this.#root.handleClose();
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				type: "button",
				"data-popover-close": "",
			}) as const
	);
}

//
// CONTEXT METHODS
//

const [setPopoverRootContext, getPopoverRootContext] =
	createContext<PopoverRootState>("Popover.Root");

export function usePopoverRoot(props: PopoverRootStateProps) {
	return setPopoverRootContext(new PopoverRootState(props));
}

export function usePopoverTrigger(props: PopoverTriggerStateProps) {
	return new PopoverTriggerState(props, getPopoverRootContext());
}

export function usePopoverContent(props: PopoverContentStateProps) {
	return new PopoverContentState(props, getPopoverRootContext());
}

export function usePopoverClose(props: PopoverCloseStateProps) {
	return new PopoverCloseState(props, getPopoverRootContext());
}
