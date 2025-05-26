import { attachRef } from "svelte-toolbelt";
import { Context } from "runed";
import { getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";
import { kbd } from "$lib/internal/kbd.js";
import { untrack } from "svelte";

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
	readonly opts: DialogRootStateProps;
	triggerNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	contentId = $state<string | undefined>(undefined);
	titleId = $state<string | undefined>(undefined);
	triggerId = $state<string | undefined>(undefined);
	descriptionId = $state<string | undefined>(undefined);
	cancelNode = $state<HTMLElement | null>(null);
	attrs = $derived.by(() => createAttrs(this.opts.variant.current));

	constructor(opts: DialogRootStateProps) {
		this.opts = opts;
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	handleOpen() {
		if (this.opts.open.current) return;
		this.opts.open.current = true;
	}

	handleClose() {
		if (!this.opts.open.current) return;
		this.opts.open.current = false;
	}

	sharedProps = $derived.by(
		() =>
			({
				"data-state": getDataOpenClosed(this.opts.open.current),
			}) as const
	);
}

type DialogTriggerStateProps = WithRefProps & ReadableBoxedValues<{ disabled: boolean }>;

class DialogTriggerState {
	readonly opts: DialogTriggerStateProps;
	readonly root: DialogRootState;

	constructor(opts: DialogTriggerStateProps, root: DialogRootState) {
		this.opts = opts;
		this.root = root;

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		if (e.button > 0) return;
		this.root.handleOpen();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.opts.disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.root.handleOpen();
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-haspopup": "dialog",
				"aria-expanded": getAriaExpanded(this.root.opts.open.current),
				"aria-controls": this.root.contentId,
				[this.root.attrs.trigger]: "",
				onkeydown: this.onkeydown,
				onclick: this.onclick,
				disabled: this.opts.disabled.current ? true : undefined,
				...this.root.sharedProps,
				...attachRef(this.opts.ref, (v) =>
					untrack(() => {
						this.root.triggerNode = v;
						this.root.triggerId = v?.id;
					})
				),
			}) as const
	);
}

type DialogCloseStateProps = WithRefProps &
	ReadableBoxedValues<{
		variant: "action" | "cancel" | "close";
		disabled: boolean;
	}>;
class DialogCloseState {
	readonly opts: DialogCloseStateProps;
	readonly root: DialogRootState;
	#attr = $derived.by(() => this.root.attrs[this.opts.variant.current]);

	constructor(opts: DialogCloseStateProps, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		if (e.button > 0) return;
		this.root.handleClose();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.opts.disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.root.handleClose();
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.#attr]: "",
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				disabled: this.opts.disabled.current ? true : undefined,
				tabindex: 0,
				...this.root.sharedProps,
				...attachRef(this.opts.ref),
			}) as const
	);
}

type DialogActionStateProps = WithRefProps;

class DialogActionState {
	readonly opts: DialogActionStateProps;
	readonly root: DialogRootState;
	#attr = $derived.by(() => this.root.attrs.action);

	constructor(opts: DialogActionStateProps, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.#attr]: "",
				...this.root.sharedProps,
				...attachRef(this.opts.ref),
			}) as const
	);
}

type DialogTitleStateProps = WithRefProps<
	ReadableBoxedValues<{
		level: 1 | 2 | 3 | 4 | 5 | 6;
	}>
>;
class DialogTitleState {
	readonly opts: DialogTitleStateProps;
	readonly root: DialogRootState;

	constructor(opts: DialogTitleStateProps, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "heading",
				"aria-level": this.opts.level.current,
				[this.root.attrs.title]: "",
				...this.root.sharedProps,
				...attachRef(this.opts.ref, (v) => (this.root.titleId = v?.id)),
			}) as const
	);
}

type DialogDescriptionStateProps = WithRefProps;

class DialogDescriptionState {
	readonly opts: DialogDescriptionStateProps;
	readonly root: DialogRootState;

	constructor(opts: DialogDescriptionStateProps, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.attrs.description]: "",
				...this.root.sharedProps,
				...attachRef(this.opts.ref, (v) => {
					this.root.descriptionNode = v;
					this.root.descriptionId = v?.id;
				}),
			}) as const
	);
}

type DialogContentStateProps = WithRefProps;

class DialogContentState {
	readonly opts: DialogContentStateProps;
	readonly root: DialogRootState;

	constructor(opts: DialogContentStateProps, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
	}

	snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: this.root.opts.variant.current === "alert-dialog" ? "alertdialog" : "dialog",
				"aria-modal": "true",
				"aria-describedby": this.root.descriptionId,
				"aria-labelledby": this.root.titleId,
				[this.root.attrs.content]: "",
				style: {
					pointerEvents: "auto",
					outline: this.root.opts.variant.current === "alert-dialog" ? "none" : undefined,
				},
				tabindex: this.root.opts.variant.current === "alert-dialog" ? -1 : undefined,
				...this.root.sharedProps,
				...attachRef(this.opts.ref, (v) => {
					this.root.contentNode = v;
					this.root.contentId = v?.id;
				}),
			}) as const
	);
}

type DialogOverlayStateProps = WithRefProps;

class DialogOverlayState {
	readonly opts: DialogOverlayStateProps;
	readonly root: DialogRootState;

	constructor(opts: DialogOverlayStateProps, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
	}

	snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.attrs.overlay]: "",
				style: {
					pointerEvents: "auto",
				},
				...this.root.sharedProps,
				...attachRef(this.opts.ref),
			}) as const
	);
}

type AlertDialogCancelStateProps = WithRefProps &
	ReadableBoxedValues<{
		disabled: boolean;
	}>;

class AlertDialogCancelState {
	readonly opts: AlertDialogCancelStateProps;
	readonly root: DialogRootState;

	constructor(opts: AlertDialogCancelStateProps, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		if (e.button > 0) return;
		this.root.handleClose();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.opts.disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.root.handleClose();
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.attrs.cancel]: "",
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				tabindex: 0,
				...this.root.sharedProps,
				...attachRef(this.opts.ref, (v) => (this.root.cancelNode = v)),
			}) as const
	);
}

const DialogRootContext = new Context<DialogRootState>("Dialog.Root");

export function useDialogRoot(props: DialogRootStateProps) {
	return DialogRootContext.set(new DialogRootState(props));
}

export function useDialogTrigger(props: DialogTriggerStateProps) {
	return new DialogTriggerState(props, DialogRootContext.get());
}

export function useDialogTitle(props: DialogTitleStateProps) {
	return new DialogTitleState(props, DialogRootContext.get());
}

export function useDialogContent(props: DialogContentStateProps) {
	return new DialogContentState(props, DialogRootContext.get());
}

export function useDialogOverlay(props: DialogOverlayStateProps) {
	return new DialogOverlayState(props, DialogRootContext.get());
}

export function useDialogDescription(props: DialogDescriptionStateProps) {
	return new DialogDescriptionState(props, DialogRootContext.get());
}

export function useDialogClose(props: DialogCloseStateProps) {
	return new DialogCloseState(props, DialogRootContext.get());
}

export function useAlertDialogCancel(props: AlertDialogCancelStateProps) {
	return new AlertDialogCancelState(props, DialogRootContext.get());
}

export function useAlertDialogAction(props: DialogActionStateProps) {
	return new DialogActionState(props, DialogRootContext.get());
}
