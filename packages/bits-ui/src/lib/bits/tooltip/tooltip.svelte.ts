import {
	onMountEffect,
	attachRef,
	DOMContext,
	type WritableBoxedValues,
	type ReadableBoxedValues,
	simpleBox,
	boxWith,
} from "svelte-toolbelt";
import { on } from "svelte/events";
import { Context, watch } from "runed";
import { isElement, isFocusVisible } from "$lib/internal/is.js";
import { createBitsAttrs, boolToEmptyStrOrUndef } from "$lib/internal/attrs.js";
import type { OnChangeFn, RefAttachment, WithRefOpts } from "$lib/internal/types.js";
import type { FocusEventHandler, MouseEventHandler, PointerEventHandler } from "svelte/elements";
import { TimeoutFn } from "$lib/internal/timeout-fn.js";
import { SafePolygon } from "$lib/internal/safe-polygon.svelte.js";
import { PresenceManager } from "$lib/internal/presence-manager.svelte.js";

export const tooltipAttrs = createBitsAttrs({
	component: "tooltip",
	parts: ["content", "trigger"],
});
const TooltipProviderContext = new Context<TooltipProviderState>("Tooltip.Provider");
const TooltipRootContext = new Context<TooltipRootState>("Tooltip.Root");

type TooltipTriggerRecord = {
	id: string;
	node: HTMLElement | null;
	payload: unknown;
	disabled: boolean;
};

class TooltipTriggerRegistryState {
	triggers = $state(new Map<string, TooltipTriggerRecord>());
	activeTriggerId = $state<string | null>(null);
	activeTriggerNode = $derived.by(() => {
		const activeTriggerId = this.activeTriggerId;
		if (activeTriggerId === null) return null;
		return this.triggers.get(activeTriggerId)?.node ?? null;
	});
	activePayload = $derived.by(() => {
		const activeTriggerId = this.activeTriggerId;
		if (activeTriggerId === null) return null;
		return this.triggers.get(activeTriggerId)?.payload ?? null;
	});

	register = (record: TooltipTriggerRecord) => {
		const next = new Map(this.triggers);
		next.set(record.id, record);
		this.triggers = next;
		this.#coerceActiveTrigger();
	};

	update = (record: TooltipTriggerRecord) => {
		const next = new Map(this.triggers);
		next.set(record.id, record);
		this.triggers = next;
		this.#coerceActiveTrigger();
	};

	unregister = (id: string) => {
		if (!this.triggers.has(id)) return;
		const next = new Map(this.triggers);
		next.delete(id);
		this.triggers = next;
		if (this.activeTriggerId === id) {
			this.activeTriggerId = null;
		}
	};

	setActiveTrigger = (id: string | null) => {
		if (id === null) {
			this.activeTriggerId = null;
			return;
		}
		if (!this.triggers.has(id)) {
			this.activeTriggerId = null;
			return;
		}
		this.activeTriggerId = id;
	};

	get = (id: string) => {
		return this.triggers.get(id);
	};

	has = (id: string) => {
		return this.triggers.has(id);
	};

	getFirstTriggerId = () => {
		const firstEntry = this.triggers.entries().next();
		if (firstEntry.done) return null;
		return firstEntry.value[0];
	};

	#coerceActiveTrigger = () => {
		const activeTriggerId = this.activeTriggerId;
		if (activeTriggerId === null) return;
		if (!this.triggers.has(activeTriggerId)) {
			this.activeTriggerId = null;
		}
	};
}

class TooltipTetherState {
	readonly registry = new TooltipTriggerRegistryState();
	root = $state<TooltipRootState | null>(null);
}

// oxlint-disable-next-line no-unused-vars
export class TooltipTether<Payload = never> {
	readonly #state = new TooltipTetherState();

	get state() {
		return this.#state;
	}

	open(triggerId: string) {
		if (!this.#state.registry.has(triggerId)) {
			return;
		}
		this.#state.registry.setActiveTrigger(triggerId);
		this.#state.root?.setActiveTrigger(triggerId);
		this.#state.root?.handleOpen();
	}

	close() {
		this.#state.root?.handleClose();
	}

	get isOpen() {
		return this.#state.root?.opts.open.current ?? false;
	}
}

export function createTooltipTether<Payload = never>() {
	return new TooltipTether<Payload>();
}

