import { getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { createContext } from "$lib/internal/createContext.js";
import type { WithRefProps } from "$lib/internal/types.js";

type DialogVariant = "alert-dialog" | "dialog";

function createAttrs(variant: DialogVariant) {
	return {
		content: `data-${variant}-content`,
		trigger: `data-${variant}-trigger`,
		overlay: `data-${variant}-overlay`,
		title: `data-${variant}-title`,
		description: `data-${variant}-description`,
		close: `data-${variant}-close`,
		cancel: `data-${variant}-cancel`,
		action: `data-${variant}-action`,
	} as const;
}

type DialogRootStateProps = WritableBoxedValues<{
	open: boolean;
}> &
	ReadableBoxedValues<{
		variant: DialogVariant;
	}>;

class DialogRootState {
	open: DialogRootStateProps["open"];
	variant: DialogRootStateProps["variant"];
	triggerNode = $state<HTMLElement | null>(null);
	titleNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	contentId = $state<string | undefined>(undefined);
	titleId = $state<string | undefined>(undefined);
	triggerId = $state<string | undefined>(undefined);
	descriptionId = $state<string | undefined>(undefined);
	cancelNode = $state<HTMLElement | null>(null);
	attrs = $derived.by(() => createAttrs(this.variant.current));

	constructor(props: DialogRootStateProps) {
		this.open = props.open;
		this.variant = props.variant;
	}

	handleOpen = () => {
		if (this.open.current) return;
		this.open.current = true;
	};

	handleClose = () => {
		if (!this.open.current) return;
		this.open.current = false;
	};

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
				this.#root.triggerId = node?.id;
			},
		});
	}

	#onclick = () => {
		this.#root.handleOpen();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"aria-haspopup": "dialog",
				"aria-expanded": getAriaExpanded(this.#root.open.current),
				"aria-controls": this.#root.contentId,
				[this.#root.attrs.trigger]: "",
				onclick: this.#onclick,
				...this.#root.sharedProps,
			}) as const
	);
}

type DialogCloseStateProps = WithRefProps &
	ReadableBoxedValues<{
		variant: "action" | "cancel" | "close";
	}>;
class DialogCloseState {
	#id: DialogCloseStateProps["id"];
	#ref: DialogCloseStateProps["ref"];
	#root: DialogRootState;
	#variant: DialogCloseStateProps["variant"];
	#attr = $derived.by(() => this.#root.attrs[this.#variant.current]);

	constructor(props: DialogCloseStateProps, root: DialogRootState) {
		this.#root = root;
		this.#ref = props.ref;
		this.#id = props.id;
		this.#variant = props.variant;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			deps: () => this.#root.open.current,
		});
	}

	#onclick = () => {
		this.#root.handleClose();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[this.#attr]: "",
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
				this.#root.titleId = node?.id;
			},
			deps: () => this.#root.open.current,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "heading",
				"aria-level": this.#level.current,
				[this.#root.attrs.title]: "",
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
			deps: () => this.#root.open.current,
			onRefChange: (node) => {
				this.#root.descriptionNode = node;
				this.#root.descriptionId = node?.id;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[this.#root.attrs.description]: "",
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
			deps: () => this.root.open.current,
			onRefChange: (node) => {
				this.root.contentNode = node;
				this.root.contentId = node?.id;
			},
		});
	}

	snippetProps = $derived.by(() => ({ open: this.root.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: this.root.variant.current === "alert-dialog" ? "alertdialog" : "dialog",
				"aria-describedby": this.root.descriptionId,
				"aria-labelledby": this.root.titleId,
				[this.root.attrs.content]: "",
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
			deps: () => this.root.open.current,
		});
	}

	snippetProps = $derived.by(() => ({ open: this.root.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[this.root.attrs.overlay]: "",
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
			deps: () => this.#root.open.current,
			onRefChange: (node) => {
				this.#root.cancelNode = node;
			},
		});
	}

	#onclick = () => {
		this.#root.handleClose();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[this.#root.attrs.cancel]: "",
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
