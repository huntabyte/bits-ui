import {
	type BoxedValues,
	type ReadonlyBoxedValues,
	boxedState,
	readonlyBoxedState,
} from "$lib/internal/box.svelte.js";
import { useNodeById } from "$lib/internal/useNodeById.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import { getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import { createContext } from "$lib/internal/createContext.js";

type PopoverRootStateProps = BoxedValues<{
	open: boolean;
}>;

class PopoverRootState {
	open = undefined as unknown as PopoverRootStateProps["open"];
	contentId = readonlyBoxedState<string | undefined>(undefined);
	triggerNode = boxedState<HTMLElement | null>(null);

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

	createClose() {
		return new PopoverCloseState(this);
	}
}

type PopoverTriggerStateProps = ReadonlyBoxedValues<{
	id: string;
}>;

class PopoverTriggerState {
	#id = undefined as unknown as PopoverTriggerStateProps["id"];
	#root = undefined as unknown as PopoverRootState;

	constructor(props: PopoverTriggerStateProps, root: PopoverRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#root.triggerNode = useNodeById(this.#id);
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
		if (this.#root.open.value && this.#root.contentId.value) {
			return this.#root.contentId.value;
		}
		return undefined;
	}

	props = $derived({
		id: this.#id.value,
		"aria-haspopup": "dialog",
		"aria-expanded": getAriaExpanded(this.#root.open.value),
		"data-state": getDataOpenClosed(this.#root.open.value),
		"aria-controls": this.#getAriaControls(),
		"data-popover-trigger": "",
		//
		onclick: this.#onclick,
		onkeydown: this.#onkeydown,
	} as const);
}

type PopoverContentStateProps = ReadonlyBoxedValues<{
	id: string;
}>;

class PopoverContentState {
	#id = undefined as unknown as PopoverContentStateProps["id"];
	root = undefined as unknown as PopoverRootState;

	constructor(props: PopoverContentStateProps, root: PopoverRootState) {
		this.#id = props.id;
		this.root = root;
	}

	props = $derived({
		id: this.#id.value,
		tabindex: -1,
		"data-state": getDataOpenClosed(this.root.open.value),
		"data-popover-content": "",
	});
}

class PopoverCloseState {
	#root = undefined as unknown as PopoverRootState;

	constructor(root: PopoverRootState) {
		this.#root = root;
	}

	#onclick = () => {
		this.#root.close();
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE)) return;
		e.preventDefault();
		this.#root.close();
	};

	props = $derived({
		onclick: this.#onclick,
		onkeydown: this.#onkeydown,
		type: "button",
		"data-popover-close": "",
	} as const);
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

export function usePopoverClose() {
	return getPopoverRootContext().createClose();
}
