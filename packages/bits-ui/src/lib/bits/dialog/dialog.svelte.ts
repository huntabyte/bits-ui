import { box } from "runed";
import { getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useNodeById } from "$lib/internal/useNodeById.svelte.js";
import { createContext } from "$lib/internal/createContext.js";

const CONTENT_ATTR = "data-dialog-content";
const TITLE_ATTR = "data-dialog-title";
const TRIGGER_ATTR = "data-dialog-trigger";
const OVERLAY_ATTR = "data-dialog-overlay";
const DESCRIPTION_ATTR = "data-dialog-description";
const CLOSE_ATTR = "data-dialog-close";

type DialogRootStateProps = WritableBoxedValues<{
	open: boolean;
}>;

class DialogRootState {
	open = undefined as unknown as DialogRootStateProps["open"];
	triggerNode = box<HTMLElement | null>(null);
	titleNode = box<HTMLElement | null>(null);
	contentNode = box<HTMLElement | null>(null);
	contentId = $derived(this.contentNode.value ? this.contentNode.value.id : undefined);
	titleId = $derived(this.titleNode.value ? this.titleNode.value.id : undefined);
	triggerId = $derived(this.triggerNode.value ? this.triggerNode.value.id : undefined);
	descriptionNode = box<HTMLElement | null>(null);
	descriptionId = $derived(
		this.descriptionNode.value ? this.descriptionNode.value.id : undefined
	);

	constructor(props: DialogRootStateProps) {
		this.open = props.open;
	}

	openDialog() {
		if (this.open.value) return;
		this.open.value = true;
	}

	closeDialog() {
		if (!this.open.value) return;
		this.open.value = false;
	}

	createTrigger(props: DialogTriggerStateProps) {
		return new DialogTriggerState(props, this);
	}

	createTitle(props: DialogTitleStateProps) {
		return new DialogTitleState(props, this);
	}

	createContent(props: DialogContentStateProps) {
		return new DialogContentState(props, this);
	}

	createOverlay(props: DialogOverlayStateProps) {
		return new DialogOverlayState(props, this);
	}

	createDescription(props: DialogDescriptionStateProps) {
		return new DialogDescriptionState(props, this);
	}

	createClose() {
		return new DialogCloseState(this);
	}

	sharedProps = $derived({
		"data-state": getDataOpenClosed(this.open.value),
	});
}

type DialogTriggerStateProps = ReadableBoxedValues<{
	id: string;
}>;

class DialogTriggerState {
	#id = undefined as unknown as DialogTriggerStateProps["id"];
	#root = undefined as unknown as DialogRootState;

	constructor(props: DialogTriggerStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#root.triggerNode = useNodeById(this.#id);
	}

	#onclick = () => {
		this.#root.openDialog();
	};

	props = $derived({
		id: this.#id.value,
		"aria-haspopup": "dialog",
		"aria-expanded": getAriaExpanded(this.#root.open.value),
		"aria-controls": this.#root.contentId,
		[TRIGGER_ATTR]: "",
		onclick: this.#onclick,
		...this.#root.sharedProps,
	} as const);
}

class DialogCloseState {
	#root = undefined as unknown as DialogRootState;

	constructor(root: DialogRootState) {
		this.#root = root;
	}

	#onclick = () => {
		this.#root.closeDialog();
	};

	props = $derived({
		[CLOSE_ATTR]: "",
		onclick: this.#onclick,
		...this.#root.sharedProps,
	} as const);
}

type DialogTitleStateProps = ReadableBoxedValues<{
	id: string;
	level: 1 | 2 | 3 | 4 | 5 | 6;
}>;

class DialogTitleState {
	#id = undefined as unknown as DialogTitleStateProps["id"];
	#root = undefined as unknown as DialogRootState;
	#level = undefined as unknown as DialogTitleStateProps["level"];

	constructor(props: DialogTitleStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#root.titleNode = useNodeById(this.#id);
		this.#level = props.level;
	}

	props = $derived({
		id: this.#id.value,
		role: "heading",
		"aria-level": String(this.#level),
		[TITLE_ATTR]: "",
		...this.#root.sharedProps,
	} as const);
}

type DialogDescriptionStateProps = ReadableBoxedValues<{
	id: string;
}>;

class DialogDescriptionState {
	#id = undefined as unknown as DialogDescriptionStateProps["id"];
	#root = undefined as unknown as DialogRootState;

	constructor(props: DialogDescriptionStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#root.descriptionNode = useNodeById(this.#id);
	}

	props = $derived({
		id: this.#id.value,
		[DESCRIPTION_ATTR]: "",
		...this.#root.sharedProps,
	} as const);
}

type DialogContentStateProps = ReadableBoxedValues<{
	id: string;
}>;

class DialogContentState {
	#id = undefined as unknown as DialogContentStateProps["id"];
	root = undefined as unknown as DialogRootState;

	constructor(props: DialogContentStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.root = root;
		this.root.contentNode = useNodeById(this.#id);
	}

	props = $derived({
		id: this.#id.value,
		role: "dialog",
		"aria-describedby": this.root.descriptionId,
		"aria-labelledby": this.root.titleId,
		[CONTENT_ATTR]: "",
		...this.root.sharedProps,
	} as const);
}

type DialogOverlayStateProps = ReadableBoxedValues<{
	id: string;
}>;

class DialogOverlayState {
	#id = undefined as unknown as DialogOverlayStateProps["id"];
	root = undefined as unknown as DialogRootState;

	constructor(props: DialogOverlayStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.root = root;
	}

	props = $derived({
		id: this.#id.value,
		[OVERLAY_ATTR]: "",
		...this.root.sharedProps,
	} as const);
}

const [setDialogRootContext, getDialogRootContext] = createContext<DialogRootState>("Dialog.Root");

export function useDialogRoot(props: DialogRootStateProps) {
	return setDialogRootContext(new DialogRootState(props));
}

export function useDialogTrigger(props: DialogTriggerStateProps) {
	return getDialogRootContext().createTrigger(props);
}

export function useDialogTitle(props: DialogTitleStateProps) {
	return getDialogRootContext().createTitle(props);
}

export function useDialogContent(props: DialogContentStateProps) {
	return getDialogRootContext().createContent(props);
}

export function useDialogOverlay(props: DialogOverlayStateProps) {
	return getDialogRootContext().createOverlay(props);
}

export function useDialogDescription(props: DialogDescriptionStateProps) {
	return getDialogRootContext().createDescription(props);
}

export function useDialogClose() {
	return getDialogRootContext().createClose();
}
