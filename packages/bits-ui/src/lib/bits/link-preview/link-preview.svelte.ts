import {
	afterSleep,
	onDestroyEffect,
	attachRef,
	DOMContext,
	type ReadableBoxedValues,
	type WritableBoxedValues,
	box,
} from "svelte-toolbelt";
import { Context, watch } from "runed";
import { on } from "svelte/events";
import { createBitsAttrs, getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import { isElement, isFocusVisible, isTouch } from "$lib/internal/is.js";
import type {
	BitsFocusEvent,
	BitsPointerEvent,
	OnChangeFn,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import { getTabbableCandidates } from "$lib/internal/focus.js";
import { GraceArea } from "$lib/internal/grace-area.svelte.js";
import { OpenChangeComplete } from "$lib/internal/open-change-complete.js";

const linkPreviewAttrs = createBitsAttrs({
	component: "link-preview",
	parts: ["content", "trigger"],
});

const LinkPreviewRootContext = new Context<LinkPreviewRootState>("LinkPreview.Root");

interface LinkPreviewRootStateOpts
	extends WritableBoxedValues<{
			open: boolean;
		}>,
		ReadableBoxedValues<{
			openDelay: number;
			closeDelay: number;
			onOpenChangeComplete: OnChangeFn<boolean>;
		}> {}

export class LinkPreviewRootState {
	static create(opts: LinkPreviewRootStateOpts) {
		return LinkPreviewRootContext.set(new LinkPreviewRootState(opts));
	}

	readonly opts: LinkPreviewRootStateOpts;

	hasSelection = $state(false);
	isPointerDownOnContent = $state(false);
	containsSelection = $state(false);
	timeout: number | null = null;
	contentNode = $state<HTMLElement | null>(null);
	contentMounted = $state(false);
	triggerNode = $state<HTMLElement | null>(null);
	isOpening = false;
	domContext: DOMContext = new DOMContext(() => null);

	constructor(opts: LinkPreviewRootStateOpts) {
		this.opts = opts;

		new OpenChangeComplete({
			ref: box.with(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
		});

		watch(
			() => this.opts.open.current,
			(isOpen) => {
				if (!isOpen) {
					this.hasSelection = false;
					return;
				}
				if (!this.domContext) return;

				const handlePointerUp = () => {
					this.containsSelection = false;
					this.isPointerDownOnContent = false;

					afterSleep(1, () => {
						const isSelection =
							this.domContext.getDocument().getSelection()?.toString() !== "";

						if (isSelection) {
							this.hasSelection = true;
						} else {
							this.hasSelection = false;
						}
					});
				};

				const unsubListener = on(
					this.domContext.getDocument(),
					"pointerup",
					handlePointerUp
				);

				if (!this.contentNode) return;
				const tabCandidates = getTabbableCandidates(this.contentNode);

				for (const candidate of tabCandidates) {
					candidate.setAttribute("tabindex", "-1");
				}

				return () => {
					unsubListener();
					this.hasSelection = false;
					this.isPointerDownOnContent = false;
				};
			}
		);
	}

	clearTimeout() {
		if (this.timeout) {
			this.domContext.clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	handleOpen() {
		this.clearTimeout();
		if (this.opts.open.current) return;
		this.isOpening = true;
		this.timeout = this.domContext.setTimeout(() => {
			if (this.isOpening) {
				this.opts.open.current = true;
				this.isOpening = false;
			}
		}, this.opts.openDelay.current);
	}

	immediateClose() {
		this.clearTimeout();
		this.isOpening = false;
		this.opts.open.current = false;
	}

	handleClose() {
		this.isOpening = false;
		this.clearTimeout();

		if (!this.isPointerDownOnContent && !this.hasSelection) {
			this.timeout = this.domContext.setTimeout(() => {
				this.opts.open.current = false;
			}, this.opts.closeDelay.current);
		}
	}
}

interface LinkPreviewTriggerStateOpts extends WithRefOpts {}

export class LinkPreviewTriggerState {
	static create(opts: LinkPreviewTriggerStateOpts) {
		return new LinkPreviewTriggerState(opts, LinkPreviewRootContext.get());
	}

	readonly opts: LinkPreviewTriggerStateOpts;
	readonly root: LinkPreviewRootState;
	readonly attachment: RefAttachment;

	constructor(opts: LinkPreviewTriggerStateOpts, root: LinkPreviewRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.triggerNode = v));
		this.root.domContext = new DOMContext(opts.ref);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.onblur = this.onblur.bind(this);
	}

	onpointerenter(e: BitsPointerEvent) {
		if (isTouch(e)) return;
		this.root.handleOpen();
	}

	onpointerleave(e: BitsPointerEvent) {
		if (isTouch(e)) return;
		if (!this.root.contentMounted) {
			this.root.immediateClose();
		}
	}

	onfocus(e: BitsFocusEvent) {
		if (!isFocusVisible(e.currentTarget)) return;
		this.root.handleOpen();
	}

	onblur(_: BitsFocusEvent) {
		this.root.handleClose();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-haspopup": "dialog",
				"aria-expanded": getAriaExpanded(this.root.opts.open.current),
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				"aria-controls": this.root.contentNode?.id,
				role: "button",
				[linkPreviewAttrs.trigger]: "",
				onpointerenter: this.onpointerenter,
				onfocus: this.onfocus,
				onblur: this.onblur,
				onpointerleave: this.onpointerleave,
				...this.attachment,
			}) as const
	);
}

interface LinkPreviewContentStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			onInteractOutside: (e: PointerEvent) => void;
			onEscapeKeydown: (e: KeyboardEvent) => void;
		}> {}

