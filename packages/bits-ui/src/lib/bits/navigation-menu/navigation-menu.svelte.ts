/**
 * Based on Radix UI's Navigation Menu
 * https://www.radix-ui.com/docs/primitives/components/navigation-menu
 */
import {
	type AnyFn,
	type ReadableBox,
	type ReadableBoxedValues,
	type WithRefProps,
	type WritableBox,
	type WritableBoxedValues,
	afterSleep,
	afterTick,
	box,
	attachRef,
	DOMContext,
	getWindow,
} from "svelte-toolbelt";
import { Context, useDebounce, watch } from "runed";
import { untrack, type Snippet } from "svelte";
import { SvelteMap } from "svelte/reactivity";
import { type Direction, type Orientation, useId } from "$lib/shared/index.js";
import {
	createBitsAttrs,
	getAriaExpanded,
	getDataDisabled,
	getDataOpenClosed,
	getDataOrientation,
} from "$lib/internal/attrs.js";
import { noop } from "$lib/internal/noop.js";
import { getTabbableCandidates } from "$lib/internal/focus.js";
import type {
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	RefAttachment,
} from "$lib/internal/types.js";
import { kbd } from "$lib/internal/kbd.js";
import { CustomEventDispatcher } from "$lib/internal/events.js";
import { useArrowNavigation } from "$lib/internal/use-arrow-navigation.js";
import { boxAutoReset } from "$lib/internal/box-auto-reset.svelte.js";
import { isElement } from "$lib/internal/is.js";
import type {
	FocusEventHandler,
	KeyboardEventHandler,
	MouseEventHandler,
	PointerEventHandler,
} from "svelte/elements";
import { RovingFocusGroup } from "$lib/internal/roving-focus-group.js";
import { SvelteResizeObserver } from "$lib/internal/svelte-resize-observer.svelte.js";

const navigationMenuAttrs = createBitsAttrs({
	component: "navigation-menu",
	parts: [
		"root",
		"sub",
		"item",
		"list",
		"trigger",
		"content",
		"link",
		"viewport",
		"menu",
		"indicator",
	],
});

const NavigationMenuProviderContext = new Context<NavigationMenuProviderState>(
	"NavigationMenu.Root"
);
export const NavigationMenuItemContext = new Context<NavigationMenuItemState>(
	"NavigationMenu.Item"
);
const NavigationMenuListContext = new Context<NavigationMenuListState>("NavigationMenu.List");
const NavigationMenuContentContext = new Context<NavigationMenuContentState>(
	"NavigationMenu.Content"
);
const NavigationMenuSubContext = new Context<NavigationMenuSubState>("NavigationMenu.Sub");

interface NavigationMenuProviderStateOpts
	extends ReadableBoxedValues<{
			dir: Direction;
			orientation: Orientation;
		}>,
		WritableBoxedValues<{
			rootNavigationMenuRef: HTMLElement | null;
			value: string;
			previousValue: string;
		}> {
	isRootMenu: boolean;
	onTriggerEnter: (itemValue: string, itemState: NavigationMenuItemState | null) => void;
	onTriggerLeave?: () => void;
	onContentEnter?: () => void;
	onContentLeave?: () => void;
	onItemSelect: (itemValue: string, itemState: NavigationMenuItemState | null) => void;
	onItemDismiss: () => void;
}

class NavigationMenuProviderState {
	static create(opts: NavigationMenuProviderStateOpts) {
		return NavigationMenuProviderContext.set(new NavigationMenuProviderState(opts));
	}
	readonly opts: NavigationMenuProviderStateOpts;
	indicatorTrackRef = box<HTMLElement | null>(null);
	viewportRef = box<HTMLElement | null>(null);
	viewportContent = new SvelteMap<string, NavigationMenuItemState>();
	onTriggerEnter: NavigationMenuProviderStateOpts["onTriggerEnter"];
	onTriggerLeave: () => void = noop;
	onContentEnter: () => void = noop;
	onContentLeave: () => void = noop;
	onItemSelect: NavigationMenuProviderStateOpts["onItemSelect"];
	onItemDismiss: NavigationMenuProviderStateOpts["onItemDismiss"];
	activeItem: NavigationMenuItemState | null = null;
	prevActiveItem: NavigationMenuItemState | null = null;

	constructor(opts: NavigationMenuProviderStateOpts) {
		this.opts = opts;
		this.onTriggerEnter = opts.onTriggerEnter;
		this.onTriggerLeave = opts.onTriggerLeave ?? noop;
		this.onContentEnter = opts.onContentEnter ?? noop;
		this.onContentLeave = opts.onContentLeave ?? noop;
		this.onItemDismiss = opts.onItemDismiss;
		this.onItemSelect = opts.onItemSelect;
	}

	setActiveItem = (item: NavigationMenuItemState | null) => {
		this.prevActiveItem = this.activeItem;
		this.activeItem = item;
	};
}

