import { useRefById } from "svelte-toolbelt";
import { Context } from "runed";
import { getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";
import { kbd } from "$lib/internal/kbd.js";

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
	triggerNode = $state<HTMLElement | null>(null);
	titleNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	contentId = $state<string | undefined>(undefined);
	titleId = $state<string | undefined>(undefined);
	triggerId = $state<string | undefined>(undefined);
	descriptionId = $state<string | undefined>(undefined);
	cancelNode = $state<HTMLElement | null>(null);
	attrs = $derived.by(() => createAttrs(this.opts.variant.current));

	constructor(readonly opts: DialogRootStateProps) {
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
	constructor(
		readonly opts: DialogTriggerStateProps,
		readonly root: DialogRootState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.triggerNode = node;
				this.root.triggerId = node?.id;
			},
		});

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
			}) as const
	);
}

type DialogCloseStateProps = WithRefProps &
	ReadableBoxedValues<{
		variant: "action" | "cancel" | "close";
		disabled: boolean;
	}>;
class DialogCloseState {
	#attr = $derived.by(() => this.root.attrs[this.opts.variant.current]);

	constructor(
		readonly opts: DialogCloseStateProps,
		readonly root: DialogRootState
	) {
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);

		useRefById({
			...opts,
			deps: () => this.root.opts.open.current,
		});
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
			}) as const
	);
}

type DialogActionStateProps = WithRefProps;

class DialogActionState {
	#attr = $derived.by(() => this.root.attrs.action);

	constructor(
		readonly opts: DialogActionStateProps,
		readonly root: DialogRootState
	) {
		useRefById(opts);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.#attr]: "",
				...this.root.sharedProps,
			}) as const
	);
}

type DialogTitleStateProps = WithRefProps<
	ReadableBoxedValues<{
		level: 1 | 2 | 3 | 4 | 5 | 6;
	}>
>;
class DialogTitleState {
	constructor(
		readonly opts: DialogTitleStateProps,
		readonly root: DialogRootState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.titleNode = node;
				this.root.titleId = node?.id;
			},
			deps: () => this.root.opts.open.current,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "heading",
				"aria-level": this.opts.level.current,
				[this.root.attrs.title]: "",
				...this.root.sharedProps,
			}) as const
	);
}

type DialogDescriptionStateProps = WithRefProps;

class DialogDescriptionState {
	constructor(
		readonly opts: DialogDescriptionStateProps,
		readonly root: DialogRootState
	) {
		useRefById({
			...opts,
			deps: () => this.root.opts.open.current,
			onRefChange: (node) => {
				this.root.descriptionNode = node;
				this.root.descriptionId = node?.id;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.attrs.description]: "",
				...this.root.sharedProps,
			}) as const
	);
}

type DialogContentStateProps = WithRefProps;

class DialogContentState {
	constructor(
		readonly opts: DialogContentStateProps,
		readonly root: DialogRootState
	) {
		useRefById({
			...opts,
			deps: () => this.root.opts.open.current,
			onRefChange: (node) => {
				this.root.contentNode = node;
				this.root.contentId = node?.id;
			},
		});
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
			}) as const
	);
}

type DialogOverlayStateProps = WithRefProps;

class DialogOverlayState {
	constructor(
		readonly opts: DialogOverlayStateProps,
		readonly root: DialogRootState
	) {
		useRefById({
			...opts,
			deps: () => this.root.opts.open.current,
		});
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
			}) as const
	);
}

type AlertDialogCancelStateProps = WithRefProps &
	ReadableBoxedValues<{
		disabled: boolean;
	}>;

class AlertDialogCancelState {
	constructor(
		readonly opts: AlertDialogCancelStateProps,
		readonly root: DialogRootState
	) {
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);

		useRefById({
			...opts,
			deps: () => this.root.opts.open.current,
			onRefChange: (node) => {
				this.root.cancelNode = node;
			},
		});
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
