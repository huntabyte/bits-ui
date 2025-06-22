import {
	attachRef,
	box,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "svelte-toolbelt";
import { Context, watch } from "runed";
import { createBitsAttrs, getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	OnChangeFn,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import { kbd } from "$lib/internal/kbd.js";
import { OpenChangeComplete } from "$lib/internal/open-change-complete.js";

type DialogVariant = "alert-dialog" | "dialog";

const dialogAttrs = createBitsAttrs({
	component: "dialog",
	parts: ["content", "trigger", "overlay", "title", "description", "close", "cancel", "action"],
});

const DialogRootContext = new Context<DialogRootState>("Dialog.Root | AlertDialog.Root");

interface DialogRootStateOpts
	extends WritableBoxedValues<{
			open: boolean;
		}>,
		ReadableBoxedValues<{
			variant: DialogVariant;
			onOpenChangeComplete: OnChangeFn<boolean>;
		}> {}

export class DialogRootState {
	static create(opts: DialogRootStateOpts) {
		return DialogRootContext.set(new DialogRootState(opts));
	}

	readonly opts: DialogRootStateOpts;
	triggerNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	contentId = $state<string | undefined>(undefined);
	titleId = $state<string | undefined>(undefined);
	triggerId = $state<string | undefined>(undefined);
	descriptionId = $state<string | undefined>(undefined);
	cancelNode = $state<HTMLElement | null>(null);

	constructor(opts: DialogRootStateOpts) {
		this.opts = opts;
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);

		new OpenChangeComplete({
			ref: box.with(() => this.contentNode),
			open: this.opts.open,
			enabled: true,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
		});
	}

	handleOpen() {
		if (this.opts.open.current) return;
		this.opts.open.current = true;
	}

	handleClose() {
		if (!this.opts.open.current) return;
		this.opts.open.current = false;
	}

	getBitsAttr: typeof dialogAttrs.getAttr = (part) => {
		return dialogAttrs.getAttr(part, this.opts.variant.current);
	};

	readonly sharedProps = $derived.by(
		() =>
			({
				"data-state": getDataOpenClosed(this.opts.open.current),
			}) as const
	);
}

interface DialogTriggerStateOpts extends WithRefOpts, ReadableBoxedValues<{ disabled: boolean }> {}

export class DialogTriggerState {
	static create(opts: DialogTriggerStateOpts) {
		return new DialogTriggerState(opts, DialogRootContext.get());
	}

	readonly opts: DialogTriggerStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DialogTriggerStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.triggerNode = v;
			this.root.triggerId = v?.id;
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

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-haspopup": "dialog",
				"aria-expanded": getAriaExpanded(this.root.opts.open.current),
				"aria-controls": this.root.contentId,
				[this.root.getBitsAttr("trigger")]: "",
				onkeydown: this.onkeydown,
				onclick: this.onclick,
				disabled: this.opts.disabled.current ? true : undefined,
				...this.root.sharedProps,
				...this.attachment,
			}) as const
	);
}

interface DialogCloseStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{ variant: "action" | "cancel" | "close"; disabled: boolean }> {}

export class DialogCloseState {
	static create(opts: DialogCloseStateOpts) {
		return new DialogCloseState(opts, DialogRootContext.get());
	}

	readonly opts: DialogCloseStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DialogCloseStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
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

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr(this.opts.variant.current)]: "",
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				disabled: this.opts.disabled.current ? true : undefined,
				tabindex: 0,
				...this.root.sharedProps,
				...this.attachment,
			}) as const
	);
}

interface DialogActionStateOpts extends WithRefOpts {}

export class DialogActionState {
	static create(opts: DialogActionStateOpts) {
		return new DialogActionState(opts, DialogRootContext.get());
	}

	readonly opts: DialogActionStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;
	constructor(opts: DialogActionStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr("action")]: "",
				...this.root.sharedProps,
				...this.attachment,
			}) as const
	);
}

interface DialogTitleStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{ level: 1 | 2 | 3 | 4 | 5 | 6 }> {}

export class DialogTitleState {
	static create(opts: DialogTitleStateOpts) {
		return new DialogTitleState(opts, DialogRootContext.get());
	}

	readonly opts: DialogTitleStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DialogTitleStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.root.titleId = this.opts.id.current;
		this.attachment = attachRef(this.opts.ref);

		watch.pre(
			() => this.opts.id.current,
			(id) => {
				this.root.titleId = id;
			}
		);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "heading",
				"aria-level": this.opts.level.current,
				[this.root.getBitsAttr("title")]: "",
				...this.root.sharedProps,
				...this.attachment,
			}) as const
	);
}

interface DialogDescriptionStateOpts extends WithRefOpts {}

export class DialogDescriptionState {
	static create(opts: DialogDescriptionStateOpts) {
		return new DialogDescriptionState(opts, DialogRootContext.get());
	}

	readonly opts: DialogDescriptionStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DialogDescriptionStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.root.descriptionId = this.opts.id.current;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.descriptionNode = v;
		});
		watch.pre(
			() => this.opts.id.current,
			(id) => {
				this.root.descriptionId = id;
			}
		);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr("description")]: "",
				...this.root.sharedProps,
				...this.attachment,
			}) as const
	);
}

interface DialogContentStateOpts extends WithRefOpts {}

export class DialogContentState {
	static create(opts: DialogContentStateOpts) {
		return new DialogContentState(opts, DialogRootContext.get());
	}

	readonly opts: DialogContentStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DialogContentStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.contentNode = v;
			this.root.contentId = v?.id;
		});
	}

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: this.root.opts.variant.current === "alert-dialog" ? "alertdialog" : "dialog",
				"aria-modal": "true",
				"aria-describedby": this.root.descriptionId,
				"aria-labelledby": this.root.titleId,
				[this.root.getBitsAttr("content")]: "",
				style: {
					pointerEvents: "auto",
					outline: this.root.opts.variant.current === "alert-dialog" ? "none" : undefined,
				},
				tabindex: this.root.opts.variant.current === "alert-dialog" ? -1 : undefined,
				...this.root.sharedProps,
				...this.attachment,
			}) as const
	);
}

interface DialogOverlayStateOpts extends WithRefOpts {}

export class DialogOverlayState {
	static create(opts: DialogOverlayStateOpts) {
		return new DialogOverlayState(opts, DialogRootContext.get());
	}

	readonly opts: DialogOverlayStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;
	constructor(opts: DialogOverlayStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr("overlay")]: "",
				style: {
					pointerEvents: "auto",
				},
				...this.root.sharedProps,
				...this.attachment,
			}) as const
	);
}

interface AlertDialogCancelStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{ disabled: boolean }> {}

export class AlertDialogCancelState {
	static create(opts: AlertDialogCancelStateOpts) {
		return new AlertDialogCancelState(opts, DialogRootContext.get());
	}

	readonly opts: AlertDialogCancelStateOpts;
	readonly root: DialogRootState;
	readonly attachment: RefAttachment;

	constructor(opts: AlertDialogCancelStateOpts, root: DialogRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.cancelNode = v));
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

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr("cancel")]: "",
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				tabindex: 0,
				...this.root.sharedProps,
				...this.attachment,
			}) as const
	);
}