interface NavigationMenuRootStateOpts
	extends WithRefProps,
		WritableBoxedValues<{
			value: string;
		}>,
		ReadableBoxedValues<{
			dir: Direction;
			orientation: Orientation;
			delayDuration: number;
			skipDelayDuration: number;
		}> {}
export class NavigationMenuRootState {
	static create(opts: NavigationMenuRootStateOpts) {
		return new NavigationMenuRootState(opts);
	}
	readonly opts: NavigationMenuRootStateOpts;
	readonly attachment: RefAttachment;
	provider: NavigationMenuProviderState;
	previousValue = box("");
	isDelaySkipped: WritableBox<boolean>;
	readonly #derivedDelay = $derived.by(() => {
		const isOpen = this.opts?.value?.current !== "";
		if (isOpen || this.isDelaySkipped.current) {
			// 150 for user to switch trigger or move into content view
			return 100;
		} else {
			return this.opts.delayDuration.current;
		}
	});

	constructor(opts: NavigationMenuRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		this.isDelaySkipped = boxAutoReset(false, {
			afterMs: this.opts.skipDelayDuration.current,
			getWindow: () => getWindow(opts.ref.current),
		});

		this.provider = NavigationMenuProviderState.create({
			value: this.opts.value,
			previousValue: this.previousValue,
			dir: this.opts.dir,
			orientation: this.opts.orientation,
			rootNavigationMenuRef: this.opts.ref,
			isRootMenu: true,
			onTriggerEnter: (itemValue, itemState) => {
				this.#onTriggerEnter(itemValue, itemState);
			},
			onTriggerLeave: this.#onTriggerLeave,
			onContentEnter: this.#onContentEnter,
			onContentLeave: this.#onContentLeave,
			onItemSelect: this.#onItemSelect,
			onItemDismiss: this.#onItemDismiss,
		});
	}

	#debouncedFn = useDebounce(
		(val: string | undefined, itemState: NavigationMenuItemState | null) => {
			// passing `undefined` meant to reset the debounce timer
			if (typeof val === "string") {
				this.setValue(val, itemState);
			}
		},
		() => this.#derivedDelay
	);

	#onTriggerEnter = (itemValue: string, itemState: NavigationMenuItemState | null) => {
		this.#debouncedFn(itemValue, itemState);
	};

	#onTriggerLeave = () => {
		this.isDelaySkipped.current = false;
		this.#debouncedFn("", null);
	};

	#onContentEnter = () => {
		this.#debouncedFn(undefined, null);
	};

	#onContentLeave = () => {
		if (
			this.provider.activeItem &&
			this.provider.activeItem.opts.openOnHover.current === false
		) {
			return;
		}
		this.#debouncedFn("", null);
	};

	#onItemSelect = (itemValue: string, itemState: NavigationMenuItemState | null) => {
		this.setValue(itemValue, itemState);
	};

	#onItemDismiss = () => {
		this.setValue("", null);
	};

	setValue = (newValue: string, itemState: NavigationMenuItemState | null) => {
		this.previousValue.current = this.opts.value.current;
		this.opts.value.current = newValue;
		this.provider.setActiveItem(itemState);

		// When all menus are closed, we want to reset previousValue to prevent
		// weird transitions from old positions when opening fresh
		if (newValue === "") {
			this.previousValue.current = "";
		}
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				dir: this.opts.dir.current,
				[navigationMenuAttrs.root]: "",
				[navigationMenuAttrs.menu]: "",
				...this.attachment,
			}) as const
	);
}

interface NavigationMenuSubStateOpts
	extends WithRefProps,
		WritableBoxedValues<{
			value: string;
		}>,
		ReadableBoxedValues<{
			orientation: Orientation;
		}> {}

export class NavigationMenuSubState {
	static create(opts: NavigationMenuSubStateOpts) {
		return new NavigationMenuSubState(opts, NavigationMenuProviderContext.get());
	}
	readonly opts: NavigationMenuSubStateOpts;
	readonly context: NavigationMenuProviderState;
	previousValue = box("");
	readonly subProvider: NavigationMenuProviderState;
	readonly attachment: RefAttachment;

	constructor(opts: NavigationMenuSubStateOpts, context: NavigationMenuProviderState) {
		this.opts = opts;
		this.context = context;
		this.attachment = attachRef(this.opts.ref);

		this.subProvider = NavigationMenuProviderState.create({
			isRootMenu: false,
			value: this.opts.value,
			dir: this.context.opts.dir,
			orientation: this.opts.orientation,
			rootNavigationMenuRef: this.opts.ref,
			onTriggerEnter: this.setValue,
			onItemSelect: this.setValue,
			onItemDismiss: () => this.setValue("", null),
			previousValue: this.previousValue,
		});
	}

