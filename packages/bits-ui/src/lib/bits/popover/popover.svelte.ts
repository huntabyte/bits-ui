import { box } from "svelte-toolbelt";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useRefById } from "$lib/internal/useNodeById.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import { getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import { createContext } from "$lib/internal/createContext.js";
import type { WithRefProps } from "$lib/internal/types.js";

type PopoverRootStateProps = WritableBoxedValues<{
	open: boolean;
}>;

class PopoverRootState {
	open: PopoverRootStateProps["open"];
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);

	constructor(props: PopoverRootStateProps) {
		this.open = props.open;
	}

	toggleOpen() {
		this.open.value = !this.open.value;
	}

	close = () => {
		if (!this.open.value) return;
		this.open.value = false;
	};

	createTrigger(props: PopoverTriggerStateProps) {
		return new PopoverTriggerState(props, this);
	}

	createContent(props: PopoverContentStateProps) {
		return new PopoverContentState(props, this);
	}

	createClose(props: PopoverCloseStateProps) {
		return new PopoverCloseState(props, this);
	}
}

type PopoverTriggerStateProps = WithRefProps;

class PopoverTriggerState {
	#id: PopoverTriggerStateProps["id"];
	#ref: PopoverTriggerStateProps["ref"];
	#root: PopoverRootState;

	constructor(props: PopoverTriggerStateProps, root: PopoverRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.triggerNode = node;
			},
		});
	}

	#onclick = () => {
		this.#root.toggleOpen();
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE)) return;
		e.preventDefault();
		this.#root.toggleOpen();
	};

	#getAriaControls() {
		if (this.#root.open.value && this.#root.contentNode?.id) {
			return this.#root.contentNode.id;
		}
		return undefined;
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				"aria-haspopup": "dialog",
				"aria-expanded": getAriaExpanded(this.#root.open.value),
				"data-state": getDataOpenClosed(this.#root.open.value),
				"aria-controls": this.#getAriaControls(),
				"data-popover-trigger": "",
				//
				onclick: this.#onclick,
				onkeydown: this.#onkeydown,
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
			condition: () => this.root.open.value,
		});
	}

	props = $derived.by(() => ({
		id: this.#id.value,
		tabindex: -1,
		"data-state": getDataOpenClosed(this.root.open.value),
		"data-popover-content": "",
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
			condition: () => this.#root.open.value,
		});
	}

	#onclick = () => {
		this.#root.close();
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE)) return;
		e.preventDefault();
		this.#root.close();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				onclick: this.#onclick,
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
	return getPopoverRootContext().createTrigger(props);
}

export function usePopoverContent(props: PopoverContentStateProps) {
	return getPopoverRootContext().createContent(props);
}

export function usePopoverClose(props: PopoverCloseStateProps) {
	return getPopoverRootContext().createClose(props);
}