interface TooltipProviderStateOpts
	extends ReadableBoxedValues<{
		delayDuration: number;
		disableHoverableContent: boolean;
		disableCloseOnTriggerClick: boolean;
		disabled: boolean;
		ignoreNonKeyboardFocus: boolean;
		skipDelayDuration: number;
	}> {}

export class TooltipProviderState {
	static create(opts: TooltipProviderStateOpts) {
		return TooltipProviderContext.set(new TooltipProviderState(opts));
	}
	readonly opts: TooltipProviderStateOpts;
	isOpenDelayed = $state<boolean>(true);
	isPointerInTransit = simpleBox(false);
	#timerFn: TimeoutFn<() => void>;
	#openTooltip = $state<TooltipRootState | null>(null);

	constructor(opts: TooltipProviderStateOpts) {
		this.opts = opts;
		this.#timerFn = new TimeoutFn(() => {
			this.isOpenDelayed = true;
		}, this.opts.skipDelayDuration.current);

		onMountEffect(() =>
			on(window, "scroll", (e) => {
				const activeTooltip = this.#openTooltip;
				if (!activeTooltip) return;
				const triggerNode = activeTooltip.triggerNode;
				if (!triggerNode) return;

				const target = e.target;
				if (!(target instanceof Element || target instanceof Document)) return;

				if (target.contains(triggerNode)) {
					activeTooltip.handleClose();
				}
			})
		);
	}

	#startTimer = () => {
		const skipDuration = this.opts.skipDelayDuration.current;

		if (skipDuration === 0) {
			// no grace period — reset immediately so next trigger waits the full delay
			this.isOpenDelayed = true;
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

interface TooltipRootStateOpts
	extends ReadableBoxedValues<{
			delayDuration: number | undefined;
			disableHoverableContent: boolean | undefined;
			disableCloseOnTriggerClick: boolean | undefined;
			disabled: boolean | undefined;
			ignoreNonKeyboardFocus: boolean | undefined;
			onOpenChangeComplete: OnChangeFn<boolean>;
			tether: TooltipTether<unknown> | undefined;
		}>,
		WritableBoxedValues<{
			open: boolean;
			triggerId: string | null;
		}> {}

export class TooltipRootState {
	static create(opts: TooltipRootStateOpts) {
		return TooltipRootContext.set(new TooltipRootState(opts, TooltipProviderContext.get()));
	}
	readonly opts: TooltipRootStateOpts;
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
	readonly registry: TooltipTriggerRegistryState;
	readonly tether: TooltipTetherState | null;
	contentNode = $state<HTMLElement | null>(null);
	contentPresence: PresenceManager;
	#wasOpenDelayed = $state(false);
	#timerFn: TimeoutFn<() => void>;
	readonly stateAttr = $derived.by(() => {
		if (!this.opts.open.current) return "closed";
		return this.#wasOpenDelayed ? "delayed-open" : "instant-open";
	});

	constructor(opts: TooltipRootStateOpts, provider: TooltipProviderState) {
		this.opts = opts;
		this.provider = provider;
		this.tether = opts.tether.current?.state ?? null;
		this.registry = this.tether?.registry ?? new TooltipTriggerRegistryState();
		this.#timerFn = new TimeoutFn(() => {
			this.#wasOpenDelayed = true;
			this.opts.open.current = true;
		}, this.delayDuration ?? 0);

		if (this.tether) {
			this.tether.root = this;
			onMountEffect(() => {
				return () => {
					if (this.tether?.root === this) {
						this.tether.root = null;
					}
				};
			});
		}

		this.contentPresence = new PresenceManager({
			open: this.opts.open,
			ref: boxWith(() => this.contentNode),
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
		});

		watch(
			() => this.delayDuration,
			() => {
				if (this.delayDuration === undefined) return;
				this.#timerFn = new TimeoutFn(() => {
					this.#wasOpenDelayed = true;
					this.opts.open.current = true;
				}, this.delayDuration);
			}
		);

		watch(
			() => this.opts.open.current,
			(isOpen) => {
				if (isOpen) {
					this.ensureActiveTrigger();
					this.provider.onOpen(this);
				} else {
					this.provider.onClose(this);
				}
			},
			{ lazy: true }
		);

		watch(
			() => this.opts.triggerId.current,
			(triggerId) => {
				if (triggerId === this.registry.activeTriggerId) return;
				this.registry.setActiveTrigger(triggerId);
			}
		);

		watch(
			() => this.registry.activeTriggerId,
			(activeTriggerId) => {
				if (this.opts.triggerId.current === activeTriggerId) return;
				this.opts.triggerId.current = activeTriggerId;
			}
		);
	}

	handleOpen = () => {
		this.#timerFn.stop();
		this.#wasOpenDelayed = false;
		this.ensureActiveTrigger();
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
			this.#wasOpenDelayed = false;
			this.opts.open.current = true;
		} else {
			// use timer for actual delays
			this.#timerFn.start();
		}
	};

	onTriggerEnter = (triggerId: string) => {
		this.setActiveTrigger(triggerId);
		this.#handleDelayedOpen();
	};

	onTriggerLeave = () => {
		if (this.disableHoverableContent) {
			this.handleClose();
		} else {
			this.#timerFn.stop();
		}
	};

	ensureActiveTrigger = () => {
		if (
			this.registry.activeTriggerId !== null &&
			this.registry.has(this.registry.activeTriggerId)
		) {
			return;
		}

		if (
			this.opts.triggerId.current !== null &&
			this.registry.has(this.opts.triggerId.current)
		) {
			this.registry.setActiveTrigger(this.opts.triggerId.current);
			return;
		}

		const firstTriggerId = this.registry.getFirstTriggerId();
		this.registry.setActiveTrigger(firstTriggerId);
	};

	setActiveTrigger = (triggerId: string | null) => {
		this.registry.setActiveTrigger(triggerId);
	};

	registerTrigger = (trigger: TooltipTriggerRecord) => {
		this.registry.register(trigger);

		if (
			trigger.disabled &&
			this.registry.activeTriggerId === trigger.id &&
			this.opts.open.current
		) {
			this.handleClose();
		}
	};

	updateTrigger = (trigger: TooltipTriggerRecord) => {
		this.registry.update(trigger);

		if (
			trigger.disabled &&
			this.registry.activeTriggerId === trigger.id &&
			this.opts.open.current
		) {
			this.handleClose();
		}
	};

	unregisterTrigger = (id: string) => {
		const isActive = this.registry.activeTriggerId === id;
		this.registry.unregister(id);

		if (isActive && this.opts.open.current) {
			this.handleClose();
		}
	};

	isActiveTrigger = (triggerId: string) => {
		return this.registry.activeTriggerId === triggerId;
	};

	get triggerNode() {
		return this.registry.activeTriggerNode;
	}

	get activePayload() {
		return this.registry.activePayload;
	}

	get activeTriggerId() {
		return this.registry.activeTriggerId;
	}
}