	setValue = (newValue: string, itemState: NavigationMenuItemState | null) => {
		this.previousValue.current = this.opts.value.current;
		this.opts.value.current = newValue;
		this.subProvider.setActiveItem(itemState);

		// When all menus are closed, we want to reset previousValue to prevent
		// weird transitions from old positions when opening fresh
		if (newValue === "") {
			this.previousValue.current = "";
		}
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				[navigationMenuAttrs.sub]: "",
				[navigationMenuAttrs.menu]: "",
				...this.attachment,
			}) as const
	);
}

interface NavigationMenuListStateOpts extends WithRefProps {}

export class NavigationMenuListState {
	static create(opts: NavigationMenuListStateOpts) {
		return NavigationMenuListContext.set(
			new NavigationMenuListState(opts, NavigationMenuProviderContext.get())
		);
	}
	wrapperId = box(useId());
	wrapperRef = box<HTMLElement | null>(null);
	readonly opts: NavigationMenuListStateOpts;
	readonly context: NavigationMenuProviderState;
	readonly attachment: RefAttachment;
	readonly wrapperAttachment: RefAttachment = attachRef(
		this.wrapperRef,
		(v) => (this.context.indicatorTrackRef.current = v)
	);
	listTriggers = $state.raw<HTMLElement[]>([]);
	readonly rovingFocusGroup: RovingFocusGroup;
	wrapperMounted = $state(false);

	constructor(opts: NavigationMenuListStateOpts, context: NavigationMenuProviderState) {
		this.opts = opts;
		this.context = context;
		this.attachment = attachRef(this.opts.ref);
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNode: opts.ref,
			candidateSelector: `${navigationMenuAttrs.selector("trigger")}:not([data-disabled]), ${navigationMenuAttrs.selector("link")}:not([data-disabled])`,
			loop: box.with(() => false),
			orientation: this.context.opts.orientation,
		});
	}

	registerTrigger(trigger: HTMLElement | null) {
		if (trigger) this.listTriggers.push(trigger);
		return () => {
			this.listTriggers = this.listTriggers.filter((t) => t.id !== trigger!.id);
		};
	}

	readonly wrapperProps = $derived.by(
		() =>
			({
				id: this.wrapperId.current,
				...this.wrapperAttachment,
			}) as const
	);

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.context.opts.orientation.current),
				[navigationMenuAttrs.list]: "",
				...this.attachment,
			}) as const
	);
}

interface NavigationMenuItemStateOpts
	extends WithRefProps,
		ReadableBoxedValues<{
			value: string;
			openOnHover: boolean;
		}> {}

export class NavigationMenuItemState {
	static create(opts: NavigationMenuItemStateOpts) {
		return NavigationMenuItemContext.set(
			new NavigationMenuItemState(opts, NavigationMenuListContext.get())
		);
	}
	readonly opts: NavigationMenuItemStateOpts;
	readonly attachment: RefAttachment;
	readonly listContext: NavigationMenuListState;
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	focusProxyNode = $state<HTMLElement | null>(null);
	restoreContentTabOrder: AnyFn = noop;
	wasEscapeClose = false;
	readonly contentId = $derived.by(() => this.contentNode?.id);
	readonly triggerId = $derived.by(() => this.triggerNode?.id);
	contentChildren: ReadableBox<Snippet | undefined> = box(undefined);
	contentChild: ReadableBox<Snippet<[{ props: Record<string, unknown> }]> | undefined> =
		box(undefined);
	contentProps: ReadableBox<Record<string, unknown>> = box({});
	domContext: DOMContext;
	constructor(opts: NavigationMenuItemStateOpts, listContext: NavigationMenuListState) {
		this.opts = opts;
		this.listContext = listContext;
		this.domContext = new DOMContext(opts.ref);
		this.attachment = attachRef(this.opts.ref);
	}

	#handleContentEntry = (side: "start" | "end" = "start") => {
		if (!this.contentNode) return;
		this.restoreContentTabOrder();
		const candidates = getTabbableCandidates(this.contentNode);
		if (candidates.length)
			focusFirst(side === "start" ? candidates : candidates.reverse(), () =>
				this.domContext.getActiveElement()
			);
	};

	#handleContentExit = () => {
		if (!this.contentNode) return;
		const candidates = getTabbableCandidates(this.contentNode);
		if (candidates.length) this.restoreContentTabOrder = removeFromTabOrder(candidates);
	};

	onEntryKeydown = this.#handleContentEntry;
	onFocusProxyEnter = this.#handleContentEntry;
	onRootContentClose = this.#handleContentExit;
	onContentFocusOutside = this.#handleContentExit;

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[navigationMenuAttrs.item]: "",
				...this.attachment,
			}) as const
	);
}

interface NavigationMenuTriggerStateOpts
	extends WithRefProps,
		ReadableBoxedValues<{
			disabled: boolean | null | undefined;
		}> {}