export class LinkPreviewContentState {
	static create(opts: LinkPreviewContentStateOpts) {
		return new LinkPreviewContentState(opts, LinkPreviewRootContext.get());
	}

	readonly opts: LinkPreviewContentStateOpts;
	readonly root: LinkPreviewRootState;
	readonly attachment: RefAttachment;

	constructor(opts: LinkPreviewContentStateOpts, root: LinkPreviewRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.contentNode = v));
		this.root.domContext = new DOMContext(opts.ref);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onfocusout = this.onfocusout.bind(this);

		new GraceArea({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.opts.ref.current,
			enabled: () => this.root.opts.open.current,
			onPointerExit: () => {
				this.root.handleClose();
			},
		});

		onDestroyEffect(() => {
			this.root.clearTimeout();
		});
	}

	onpointerdown(e: BitsPointerEvent) {
		const target = e.target;
		if (!isElement(target)) return;

		if (e.currentTarget.contains(target)) {
			this.root.containsSelection = true;
		}
		this.root.hasSelection = true;
		this.root.isPointerDownOnContent = true;
	}

	onpointerenter(e: BitsPointerEvent) {
		if (isTouch(e)) return;
		this.root.handleOpen();
	}

	onfocusout(e: BitsFocusEvent) {
		e.preventDefault();
	}

	onInteractOutside = (e: PointerEvent) => {
		this.opts.onInteractOutside.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};

	onEscapeKeydown = (e: KeyboardEvent) => {
		this.opts.onEscapeKeydown.current?.(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};

	onOpenAutoFocus = (e: Event) => {
		e.preventDefault();
	};

	onCloseAutoFocus = (e: Event) => {
		e.preventDefault();
	};

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				tabindex: -1,
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				[linkPreviewAttrs.content]: "",
				onpointerdown: this.onpointerdown,
				onpointerenter: this.onpointerenter,
				onfocusout: this.onfocusout,
				...this.attachment,
			}) as const
	);

	readonly popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onOpenAutoFocus: this.onOpenAutoFocus,
		onCloseAutoFocus: this.onCloseAutoFocus,
	};
}