interface TooltipTriggerStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			tabindex: number;
			payload: unknown;
			tether: TooltipTether<unknown> | undefined;
		}> {}

export class TooltipTriggerState {
	static create(opts: TooltipTriggerStateOpts) {
		if (opts.tether.current) {
			return new TooltipTriggerState(opts, null, opts.tether.current.state);
		}
		return new TooltipTriggerState(opts, TooltipRootContext.get(), null);
	}
	readonly opts: TooltipTriggerStateOpts;
	readonly root: TooltipRootState | null;
	readonly tether: TooltipTetherState | null;
	readonly attachment: RefAttachment;
	#isPointerDown = simpleBox(false);
	#hasPointerMoveOpened = $state(false);
	domContext: DOMContext;
	#transitCheckTimeout: number | null = null;
	#mounted = false;
	#lastRegisteredId: string | null = null;

	constructor(
		opts: TooltipTriggerStateOpts,
		root: TooltipRootState | null,
		tether: TooltipTetherState | null
	) {
		this.opts = opts;
		this.root = root;
		this.tether = tether;
		this.domContext = new DOMContext(opts.ref);
		this.attachment = attachRef(this.opts.ref, (v) => this.#register(v));

		watch(
			() => this.opts.id.current,
			() => {
				this.#register(this.opts.ref.current);
			}
		);
		watch(
			() => this.opts.payload.current,
			() => {
				this.#register(this.opts.ref.current);
			}
		);
		watch(
			() => this.opts.disabled.current,
			() => {
				this.#register(this.opts.ref.current);
			}
		);

		onMountEffect(() => {
			this.#mounted = true;
			this.#register(this.opts.ref.current);

			return () => {
				const root = this.#getRoot();
				const id = this.#lastRegisteredId;
				if (id) {
					if (this.tether) {
						this.tether.registry.unregister(id);
					} else {
						root?.unregisterTrigger(id);
					}
				}
				this.#lastRegisteredId = null;
				this.#mounted = false;
			};
		});
	}

	#getRoot = () => {
		return this.tether?.root ?? this.root;
	};

