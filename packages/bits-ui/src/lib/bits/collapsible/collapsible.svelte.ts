import {
	afterTick,
	attachRef,
	box,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "svelte-toolbelt";
import { Context, watch } from "runed";
import {
	createBitsAttrs,
	getAriaExpanded,
	getDataDisabled,
	getDataOpenClosed,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	OnChangeFn,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import { OpenChangeComplete } from "$lib/internal/open-change-complete.js";

const collapsibleAttrs = createBitsAttrs({
	component: "collapsible",
	parts: ["root", "content", "trigger"],
});

interface CollapsibleRootStateOpts
	extends WithRefOpts,
		WritableBoxedValues<{
			open: boolean;
		}>,
		ReadableBoxedValues<{
			disabled: boolean;
			onOpenChangeComplete: OnChangeFn<boolean>;
		}> {}

const CollapsibleRootContext = new Context<CollapsibleRootState>("Collapsible.Root");

export class CollapsibleRootState {
	static create(opts: CollapsibleRootStateOpts) {
		return CollapsibleRootContext.set(new CollapsibleRootState(opts));
	}

	readonly opts: CollapsibleRootStateOpts;
	readonly attachment: RefAttachment;
	contentNode = $state<HTMLElement | null>(null);
	contentId = $state<string | undefined>(undefined);

	constructor(opts: CollapsibleRootStateOpts) {
		this.opts = opts;
		this.toggleOpen = this.toggleOpen.bind(this);
		this.attachment = attachRef(this.opts.ref);

		new OpenChangeComplete({
			ref: box.with(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
		});
	}

	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-state": getDataOpenClosed(this.opts.open.current),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				[collapsibleAttrs.root]: "",
				...this.attachment,
			}) as const
	);
}

interface CollapsibleContentStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			forceMount: boolean;
		}> {}

export class CollapsibleContentState {
	static create(opts: CollapsibleContentStateOpts) {
		return new CollapsibleContentState(opts, CollapsibleRootContext.get());
	}

	readonly opts: CollapsibleContentStateOpts;
	readonly root: CollapsibleRootState;
	readonly attachment: RefAttachment;
	readonly present = $derived.by(
		() => this.opts.forceMount.current || this.root.opts.open.current
	);

	#originalStyles: { transitionDuration: string; animationName: string } | undefined;
	#isMountAnimationPrevented = $state(false);
	#width = $state(0);
	#height = $state(0);

	constructor(opts: CollapsibleContentStateOpts, root: CollapsibleRootState) {
		this.opts = opts;
		this.root = root;
		this.#isMountAnimationPrevented = root.opts.open.current;
		this.root.contentId = this.opts.id.current;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.contentNode = v));

		watch.pre(
			() => this.opts.id.current,
			(id) => {
				this.root.contentId = id;
			}
		);

		$effect.pre(() => {
			const rAF = requestAnimationFrame(() => {
				this.#isMountAnimationPrevented = false;
			});

			return () => {
				cancelAnimationFrame(rAF);
			};
		});

		watch([() => this.opts.ref.current, () => this.present], ([node]) => {
			if (!node) return;
			afterTick(() => {
				if (!this.opts.ref.current) return;
				// get the dimensions of the element
				this.#originalStyles = this.#originalStyles || {
					transitionDuration: node.style.transitionDuration,
					animationName: node.style.animationName,
				};

				// block any animations/transitions so the element renders at full dimensions
				node.style.transitionDuration = "0s";
				node.style.animationName = "none";

				const rect = node.getBoundingClientRect();
				this.#height = rect.height;
				this.#width = rect.width;

				// unblock any animations/transitions that were originally set if not the initial render
				if (!this.#isMountAnimationPrevented) {
					const { animationName, transitionDuration } = this.#originalStyles;
					node.style.transitionDuration = transitionDuration;
					node.style.animationName = animationName;
				}
			});
		});
	}

	readonly snippetProps = $derived.by(() => ({
		open: this.root.opts.open.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: {
					"--bits-collapsible-content-height": this.#height
						? `${this.#height}px`
						: undefined,
					"--bits-collapsible-content-width": this.#width
						? `${this.#width}px`
						: undefined,
				},
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				[collapsibleAttrs.content]: "",
				...this.attachment,
			}) as const
	);
}

interface CollapsibleTriggerStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean | null | undefined;
		}> {}

export class CollapsibleTriggerState {
	static create(opts: CollapsibleTriggerStateOpts) {
		return new CollapsibleTriggerState(opts, CollapsibleRootContext.get());
	}

	readonly opts: CollapsibleTriggerStateOpts;
	readonly root: CollapsibleRootState;
	readonly attachment: RefAttachment;
	#isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);

	constructor(opts: CollapsibleTriggerStateOpts, root: CollapsibleRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.#isDisabled) return;
		if (e.button !== 0) return e.preventDefault();
		this.root.toggleOpen();
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;

		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.root.toggleOpen();
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				type: "button",
				disabled: this.#isDisabled,
				"aria-controls": this.root.contentId,
				"aria-expanded": getAriaExpanded(this.root.opts.open.current),
				"data-state": getDataOpenClosed(this.root.opts.open.current),
				"data-disabled": getDataDisabled(this.#isDisabled),
				[collapsibleAttrs.trigger]: "",
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const
	);
}