export class NavigationMenuTriggerState {
	static create(opts: NavigationMenuTriggerStateOpts) {
		return new NavigationMenuTriggerState(opts, {
			provider: NavigationMenuProviderContext.get(),
			item: NavigationMenuItemContext.get(),
			list: NavigationMenuListContext.get(),
			sub: NavigationMenuSubContext.getOr(null),
		});
	}
	readonly opts: NavigationMenuTriggerStateOpts;
	readonly attachment: RefAttachment;
	focusProxyId = box(useId());
	focusProxyRef = box<HTMLElement | null>(null);
	readonly focusProxyAttachment: RefAttachment = attachRef(
		this.focusProxyRef,
		(v) => (this.itemContext.focusProxyNode = v)
	);
	context: NavigationMenuProviderState;
	itemContext: NavigationMenuItemState;
	listContext: NavigationMenuListState;
	hasPointerMoveOpened = box(false);
	wasClickClose = false;
	focusProxyMounted = $state(false);
	readonly open = $derived.by(
		() => this.itemContext.opts.value.current === this.context.opts.value.current
	);

	constructor(
		opts: NavigationMenuTriggerStateOpts,
		context: {
			provider: NavigationMenuProviderState;
			item: NavigationMenuItemState;
			list: NavigationMenuListState;
			sub: NavigationMenuSubState | null;
		}
	) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref, (v) => (this.itemContext.triggerNode = v));
		this.hasPointerMoveOpened = boxAutoReset(false, {
			afterMs: 300,
			getWindow: () => getWindow(opts.ref.current),
		});
		this.context = context.provider;
		this.itemContext = context.item;
		this.listContext = context.list;

		watch(
			() => this.opts.ref.current,
			() => {
				const node = this.opts.ref.current;
				if (!node) return;
				return this.listContext.registerTrigger(node);
			}
		);
	}

	onpointerenter = (_: BitsPointerEvent<HTMLButtonElement>) => {
		this.wasClickClose = false;
		this.itemContext.wasEscapeClose = false;
	};

	onpointermove = whenMouse(() => {
		if (
			this.opts.disabled.current ||
			this.wasClickClose ||
			this.itemContext.wasEscapeClose ||
			this.hasPointerMoveOpened.current ||
			!this.itemContext.opts.openOnHover.current
		) {
			return;
		}
		this.context.onTriggerEnter(this.itemContext.opts.value.current, this.itemContext);
		this.hasPointerMoveOpened.current = true;
	});

	onpointerleave = whenMouse(() => {
		if (this.opts.disabled.current || !this.itemContext.opts.openOnHover.current) return;
		this.context.onTriggerLeave();
		this.hasPointerMoveOpened.current = false;
	});

	onclick: MouseEventHandler<HTMLButtonElement> = () => {
		// if opened via pointer move, we prevent the click event
		if (this.hasPointerMoveOpened.current) return;
		const shouldClose =
			this.open &&
			(!this.itemContext.opts.openOnHover.current || this.context.opts.isRootMenu);
		if (shouldClose) {
			this.context.onItemSelect("", null);
		} else if (!this.open) {
			this.context.onItemSelect(this.itemContext.opts.value.current, this.itemContext);
		}
		this.wasClickClose = shouldClose;
	};

	onkeydown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
		const verticalEntryKey =
			this.context.opts.dir.current === "rtl" ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT;
		const entryKey = { horizontal: kbd.ARROW_DOWN, vertical: verticalEntryKey }[
			this.context.opts.orientation.current
		];
		if (this.open && e.key === entryKey) {
			this.itemContext.onEntryKeydown();
			// prevent focus group from handling the event
			e.preventDefault();
			return;
		}
		this.itemContext.listContext.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	};

	focusProxyOnFocus: FocusEventHandler<HTMLElement> = (e) => {
		const content = this.itemContext.contentNode;
		const prevFocusedElement = e.relatedTarget as HTMLElement | null;
		const wasTriggerFocused =
			this.opts.ref.current && prevFocusedElement === this.opts.ref.current;
		const wasFocusFromContent = content?.contains(prevFocusedElement);

		if (wasTriggerFocused || !wasFocusFromContent) {
			this.itemContext.onFocusProxyEnter(wasTriggerFocused ? "start" : "end");
		}
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.opts.disabled.current,
				"data-disabled": getDataDisabled(Boolean(this.opts.disabled.current)),
				"data-state": getDataOpenClosed(this.open),
				"data-value": this.itemContext.opts.value.current,
				"aria-expanded": getAriaExpanded(this.open),
				"aria-controls": this.itemContext.contentId,
				[navigationMenuAttrs.trigger]: "",
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				onpointerenter: this.onpointerenter,
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const
	);

	readonly focusProxyProps = $derived.by(
		() =>
			({
				id: this.focusProxyId.current,
				tabindex: 0,
				onfocus: this.focusProxyOnFocus,
				...this.focusProxyAttachment,
			}) as const
	);
}

interface NavigationMenuLinkStateOpts
	extends WithRefProps,
		ReadableBoxedValues<{
			active: boolean;
			onSelect: (e: Event) => void;
		}> {}

const LINK_SELECT_EVENT = new CustomEventDispatcher("bitsLinkSelect", {
	bubbles: true,
	cancelable: true,
});

