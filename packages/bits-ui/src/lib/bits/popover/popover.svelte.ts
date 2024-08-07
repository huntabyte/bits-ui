import type { WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
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

	createTrigger = (props: PopoverTriggerStateProps) => {
		return new PopoverTriggerState(props, this);
	};

	createContent = (props: PopoverContentStateProps) => {
		return new PopoverContentState(props, this);
	};

	createClose = (props: PopoverCloseStateProps) => {
		return new PopoverCloseState(props, this);
	};
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
			condition: () => this.root.open.current,
			onRefChange: (node) => {
				this.root.contentNode = node;
				this.root.contentId = node?.id;
			},
		});
	}

	props = $derived.by(() => ({
		id: this.#id.current,
		tabindex: -1,
		"data-state": getDataOpenClosed(this.root.open.current),
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
			condition: () => this.#root.open.current,
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
				id: this.#id.current,
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
