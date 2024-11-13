import { type ReadableBoxedValues, useRefById } from "svelte-toolbelt";
import type { WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import { getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import { createContext } from "$lib/internal/create-context.js";
import type { WithRefProps } from "$lib/internal/types.js";

type PopoverRootStateProps = WritableBoxedValues<{
	open: boolean;
}>;

class PopoverRootState {
	open: PopoverRootStateProps["open"];
	contentNode = $state<HTMLElement | null>(null);
	contentId = $state<string | undefined>(undefined);
	triggerNode = $state<HTMLElement | null>(null);

	constructor(props: PopoverRootStateProps) {
		this.open = props.open;
	}

	toggleOpen = () => {
		this.open.current = !this.open.current;
	};

	close = () => {
		if (!this.open.current) return;
		this.open.current = false;
	};
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
	}

	#onpointerdown = (e: PointerEvent) => {
		if (this.#disabled.current) return;
		if (e.pointerType === "touch" || e.button !== 0) return e.preventDefault();
		this.#root.toggleOpen();
	};

	#onpointerup = (e: PointerEvent) => {
		if (this.#disabled.current) return;
		if (e.pointerType === "touch") {
			e.preventDefault();
			this.#root.toggleOpen();
		}
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (this.#disabled.current) return;
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE)) return;
		e.preventDefault();
		this.#root.toggleOpen();
	};

	#getAriaControls = () => {
		if (this.#root.open.current && this.#root.contentId) {
			return this.#root.contentId;
		}
		return undefined;
	};

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
				onpointerdown: this.#onpointerdown,
				onkeydown: this.#onkeydown,
				onpointerup: this.#onpointerup,
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
				this.root.contentId = node?.id;
			},
		});
	}

	snippetProps = $derived.by(() => ({ open: this.root.open.current }));

	props = $derived.by(() => ({
		id: this.#id.current,
		tabindex: -1,
		"data-state": getDataOpenClosed(this.root.open.current),
		"data-popover-content": "",
		style: {
			pointerEvents: "auto",
		},
	}));
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
	}

	#onpointerdown = (e: PointerEvent) => {
		if (e.pointerType === "touch") return e.preventDefault();
		this.#root.close();
	};

	#onpointerup = (e: PointerEvent) => {
		e.preventDefault();
		if (e.pointerType === "touch") {
			this.#root.close();
		}
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE)) return;
		e.preventDefault();
		this.#root.close();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				onclick: this.#onpointerdown,
				onkeydown: this.#onkeydown,
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
