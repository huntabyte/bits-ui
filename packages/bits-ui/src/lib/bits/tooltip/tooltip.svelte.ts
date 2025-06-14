import { box, onMountEffect, attachRef, DOMContext } from "svelte-toolbelt";
import { on } from "svelte/events";
import { Context, watch } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { isElement, isFocusVisible } from "$lib/internal/is.js";
import { useGraceArea } from "$lib/internal/use-grace-area.svelte.js";
import { createBitsAttrs, getDataDisabled } from "$lib/internal/attrs.js";
import type { WithRefProps } from "$lib/internal/types.js";
import type { FocusEventHandler, MouseEventHandler, PointerEventHandler } from "svelte/elements";
import { TimeoutFn } from "$lib/internal/timeout-fn.js";

export const tooltipAttrs = createBitsAttrs({
	component: "tooltip",
	parts: ["content", "trigger"],
});

type TooltipProviderStateProps = ReadableBoxedValues<{
	delayDuration: number;
	disableHoverableContent: boolean;
	disableCloseOnTriggerClick: boolean;
	disabled: boolean;
	ignoreNonKeyboardFocus: boolean;
	skipDelayDuration: number;
}>;
class TooltipProviderState {
	readonly opts: TooltipProviderStateProps;
	isOpenDelayed = $state<boolean>(true);
	isPointerInTransit = box(false);
	#timerFn: TimeoutFn<() => void>;
	#openTooltip = $state<TooltipRootState | null>(null);

	constructor(opts: TooltipProviderStateProps) {
		this.opts = opts;
		this.#timerFn = new TimeoutFn(
			() => {
				this.isOpenDelayed = true;
			},
			this.opts.skipDelayDuration.current,
			{ immediate: false }
		);
	}

	#startTimer = () => {
		const skipDuration = this.opts.skipDelayDuration.current;

		if (skipDuration === 0) {
			return;
		} else {
			this.#timerFn.start();
		}
	};

	#clearTimer = () => {
		this.#timerFn.stop();
	};

	onOpen = (tooltip: TooltipRootState) => {
		if (this.#openTooltip && this.#openTooltip !== tooltip) {
			this.#openTooltip.handleClose();
		}

		this.#clearTimer();
		this.isOpenDelayed = false;
		this.#openTooltip = tooltip;
	};

	onClose = (tooltip: TooltipRootState) => {
		if (this.#openTooltip === tooltip) {
			this.#openTooltip = null;
		}
		this.#startTimer();
	};

	isTooltipOpen = (tooltip: TooltipRootState) => {
		return this.#openTooltip === tooltip;
	};
}

type TooltipRootStateProps = ReadableBoxedValues<{
	delayDuration: number | undefined;
	disableHoverableContent: boolean | undefined;
	disableCloseOnTriggerClick: boolean | undefined;
	disabled: boolean | undefined;
	ignoreNonKeyboardFocus: boolean | undefined;
}> &
	WritableBoxedValues<{
		open: boolean;
	}>;

class TooltipRootState {
	readonly opts: TooltipRootStateProps;
	readonly provider: TooltipProviderState;
	readonly delayDuration = $derived.by(
		() => this.opts.delayDuration.current ?? this.provider.opts.delayDuration.current
	);
	readonly disableHoverableContent = $derived.by(
		() =>
			this.opts.disableHoverableContent.current ??
			this.provider.opts.disableHoverableContent.current
	);
	readonly disableCloseOnTriggerClick = $derived.by(
		() =>
			this.opts.disableCloseOnTriggerClick.current ??
			this.provider.opts.disableCloseOnTriggerClick.current
	);
	readonly disabled = $derived.by(
		() => this.opts.disabled.current ?? this.provider.opts.disabled.current
	);
	readonly ignoreNonKeyboardFocus = $derived.by(
		() =>
			this.opts.ignoreNonKeyboardFocus.current ??
			this.provider.opts.ignoreNonKeyboardFocus.current
	);
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	#wasOpenDelayed = $state(false);
	#timerFn: TimeoutFn<() => void>;
	readonly stateAttr = $derived.by(() => {
		if (!this.opts.open.current) return "closed";
		return this.#wasOpenDelayed ? "delayed-open" : "instant-open";
	});