	#isDisabled = () => {
		const root = this.#getRoot();
		return this.opts.disabled.current || Boolean(root?.disabled);
	};

	#register = (node: HTMLElement | null) => {
		if (!this.#mounted) return;
		const id = this.opts.id.current;
		const payload = this.opts.payload.current;
		const disabled = this.opts.disabled.current;

		if (this.#lastRegisteredId && this.#lastRegisteredId !== id) {
			const root = this.#getRoot();
			if (this.tether) {
				this.tether.registry.unregister(this.#lastRegisteredId);
			} else {
				root?.unregisterTrigger(this.#lastRegisteredId);
			}
		}

		const triggerRecord: TooltipTriggerRecord = {
			id,
			node,
			payload,
			disabled,
		};

		const root = this.#getRoot();
		if (this.tether) {
			if (this.tether.registry.has(id)) {
				this.tether.registry.update(triggerRecord);
			} else {
				this.tether.registry.register(triggerRecord);
			}

			if (
				disabled &&
				this.tether.registry.activeTriggerId === id &&
				root?.opts.open.current
			) {
				root.handleClose();
			}
		} else {
			if (root?.registry.has(id)) {
				root.updateTrigger(triggerRecord);
			} else {
				root?.registerTrigger(triggerRecord);
			}
		}

		this.#lastRegisteredId = id;
	};

	#clearTransitCheck = () => {
		if (this.#transitCheckTimeout !== null) {
			clearTimeout(this.#transitCheckTimeout);
			this.#transitCheckTimeout = null;
		}
	};

	handlePointerUp = () => {
		this.#isPointerDown.current = false;
	};

	#onpointerup: PointerEventHandler<HTMLElement> = () => {
		if (this.#isDisabled()) return;
		this.#isPointerDown.current = false;
	};

	#onpointerdown: PointerEventHandler<HTMLElement> = () => {
		if (this.#isDisabled()) return;
		this.#isPointerDown.current = true;

		this.domContext.getDocument().addEventListener(
			"pointerup",
			() => {
				this.handlePointerUp();
			},
			{ once: true }
		);
	};

	#onpointerenter: PointerEventHandler<HTMLElement> = (e) => {
		const root = this.#getRoot();
		if (!root) return;
		if (this.#isDisabled()) {
			if (root.opts.open.current) {
				root.handleClose();
			}
			return;
		}
		if (e.pointerType === "touch") return;

		// if in transit, wait briefly to see if user is actually heading to old content or staying here
		if (root.provider.isPointerInTransit.current) {
			this.#clearTransitCheck();
			this.#transitCheckTimeout = window.setTimeout(() => {
				// if still in transit after delay, user is likely staying on this trigger
				if (root.provider.isPointerInTransit.current) {
					root.provider.isPointerInTransit.current = false;
					root.onTriggerEnter(this.opts.id.current);
					this.#hasPointerMoveOpened = true;
				}
			}, 250);
			return;
		}

		root.onTriggerEnter(this.opts.id.current);
		this.#hasPointerMoveOpened = true;
	};

	#onpointermove: PointerEventHandler<HTMLElement> = (e) => {
		const root = this.#getRoot();
		if (!root) return;
		if (this.#isDisabled()) {
			if (root.opts.open.current) {
				root.handleClose();
			}
			return;
		}
		if (e.pointerType === "touch") return;
		if (this.#hasPointerMoveOpened) return;

		// moving within trigger means we're definitely not in transit anymore
		this.#clearTransitCheck();
		root.provider.isPointerInTransit.current = false;

		root.onTriggerEnter(this.opts.id.current);
		this.#hasPointerMoveOpened = true;
	};

	#onpointerleave: PointerEventHandler<HTMLElement> = (e) => {
		const root = this.#getRoot();
		if (!root) return;
		if (this.#isDisabled()) return;
		this.#clearTransitCheck();
		if (!root.isActiveTrigger(this.opts.id.current)) {
			this.#hasPointerMoveOpened = false;
			return;
		}
		const relatedTarget = e.relatedTarget;

		// when moving to a sibling trigger and skip delay is active, don't close —
		// the sibling's enter handler will switch the active trigger instantly.
		// if skipDelayDuration is 0 there's no grace period, so let the tooltip
		// close and make the sibling wait through the full delay (and re-animate).
		if (isElement(relatedTarget) && root.provider.opts.skipDelayDuration.current > 0) {
			for (const record of root.registry.triggers.values()) {
				if (record.node === relatedTarget) {
					this.#hasPointerMoveOpened = false;
					return;
				}
			}
		}

		root.onTriggerLeave();
		this.#hasPointerMoveOpened = false;
	};

	#onfocus: FocusEventHandler<HTMLElement> = (e) => {
		const root = this.#getRoot();
		if (!root) return;
		if (this.#isPointerDown.current) return;
		if (this.#isDisabled()) {
			if (root.opts.open.current) {
				root.handleClose();
			}
			return;
		}

		if (root.ignoreNonKeyboardFocus && !isFocusVisible(e.currentTarget)) return;
		root.setActiveTrigger(this.opts.id.current);
		root.handleOpen();
	};

	#onblur: FocusEventHandler<HTMLElement> = () => {
		const root = this.#getRoot();
		if (!root || this.#isDisabled()) return;
		root.handleClose();
	};

	#onclick: MouseEventHandler<HTMLElement> = () => {
		const root = this.#getRoot();
		if (!root || root.disableCloseOnTriggerClick || this.#isDisabled()) return;
		root.handleClose();
	};

	readonly props = $derived.by(() => {
		const root = this.#getRoot();
		const isOpenForTrigger = Boolean(
			root?.opts.open.current && root.isActiveTrigger(this.opts.id.current)
		);
		const isDisabled = this.#isDisabled();

		return {
			id: this.opts.id.current,
			"aria-describedby": isOpenForTrigger ? root?.contentNode?.id : undefined,
			"data-state": isOpenForTrigger ? root?.stateAttr : "closed",
			"data-disabled": boolToEmptyStrOrUndef(isDisabled),
			"data-delay-duration": `${root?.delayDuration ?? 0}`,
			[tooltipAttrs.trigger]: "",
			tabindex: isDisabled ? undefined : this.opts.tabindex.current,
			disabled: this.opts.disabled.current,
			onpointerup: this.#onpointerup,
			onpointerdown: this.#onpointerdown,
			onpointerenter: this.#onpointerenter,
			onpointermove: this.#onpointermove,
			onpointerleave: this.#onpointerleave,
			onfocus: this.#onfocus,
			onblur: this.#onblur,
			onclick: this.#onclick,
			...this.attachment,
		} as const;
	});
}