const ROOT_CONTENT_DISMISS_EVENT = new CustomEventDispatcher("bitsRootContentDismiss", {
	cancelable: true,
	bubbles: true,
});

export class NavigationMenuLinkState {
	static create(opts: NavigationMenuLinkStateOpts) {
		return new NavigationMenuLinkState(opts, {
			provider: NavigationMenuProviderContext.get(),
			item: NavigationMenuItemContext.get(),
		});
	}
	readonly opts: NavigationMenuLinkStateOpts;
	readonly context: { provider: NavigationMenuProviderState; item: NavigationMenuItemState };
	readonly attachment: RefAttachment;
	isFocused = $state(false);

	constructor(
		opts: NavigationMenuLinkStateOpts,
		context: { provider: NavigationMenuProviderState; item: NavigationMenuItemState }
	) {
		this.opts = opts;
		this.context = context;
		this.attachment = attachRef(this.opts.ref);
	}

	onclick = (e: BitsMouseEvent<HTMLAnchorElement>) => {
		const currTarget = e.currentTarget;

		LINK_SELECT_EVENT.listen(currTarget, (e) => this.opts.onSelect.current(e), { once: true });
		const linkSelectEvent = LINK_SELECT_EVENT.dispatch(currTarget);

		if (!linkSelectEvent.defaultPrevented && !e.metaKey) {
			ROOT_CONTENT_DISMISS_EVENT.dispatch(currTarget);
		}
	};

	onkeydown = (e: BitsKeyboardEvent) => {
		if (this.context.item.contentNode) return;
		this.context.item.listContext.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	};

	onfocus = (_: BitsFocusEvent) => {
		this.isFocused = true;
	};

	onblur = (_: BitsFocusEvent) => {
		this.isFocused = false;
	};

	#handlePointerDismiss = () => {
		// only close submenu if this link is not inside the currently open submenu content
		const currentlyOpenValue = this.context.provider.opts.value.current;
		const isInsideOpenSubmenu = this.context.item.opts.value.current === currentlyOpenValue;
		const activeItem = this.context.item.listContext.context.activeItem;
		if (activeItem && !activeItem.opts.openOnHover.current) return;
		if (currentlyOpenValue && !isInsideOpenSubmenu) {
			this.context.provider.onItemDismiss();
		}
	};

	onpointerenter: PointerEventHandler<HTMLAnchorElement> = () => {
		this.#handlePointerDismiss();
	};

	onpointermove = whenMouse(() => {
		this.#handlePointerDismiss();
	});

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-active": this.opts.active.current ? "" : undefined,
				"aria-current": this.opts.active.current ? "page" : undefined,
				"data-focused": this.isFocused ? "" : undefined,
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				onfocus: this.onfocus,
				onblur: this.onblur,
				onpointerenter: this.onpointerenter,
				onpointermove: this.onpointermove,
				[navigationMenuAttrs.link]: "",
				...this.attachment,
			}) as const
	);
}

interface NavigationMenuIndicatorStateOpts extends WithRefProps {}

export class NavigationMenuIndicatorState {
	static create() {
		return new NavigationMenuIndicatorState(NavigationMenuProviderContext.get());
	}
	readonly context: NavigationMenuProviderState;
	readonly isVisible = $derived.by(() => Boolean(this.context.opts.value.current));

	constructor(context: NavigationMenuProviderState) {
		this.context = context;
	}
}

export class NavigationMenuIndicatorImplState {
	static create(opts: NavigationMenuIndicatorStateOpts) {
		return new NavigationMenuIndicatorImplState(opts, {
			provider: NavigationMenuProviderContext.get(),
			list: NavigationMenuListContext.get(),
		});
	}
	readonly opts: NavigationMenuIndicatorStateOpts;
	readonly attachment: RefAttachment;
	context: NavigationMenuProviderState;
	listContext: NavigationMenuListState;
	position = $state.raw<{ size: number; offset: number } | null>(null);
	readonly isHorizontal = $derived.by(
		() => this.context.opts.orientation.current === "horizontal"
	);
	readonly isVisible = $derived.by(() => !!this.context.opts.value.current);
	readonly activeTrigger = $derived.by(() => {
		const items = this.listContext.listTriggers;
		const triggerNode = items.find(
			(item) => item.getAttribute("data-value") === this.context.opts.value.current
		);
		return triggerNode ?? null;
	});
	readonly shouldRender = $derived.by(() => this.position !== null);

	constructor(
		opts: NavigationMenuIndicatorStateOpts,
		context: {
			provider: NavigationMenuProviderState;
			list: NavigationMenuListState;
		}
	) {
		this.opts = opts;
		this.context = context.provider;
		this.listContext = context.list;
		this.attachment = attachRef(this.opts.ref);

		new SvelteResizeObserver(() => this.activeTrigger, this.handlePositionChange);
		new SvelteResizeObserver(
			() => this.context.indicatorTrackRef.current,
			this.handlePositionChange
		);
	}

