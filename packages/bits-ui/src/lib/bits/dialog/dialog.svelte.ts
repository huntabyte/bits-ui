import { getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { createContext } from "$lib/internal/createContext.js";
import type { WithRefProps } from "$lib/internal/types.js";

const CONTENT_ATTR = "data-dialog-content";
const TITLE_ATTR = "data-dialog-title";
const TRIGGER_ATTR = "data-dialog-trigger";
const OVERLAY_ATTR = "data-dialog-overlay";
const DESCRIPTION_ATTR = "data-dialog-description";
const CLOSE_ATTR = "data-dialog-close";
const CANCEL_ATTR = "data-dialog-cancel";

type DialogRootStateProps = WritableBoxedValues<{
	open: boolean;
}>;

class DialogRootState {
	open: DialogRootStateProps["open"];
	triggerNode = $state<HTMLElement | null>(null);
	titleNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	contentId = $derived(this.contentNode ? this.contentNode.id : undefined);
	titleId = $derived(this.titleNode ? this.titleNode.id : undefined);
	triggerId = $derived(this.triggerNode ? this.triggerNode.id : undefined);
	descriptionId = $derived(this.descriptionNode ? this.descriptionNode.id : undefined);
	cancelNode = $state<HTMLElement | null>(null);

	constructor(props: DialogRootStateProps) {
		this.open = props.open;
	}

	openDialog() {
		if (this.open.current) return;
		this.open.current = true;
	}

	closeDialog() {
		if (!this.open.current) return;
		this.open.current = false;
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

	createClose(props: DialogCloseStateProps) {
		return new DialogCloseState(props, this);
	}

	createCancel(props: AlertDialogCancelStateProps) {
		return new AlertDialogCancelState(props, this);
	}

	sharedProps = $derived.by(
		() =>
			({
				"data-state": getDataOpenClosed(this.open.current),
			}) as const
	);
}

type DialogTriggerStateProps = WithRefProps;

class DialogTriggerState {
	#id: DialogTriggerStateProps["id"];
	#ref: DialogTriggerStateProps["ref"];
	#root: DialogRootState;

	constructor(props: DialogTriggerStateProps, root: DialogRootState) {
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
		this.#root.openDialog();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"aria-haspopup": "dialog",
				"aria-expanded": getAriaExpanded(this.#root.open.current),
				"aria-controls": this.#root.contentId,
				[TRIGGER_ATTR]: "",
				onclick: this.#onclick,
				...this.#root.sharedProps,
			}) as const
	);
}

type DialogCloseStateProps = WithRefProps;
class DialogCloseState {
	#id: DialogCloseStateProps["id"];
	#ref: DialogCloseStateProps["ref"];
	#root: DialogRootState;

	constructor(props: DialogCloseStateProps, root: DialogRootState) {
		this.#root = root;
		this.#ref = props.ref;
		this.#id = props.id;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			condition: () => this.#root.open.current,
		});
	}

	#onclick = () => {
		this.#root.closeDialog();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[CLOSE_ATTR]: "",
				onclick: this.#onclick,
				...this.#root.sharedProps,
			}) as const
	);
}

type DialogTitleStateProps = WithRefProps<
	ReadableBoxedValues<{
		level: 1 | 2 | 3 | 4 | 5 | 6;
	}>
>;
class DialogTitleState {
	#id: DialogTitleStateProps["id"];
	#ref: DialogTitleStateProps["ref"];
	#root: DialogRootState;
	#level: DialogTitleStateProps["level"];

	constructor(props: DialogTitleStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#ref = props.ref;
		this.#level = props.level;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.titleNode = node;
			},
			condition: () => this.#root.open.current,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "heading",
				"aria-level": this.#level.current,
				[TITLE_ATTR]: "",
				...this.#root.sharedProps,
			}) as const
	);
}

type DialogDescriptionStateProps = WithRefProps;

class DialogDescriptionState {
	#id: DialogDescriptionStateProps["id"];
	#ref: DialogDescriptionStateProps["ref"];
	#root: DialogRootState;

	constructor(props: DialogDescriptionStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.#root = root;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			condition: () => this.#root.open.current,
			onRefChange: (node) => {
				this.#root.descriptionNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[DESCRIPTION_ATTR]: "",
				...this.#root.sharedProps,
			}) as const
	);
}

type DialogContentStateProps = WithRefProps;

class DialogContentState {
	#id: DialogContentStateProps["id"];
	#ref: DialogContentStateProps["ref"];
	root: DialogRootState;

	constructor(props: DialogContentStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.root = root;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			condition: () => this.root.open.current,
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
				role: "dialog",
				"aria-describedby": this.root.descriptionId,
				"aria-labelledby": this.root.titleId,
				[CONTENT_ATTR]: "",
				...this.root.sharedProps,
			}) as const
	);
}

type DialogOverlayStateProps = WithRefProps;

class DialogOverlayState {
	#id: DialogOverlayStateProps["id"];
	#ref: DialogOverlayStateProps["ref"];
	root: DialogRootState;

	constructor(props: DialogOverlayStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			condition: () => this.root.open.current,
		});
	}

	snippetProps = $derived.by(() => ({ open: this.root.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[OVERLAY_ATTR]: "",
				...this.root.sharedProps,
			}) as const
	);
}

type AlertDialogCancelStateProps = WithRefProps;

class AlertDialogCancelState {
	#id: AlertDialogCancelStateProps["id"];
	#ref: AlertDialogCancelStateProps["ref"];
	#root: DialogRootState;

	constructor(props: AlertDialogCancelStateProps, root: DialogRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			condition: () => this.#root.open.current,
			onRefChange: (node) => {
				this.#root.cancelNode = node;
			},
		});
	}

	#onclick = () => {
		this.#root.closeDialog();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[CANCEL_ATTR]: "",
				onclick: this.#onclick,
				...this.#root.sharedProps,
			}) as const
	);
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

export function useDialogClose(props: DialogCloseStateProps) {
	return getDialogRootContext().createClose(props);
}

export function useAlertDialogCancel(props: AlertDialogCancelStateProps) {
	return getDialogRootContext().createCancel(props);
}