interface TooltipContentStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			onInteractOutside: (e: PointerEvent) => void;
			onEscapeKeydown: (e: KeyboardEvent) => void;
		}> {}

export class TooltipContentState {
	static create(opts: TooltipContentStateOpts) {
		return new TooltipContentState(opts, TooltipRootContext.get());
	}
	readonly opts: TooltipContentStateOpts;
	readonly root: TooltipRootState;
	readonly attachment: RefAttachment;
	constructor(opts: TooltipContentStateOpts, root: TooltipRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.contentNode = v));

		new SafePolygon({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.root.contentNode,
			enabled: () => this.root.opts.open.current && !this.root.disableHoverableContent,
			ignoredTargets: () => {
				// only skip closing for sibling triggers when there's a skip-delay grace period;
				// with skipDelayDuration=0 the close+reopen is intentional (full delay + re-animation)
				if (this.root.provider.opts.skipDelayDuration.current === 0) return [];
				const nodes: HTMLElement[] = [];
				const activeTriggerNode = this.root.triggerNode;
				for (const record of this.root.registry.triggers.values()) {
					if (record.node && record.node !== activeTriggerNode) {
						nodes.push(record.node);
					}
				}
				return nodes;
			},
			onPointerExit: () => {
				if (this.root.provider.isTooltipOpen(this.root)) {
					this.root.handleClose();
				}
			},
		});
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

	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-state": this.root.stateAttr,
				"data-disabled": boolToEmptyStrOrUndef(this.root.disabled),
				style: {
					outline: "none",
				},
				[tooltipAttrs.content]: "",
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