	handlePositionChange = () => {
		if (!this.activeTrigger) return;
		this.position = {
			size: this.isHorizontal
				? this.activeTrigger.offsetWidth
				: this.activeTrigger.offsetHeight,
			offset: this.isHorizontal
				? this.activeTrigger.offsetLeft
				: this.activeTrigger.offsetTop,
		};
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-state": this.isVisible ? "visible" : "hidden",
				"data-orientation": getDataOrientation(this.context.opts.orientation.current),
				style: {
					position: "absolute",
					...(this.isHorizontal
						? {
								left: 0,
								width: `${this.position?.size}px`,
								transform: `translateX(${this.position?.offset}px)`,
							}
						: {
								top: 0,
								height: `${this.position?.size}px`,
								transform: `translateY(${this.position?.offset}px)`,
							}),
				},
				[navigationMenuAttrs.indicator]: "",
				...this.attachment,
			}) as const
	);
}

interface NavigationMenuContentStateOpts extends WithRefProps {}

export class NavigationMenuContentState {
	static create(opts: NavigationMenuContentStateOpts) {
		return NavigationMenuContentContext.set(
			new NavigationMenuContentState(opts, {
				provider: NavigationMenuProviderContext.get(),
				item: NavigationMenuItemContext.get(),
				list: NavigationMenuListContext.get(),
			})
		);
	}
	readonly opts: NavigationMenuContentStateOpts;
	readonly context: NavigationMenuProviderState;
	readonly itemContext: NavigationMenuItemState;
	readonly listContext: NavigationMenuListState;
	readonly attachment: RefAttachment;
	mounted = $state(false);
	readonly open = $derived.by(
		() => this.itemContext.opts.value.current === this.context.opts.value.current
	);
	readonly value = $derived.by(() => this.itemContext.opts.value.current);
	// We persist the last active content value as the viewport may be animating out
	// and we want the content to remain mounted for the lifecycle of the viewport.
	readonly isLastActiveValue = $derived.by(() => {
		if (this.context.viewportRef.current) {
			if (!this.context.opts.value.current && this.context.opts.previousValue.current) {
				return (
					this.context.opts.previousValue.current === this.itemContext.opts.value.current
				);
			}
		}
		return false;
	});

	constructor(
		opts: NavigationMenuContentStateOpts,
		context: {
			provider: NavigationMenuProviderState;
			item: NavigationMenuItemState;
			list: NavigationMenuListState;
		}
	) {
		this.opts = opts;
		this.context = context.provider;
		this.itemContext = context.item;
		this.listContext = context.list;
		this.attachment = attachRef(this.opts.ref, (v) => (this.itemContext.contentNode = v));
	}

	onpointerenter = (_: BitsPointerEvent) => {
		this.context.onContentEnter();
	};

	onpointerleave = whenMouse(() => {
		if (!this.itemContext.opts.openOnHover.current) return;
		this.context.onContentLeave();
	});

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				onpointerenter: this.onpointerenter,
				onpointerleave: this.onpointerleave,
				...this.attachment,
			}) as const
	);
}

type MotionAttribute = "to-start" | "to-end" | "from-start" | "from-end";
interface NavigationMenuContentImplStateOpts extends WithRefProps {}

export class NavigationMenuContentImplState {
	static create(opts: NavigationMenuContentImplStateOpts, itemState?: NavigationMenuItemState) {
		return new NavigationMenuContentImplState(
			opts,
			itemState ?? NavigationMenuItemContext.get()
		);
	}
	readonly opts: NavigationMenuContentImplStateOpts;
	readonly itemContext: NavigationMenuItemState;
	readonly context: NavigationMenuProviderState;
	readonly listContext: NavigationMenuListState;
	readonly attachment: RefAttachment;
	prevMotionAttribute: MotionAttribute | null = $state(null);
	readonly motionAttribute: MotionAttribute | null = $derived.by(() => {
		const items = this.listContext.listTriggers;
		const values = items.map((item) => item.getAttribute("data-value")).filter(Boolean);
		if (this.context.opts.dir.current === "rtl") values.reverse();
		const index = values.indexOf(this.context.opts.value.current);
		const prevIndex = values.indexOf(this.context.opts.previousValue.current);
		const isSelected = this.itemContext.opts.value.current === this.context.opts.value.current;
		const wasSelected = prevIndex === values.indexOf(this.itemContext.opts.value.current);

		// When all menus are closed, we want to reset motion state to prevent residual animations
		if (!this.context.opts.value.current && !this.context.opts.previousValue.current) {
			untrack(() => (this.prevMotionAttribute = null));
			return null;
		}

		// We only want to update selected and the last selected content
		// this avoids animations being interrupted outside of that range
		if (!isSelected && !wasSelected) return untrack(() => this.prevMotionAttribute);

		const attribute = (() => {
			// Don't provide a direction on the initial open
			if (index !== prevIndex) {
				// If we're moving to this item from another
				if (isSelected && prevIndex !== -1)
					return index > prevIndex ? "from-end" : "from-start";
				// If we're leaving this item for another
				if (wasSelected && index !== -1) return index > prevIndex ? "to-start" : "to-end";
			}
			// Otherwise we're entering from closed or leaving the list
			// entirely and should not animate in any direction
			return null;
		})();

		untrack(() => (this.prevMotionAttribute = attribute));
		return attribute;
	});
	domContext: DOMContext;