	constructor(opts: TooltipRootStateProps, provider: TooltipProviderState) {
		this.opts = opts;
		this.provider = provider;
		this.#timerFn = new TimeoutFn(
			() => {
				this.#wasOpenDelayed = true;
				this.opts.open.current = true;
			},
			this.delayDuration ?? 0,
			{ immediate: false }
		);

		watch(
			() => this.delayDuration,
			() => {
				if (this.delayDuration === undefined) return;
				this.#timerFn = new TimeoutFn(
					() => {
						this.#wasOpenDelayed = true;
						this.opts.open.current = true;
					},
					this.delayDuration,
					{ immediate: false }
				);
			}
		);

		watch(
			() => this.opts.open.current,
			(isOpen) => {
				if (isOpen) {
					this.provider.onOpen(this);
				} else {
					this.provider.onClose(this);
				}
			}
		);
	}

	handleOpen = () => {
		this.#timerFn.stop();
		this.#wasOpenDelayed = false;
		this.opts.open.current = true;
	};

	handleClose = () => {
		this.#timerFn.stop();
		this.opts.open.current = false;
	};

	#handleDelayedOpen = () => {
		this.#timerFn.stop();

		const shouldSkipDelay = !this.provider.isOpenDelayed;
		const delayDuration = this.delayDuration ?? 0;

		// if no delay needed (either skip delay active or delay is 0), open immediately
		if (shouldSkipDelay || delayDuration === 0) {
			// set wasOpenDelayed based on whether we actually had a delay
			this.#wasOpenDelayed = delayDuration > 0 && shouldSkipDelay;
			this.opts.open.current = true;
		} else {
			// use timer for actual delays
			this.#timerFn.start();
		}
	};

	onTriggerEnter = () => {
		this.#handleDelayedOpen();
	};

	onTriggerLeave = () => {
		if (this.disableHoverableContent) {
			this.handleClose();
		} else {
			this.#timerFn.stop();
		}
	};
}

type TooltipTriggerStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
	}>
>;

class TooltipTriggerState {
	readonly opts: TooltipTriggerStateProps;
	readonly root: TooltipRootState;
	#isPointerDown = box(false);
	#hasPointerMoveOpened = $state(false);
	readonly #isDisabled = $derived.by(() => this.opts.disabled.current || this.root.disabled);
	domContext: DOMContext;

	constructor(opts: TooltipTriggerStateProps, root: TooltipRootState) {
		this.opts = opts;
		this.root = root;
		this.domContext = new DOMContext(opts.ref);
	}

	handlePointerUp = () => {
		this.#isPointerDown.current = false;
	};

	#onpointerup: PointerEventHandler<HTMLElement> = () => {
		if (this.#isDisabled) return;
		this.#isPointerDown.current = false;
	};

	#onpointerdown: PointerEventHandler<HTMLElement> = () => {
		if (this.#isDisabled) return;
		this.#isPointerDown.current = true;

		this.domContext.getDocument().addEventListener(
			"pointerup",
			() => {
				this.handlePointerUp();
			},
			{ once: true }
		);
	};

