import { getContext, setContext } from "svelte";
import type { FloatingContentStateProps } from "../utilities/floating-layer/floating-layer.svelte.js";
import {
	type Box,
	type BoxedValues,
	type ReadonlyBox,
	type ReadonlyBoxedValues,
	readonlyBoxedState,
} from "$lib/internal/box.svelte.js";
import { type EventCallback, composeHandlers } from "$lib/internal/events.js";
import { useNodeById } from "$lib/internal/use-node-by-id.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import { getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import { verifyContextDeps } from "$lib/internal/context.js";

type PopoverRootStateProps = BoxedValues<{
	open: boolean;
}>;

class PopoverRootState {
	open = undefined as unknown as PopoverRootStateProps["open"];
	contentId = readonlyBoxedState<string | undefined>(undefined);

	constructor(props: PopoverRootStateProps) {
		this.open = props.open;
	}

	toggleOpen() {
		this.open.value = !this.open.value;
	}

	createTrigger(props: PopoverTriggerStateProps) {
		return new PopoverTriggerState(props, this);
	}

	createContent(props: PopoverContentStateProps) {
		return new PopoverContentState(props, this);
	}
}

type PopoverTriggerStateProps = ReadonlyBoxedValues<{
	id: string;
	onclick: EventCallback<MouseEvent>;
	onkeydown: EventCallback<KeyboardEvent>;
}>;

class PopoverTriggerState {
	id = undefined as unknown as PopoverTriggerStateProps["id"];
	root = undefined as unknown as PopoverRootState;
	node = undefined as unknown as Box<HTMLElement | null>;
	onclick = undefined as unknown as PopoverTriggerStateProps["onclick"];
	onkeydown = undefined as unknown as PopoverTriggerStateProps["onkeydown"];
	#composedClick = undefined as unknown as EventCallback<MouseEvent>;
	#composedKeydown = undefined as unknown as EventCallback<KeyboardEvent>;
	props = $derived({
		id: this.id.value,
		"aria-haspopup": "dialog",
		"aria-expanded": getAriaExpanded(this.root.open.value),
		"data-state": getDataOpenClosed(this.root.open.value),
		"aria-controls":
			this.root.open.value && this.root.contentId.value
				? this.root.contentId.value
				: undefined,
		//
		onclick: this.#composedClick,
		onkeydown: this.#composedKeydown,
	} as const);

	constructor(props: PopoverTriggerStateProps, root: PopoverRootState) {
		this.id = props.id;
		this.onclick = props.onclick;
		this.onkeydown = props.onkeydown;
		this.node = useNodeById(this.id);
		this.root = root;
		this.#composedClick = composeHandlers(props.onclick, this.#onclick);
		this.#composedKeydown = composeHandlers(props.onkeydown, this.#onkeydown);
	}

	#onclick = () => {
		this.root.toggleOpen();
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE)) return;
		this.root.toggleOpen();
	};
}

type PopoverContentStateProps = ReadonlyBoxedValues<{
	id: string;
}>;

class PopoverContentState {
	id = undefined as unknown as PopoverContentStateProps["id"];
	node = undefined as unknown as Box<HTMLElement | null>;
	root = undefined as unknown as PopoverRootState;
	props = $derived({
		id: this.id.value,
		tabindex: -1,
		hidden: !this.root.open.value ? true : undefined,
		"data-state": getDataOpenClosed(this.root.open.value),
	});

	constructor(props: PopoverContentStateProps, root: PopoverRootState) {
		this.id = props.id;
		this.node = useNodeById(this.id);
		this.root = root;
	}
}

//
// CONTEXT METHODS
//

const POPOVER_ROOT_KEY = Symbol("Popover.Root");

export function setPopoverRootState(props: PopoverRootStateProps) {
	return setContext(POPOVER_ROOT_KEY, new PopoverRootState(props));
}

export function getPopoverRootState(): PopoverRootState {
	verifyContextDeps(POPOVER_ROOT_KEY);
	return getContext(POPOVER_ROOT_KEY);
}

export function setPopoverTriggerState(props: PopoverTriggerStateProps) {
	return getPopoverRootState().createTrigger(props);
}

export function setPopoverContentState(props: PopoverContentStateProps) {
	return getPopoverRootState().createContent(props);
}