	constructor(opts: NavigationMenuContentImplStateOpts, itemContext: NavigationMenuItemState) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		this.itemContext = itemContext;
		this.listContext = itemContext.listContext;
		this.context = itemContext.listContext.context;
		this.domContext = new DOMContext(opts.ref);

		watch(
			[
				() => this.itemContext.opts.value.current,
				() => this.itemContext.triggerNode,
				() => this.opts.ref.current,
			],
			() => {
				const content = this.opts.ref.current;
				if (!(content && this.context.opts.isRootMenu)) return;

				const handleClose = () => {
					this.context.onItemDismiss();
					this.itemContext.onRootContentClose();
					if (content.contains(this.domContext.getActiveElement())) {
						this.itemContext.triggerNode?.focus();
					}
				};
				const removeListener = ROOT_CONTENT_DISMISS_EVENT.listen(content, handleClose);

				return () => {
					removeListener();
				};
			}
		);
	}

	onFocusOutside = (e: Event) => {
		this.itemContext.onContentFocusOutside();
		const target = e.target as HTMLElement;
		// only dismiss content when focus moves outside of the menu
		if (this.context.opts.rootNavigationMenuRef.current?.contains(target)) {
			e.preventDefault();
			return;
		}
		this.context.onItemDismiss();
	};

	onInteractOutside = (e: PointerEvent) => {
		const target = e.target as HTMLElement;
		const isTrigger = this.listContext.listTriggers.some((trigger) => trigger.contains(target));
		const isRootViewport =
			this.context.opts.isRootMenu && this.context.viewportRef.current?.contains(target);
		if (!this.context.opts.isRootMenu && !isTrigger) {
			this.context.onItemDismiss();
			return;
		}
		if (isTrigger || isRootViewport) {
			e.preventDefault();
			return;
		}
		if (!this.itemContext.opts.openOnHover.current) {
			this.context.onItemSelect("", null);
		}
	};

	onkeydown = (e: BitsKeyboardEvent) => {
		// prevent parent menus handling sub-menu keydown events
		const target = e.target;
		if (!isElement(target)) return;
		if (
			target.closest(navigationMenuAttrs.selector("menu")) !==
			this.context.opts.rootNavigationMenuRef.current
		)
			return;

		const isMetaKey = e.altKey || e.ctrlKey || e.metaKey;
		const isTabKey = e.key === kbd.TAB && !isMetaKey;
		const candidates = getTabbableCandidates(e.currentTarget);

		if (isTabKey) {
			const focusedElement = this.domContext.getActiveElement();
			const index = candidates.findIndex((candidate) => candidate === focusedElement);
			const isMovingBackwards = e.shiftKey;
			const nextCandidates = isMovingBackwards
				? candidates.slice(0, index).reverse()
				: candidates.slice(index + 1, candidates.length);
			if (focusFirst(nextCandidates, () => this.domContext.getActiveElement())) {
				// prevent browser tab keydown because we've handled focus
				e.preventDefault();
				return;
			} else {
				// If we can't focus that means we're at the edges
				// so focus the proxy and let browser handle
				// tab/shift+tab keypress on the proxy instead
				handleProxyFocus(this.itemContext.focusProxyNode);
				return;
			}
		}

		let activeEl: HTMLElement = this.domContext.getActiveElement() as HTMLElement;

		if (this.itemContext.contentNode) {
			const focusedNode =
				this.itemContext.contentNode.querySelector<HTMLElement>("[data-focused]");
			if (focusedNode) {
				activeEl = focusedNode;
			}
		}

		if (activeEl === this.itemContext.triggerNode) return;

		const newSelectedElement = useArrowNavigation(e, activeEl, undefined, {
			itemsArray: candidates,
			candidateSelector: navigationMenuAttrs.selector("link"),
			loop: false,
			enableIgnoredElement: true,
		});

		newSelectedElement?.focus();
	};

	onEscapeKeydown = (_: KeyboardEvent) => {
		this.context.onItemDismiss();
		this.itemContext.triggerNode?.focus();
		// prevent the dropdown from reopening after the escape key has been pressed
		this.itemContext.wasEscapeClose = true;
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-labelledby": this.itemContext.triggerId,
				"data-motion": this.motionAttribute ?? undefined,
				"data-orientation": getDataOrientation(this.context.opts.orientation.current),
				"data-state": getDataOpenClosed(
					this.context.opts.value.current === this.itemContext.opts.value.current
				),
				onkeydown: this.onkeydown,
				[navigationMenuAttrs.content]: "",
				...this.attachment,
			}) as const
	);
}