	#onpointermove: PointerEventHandler<HTMLElement> = (e) => {
		if (this.#isDisabled) return;
		if (e.pointerType === "touch") return;
		if (this.#hasPointerMoveOpened) return;

		if (this.root.provider.isPointerInTransit.current) return;

		this.root.onTriggerEnter();
		this.#hasPointerMoveOpened = true;
	};

	#onpointerleave: PointerEventHandler<HTMLElement> = () => {
		if (this.#isDisabled) return;
		this.root.onTriggerLeave();
		this.#hasPointerMoveOpened = false;
	};

	#onfocus: FocusEventHandler<HTMLElement> = (e) => {
		if (this.#isPointerDown.current || this.#isDisabled) return;

		if (this.root.ignoreNonKeyboardFocus && !isFocusVisible(e.currentTarget)) return;
		this.root.handleOpen();
	};

	#onblur: FocusEventHandler<HTMLElement> = () => {
		if (this.#isDisabled) return;
		this.root.handleClose();
	};

	#onclick: MouseEventHandler<HTMLElement> = () => {
		if (this.root.disableCloseOnTriggerClick || this.#isDisabled) return;
		this.root.handleClose();
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-describedby": this.root.opts.open.current
					? this.root.contentNode?.id
					: undefined,
				"data-state": this.root.stateAttr,
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-delay-duration": `${this.root.delayDuration}`,
				[tooltipAttrs.trigger]: "",
				tabindex: this.#isDisabled ? undefined : 0,
				disabled: this.opts.disabled.current,
				onpointerup: this.#onpointerup,
				onpointerdown: this.#onpointerdown,
				onpointermove: this.#onpointermove,
				onpointerleave: this.#onpointerleave,
				onfocus: this.#onfocus,
				onblur: this.#onblur,
				onclick: this.#onclick,
				...attachRef(this.opts.ref, (v) => (this.root.triggerNode = v)),
			}) as const
	);
}

type TooltipContentStateProps = WithRefProps &
	ReadableBoxedValues<{
		onInteractOutside: (e: PointerEvent) => void;
		onEscapeKeydown: (e: KeyboardEvent) => void;
	}>;

class TooltipContentState {
	readonly opts: TooltipContentStateProps;
	readonly root: TooltipRootState;
	constructor(opts: TooltipContentStateProps, root: TooltipRootState) {
		this.opts = opts;
		this.root = root;

		useGraceArea({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.root.contentNode,
			enabled: () => this.root.opts.open.current && !this.root.disableHoverableContent,
			onPointerExit: () => {
				if (this.root.provider.isTooltipOpen(this.root)) {
					this.root.handleClose();
				}
			},
			setIsPointerInTransit: (value) => {
				this.root.provider.isPointerInTransit.current = value;
			},
			transitTimeout: this.root.provider.opts.skipDelayDuration.current,
		});

		onMountEffect(() =>
			on(window, "scroll", (e) => {
				const target = e.target as HTMLElement | null;
				if (!target) return;
				if (target.contains(this.root.triggerNode)) {
					this.root.handleClose();
				}
			})
		);
	}

	onInteractOutside = (e: PointerEvent) => {
		if (
			isElement(e.target) &&
			this.root.triggerNode?.contains(e.target) &&
			this.root.disableCloseOnTriggerClick
		) {
			e.preventDefault();
			return;
		}
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
				"data-state": this.root.stateAttr,
				"data-disabled": getDataDisabled(this.root.disabled),
				style: {
					pointerEvents: "auto",
					outline: "none",
				},
				[tooltipAttrs.content]: "",
				...attachRef(this.opts.ref, (v) => (this.root.contentNode = v)),
			}) as const
	);

	readonly popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onOpenAutoFocus: this.onOpenAutoFocus,
		onCloseAutoFocus: this.onCloseAutoFocus,
	};
}

//
// CONTEXT METHODS
//

const TooltipProviderContext = new Context<TooltipProviderState>("Tooltip.Provider");
const TooltipRootContext = new Context<TooltipRootState>("Tooltip.Root");

export function useTooltipProvider(props: TooltipProviderStateProps) {
	return TooltipProviderContext.set(new TooltipProviderState(props));
}

export function useTooltipRoot(props: TooltipRootStateProps) {
	return TooltipRootContext.set(new TooltipRootState(props, TooltipProviderContext.get()));
}

export function useTooltipTrigger(props: TooltipTriggerStateProps) {
	return new TooltipTriggerState(props, TooltipRootContext.get());
}

export function useTooltipContent(props: TooltipContentStateProps) {
	return new TooltipContentState(props, TooltipRootContext.get());
}