interface NavigationMenuViewportStateOpts extends WithRefProps {}

export class NavigationMenuViewportState {
	static create(opts: NavigationMenuViewportStateOpts) {
		return new NavigationMenuViewportState(opts, NavigationMenuProviderContext.get());
	}
	readonly opts: NavigationMenuViewportStateOpts;
	readonly context: NavigationMenuProviderState;
	readonly attachment: RefAttachment;
	readonly open = $derived.by(() => !!this.context.opts.value.current);
	readonly viewportWidth = $derived.by(() => (this.size ? `${this.size.width}px` : undefined));
	readonly viewportHeight = $derived.by(() => (this.size ? `${this.size.height}px` : undefined));
	readonly activeContentValue = $derived.by(() => this.context.opts.value.current);
	size = $state<{ width: number; height: number } | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	mounted = $state(false);

	constructor(opts: NavigationMenuViewportStateOpts, context: NavigationMenuProviderState) {
		this.opts = opts;
		this.context = context;
		this.attachment = attachRef(this.opts.ref, (v) => (this.context.viewportRef.current = v));

		watch([() => this.activeContentValue, () => this.open], () => {
			afterTick(() => {
				const currNode = this.context.viewportRef.current;
				if (!currNode) return;
				const el =
					(currNode.querySelector<HTMLElement>("[data-state=open]")
						?.children?.[0] as HTMLElement | null) ?? null;

				this.contentNode = el;
			});
		});

		/**
		 * Update viewport size to match the active content node.
		 * We prefer offset dimensions over `getBoundingClientRect` as the latter respects CSS transform.
		 * For example, if content animates in from `scale(0.5)` the dimensions would be anything
		 * from `0.5` to `1` of the intended size.
		 */
		new SvelteResizeObserver(
			() => this.contentNode,
			() => {
				if (this.contentNode) {
					this.size = {
						width: this.contentNode.offsetWidth,
						height: this.contentNode.offsetHeight,
					};
				}
			}
		);

		// reset size when viewport closes to prevent residual size animations
		watch(
			() => this.mounted,
			() => {
				if (!this.mounted && this.size) {
					this.size = null;
				}
			}
		);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-state": getDataOpenClosed(this.open),
				"data-orientation": getDataOrientation(this.context.opts.orientation.current),
				style: {
					pointerEvents: !this.open && this.context.opts.isRootMenu ? "none" : undefined,
					"--bits-navigation-menu-viewport-width": this.viewportWidth,
					"--bits-navigation-menu-viewport-height": this.viewportHeight,
				},
				[navigationMenuAttrs.viewport]: "",
				onpointerenter: this.context.onContentEnter,
				onpointerleave: this.context.onContentLeave,
				...this.attachment,
			}) as const
	);
}

//

function focusFirst(candidates: HTMLElement[], getActiveElement: () => HTMLElement | null) {
	const previouslyFocusedElement = getActiveElement();
	return candidates.some((candidate) => {
		// if focus is already where we want to go, we don't want to keep going through the candidates
		if (candidate === previouslyFocusedElement) return true;
		candidate.focus();
		return getActiveElement() !== previouslyFocusedElement;
	});
}

function removeFromTabOrder(candidates: HTMLElement[]) {
	candidates.forEach((candidate) => {
		candidate.dataset.tabindex = candidate.getAttribute("tabindex") || "";
		candidate.setAttribute("tabindex", "-1");
	});
	return () => {
		candidates.forEach((candidate) => {
			const prevTabIndex = candidate.dataset.tabindex as string;
			candidate.setAttribute("tabindex", prevTabIndex);
		});
	};
}

function whenMouse<T extends HTMLElement = HTMLElement>(
	handler: PointerEventHandler<T>
): PointerEventHandler<T> {
	return (e) => (e.pointerType === "mouse" ? handler(e) : undefined);
}

/**
 *
 * We apply the `aria-hidden` attribute to elements that should not be visible to screen readers
 * under specific circumstances, mostly when in a "modal" context or when they are strictly for
 * utility purposes, like the focus guards.
 *
 * When these elements receive focus before we can remove the aria-hidden attribute, we need to
 * handle the focus in a way that does not cause an error to be logged.
 *
 * This function handles the focus of the guard element first by momentary removing the
 * `aria-hidden` attribute, focusing the guard (which will cause something else to focus), and then
 * restoring the attribute.
 */
function handleProxyFocus(
	guard: HTMLElement | null,
	focusOptions?: Parameters<HTMLElement["focus"]>[0]
) {
	if (!guard) return;
	const ariaHidden = guard.getAttribute("aria-hidden");
	guard.removeAttribute("aria-hidden");
	guard.focus(focusOptions);
	afterSleep(0, () => {
		if (ariaHidden === null) {
			guard.setAttribute("aria-hidden", "");
		} else {
			guard.setAttribute("aria-hidden", ariaHidden);
		}
	});
}
