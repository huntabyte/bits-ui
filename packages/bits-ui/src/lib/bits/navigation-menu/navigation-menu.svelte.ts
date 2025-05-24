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
	useRefById,
} from "svelte-toolbelt";
import { Context, useDebounce, watch } from "runed";
import { untrack, type Snippet } from "svelte";
import { SvelteMap } from "svelte/reactivity";
import { type Direction, type Orientation, useId } from "$lib/shared/index.js";
import {
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
} from "$lib/internal/types.js";
import { kbd } from "$lib/internal/kbd.js";
import { CustomEventDispatcher } from "$lib/internal/events.js";
import { useRovingFocus } from "$lib/internal/use-roving-focus.svelte.js";
import { useArrowNavigation } from "$lib/internal/use-arrow-navigation.js";
import { boxAutoReset } from "$lib/internal/box-auto-reset.svelte.js";
import { useResizeObserver } from "$lib/internal/use-resize-observer.svelte.js";
import { isElement } from "$lib/internal/is.js";
import type {
	FocusEventHandler,
	KeyboardEventHandler,
	MouseEventHandler,
	PointerEventHandler,
} from "svelte/elements";

const NAVIGATION_MENU_ROOT_ATTR = "data-navigation-menu-root";
const NAVIGATION_MENU_ATTR = "data-navigation-menu";
const NAVIGATION_MENU_SUB_ATTR = "data-navigation-menu-sub";
const NAVIGATION_MENU_ITEM_ATTR = "data-navigation-menu-item";
const NAVIGATION_MENU_INDICATOR_ATTR = "data-navigation-menu-indicator";
const NAVIGATION_MENU_LIST_ATTR = "data-navigation-menu-list";
const NAVIGATION_MENU_TRIGGER_ATTR = "data-navigation-menu-trigger";
const NAVIGATION_MENU_CONTENT_ATTR = "data-navigation-menu-content";
const NAVIGATION_MENU_LINK_ATTR = "data-navigation-menu-link";
const NAVIGATION_MENU_VIEWPORT_ATTR = "data-navigation-menu-viewport";

type NavigationMenuProviderStateProps = ReadableBoxedValues<{
	dir: Direction;
	orientation: Orientation;
}> &
	WritableBoxedValues<{
		rootNavigationMenuRef: HTMLElement | null;
		value: string;
		previousValue: string;
	}> & {
		isRootMenu: boolean;
		onTriggerEnter: (itemValue: string, itemState: NavigationMenuItemState | null) => void;
		onTriggerLeave?: () => void;
		onContentEnter?: () => void;
		onContentLeave?: () => void;
		onItemSelect: (itemValue: string, itemState: NavigationMenuItemState | null) => void;
		onItemDismiss: () => void;
	};

class NavigationMenuProviderState {
	readonly opts: NavigationMenuProviderStateProps;
	indicatorTrackRef = box<HTMLElement | null>(null);
	viewportRef = box<HTMLElement | null>(null);
	viewportContent = new SvelteMap<string, NavigationMenuItemState>();
	onTriggerEnter: NavigationMenuProviderStateProps["onTriggerEnter"];
	onTriggerLeave: () => void = noop;
	onContentEnter: () => void = noop;
	onContentLeave: () => void = noop;
	onItemSelect: NavigationMenuProviderStateProps["onItemSelect"];
	onItemDismiss: NavigationMenuProviderStateProps["onItemDismiss"];
	activeItem: NavigationMenuItemState | null = null;
	prevActiveItem: NavigationMenuItemState | null = null;

	constructor(opts: NavigationMenuProviderStateProps) {
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

type NavigationMenuRootStateProps = WithRefProps<
	WritableBoxedValues<{
		value: string;
	}> &
		ReadableBoxedValues<{
			dir: Direction;
			orientation: Orientation;
			delayDuration: number;
			skipDelayDuration: number;
		}>
>;

class NavigationMenuRootState {
	readonly opts: NavigationMenuRootStateProps;
	provider: NavigationMenuProviderState;
	previousValue = box("");
	isDelaySkipped: WritableBox<boolean>;
	#derivedDelay = $derived.by(() => {
		const isOpen = this.opts?.value?.current !== "";
		if (isOpen || this.isDelaySkipped.current) {
			// 150 for user to switch trigger or move into content view
			return 100;
		} else {
			return this.opts.delayDuration.current;
		}
	});

	constructor(opts: NavigationMenuRootStateProps) {
		this.opts = opts;
		this.isDelaySkipped = boxAutoReset(false, this.opts.skipDelayDuration.current);
		useRefById(opts);

		this.provider = useNavigationMenuProvider({
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

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				dir: this.opts.dir.current,
				[NAVIGATION_MENU_ROOT_ATTR]: "",
				[NAVIGATION_MENU_ATTR]: "",
			}) as const
	);
}

type NavigationMenuSubStateProps = WithRefProps<
	WritableBoxedValues<{
		value: string;
	}> &
		ReadableBoxedValues<{
			orientation: Orientation;
		}>
>;

class NavigationMenuSubState {
	readonly opts: NavigationMenuSubStateProps;
	readonly context: NavigationMenuProviderState;
	previousValue = box("");
	subProvider: NavigationMenuProviderState;

	constructor(opts: NavigationMenuSubStateProps, context: NavigationMenuProviderState) {
		this.opts = opts;
		this.context = context;

		useRefById(opts);

		this.subProvider = useNavigationMenuProvider({
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

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				[NAVIGATION_MENU_SUB_ATTR]: "",
				[NAVIGATION_MENU_ATTR]: "",
			}) as const
	);
}

type NavigationMenuListStateProps = WithRefProps;

class NavigationMenuListState {
	readonly opts: NavigationMenuListStateProps;
	readonly context: NavigationMenuProviderState;
	wrapperId = box(useId());
	wrapperRef = box<HTMLElement | null>(null);
	listTriggers = $state.raw<HTMLElement[]>([]);
	rovingFocusGroup: ReturnType<typeof useRovingFocus>;
	wrapperMounted = $state(false);

	constructor(opts: NavigationMenuListStateProps, context: NavigationMenuProviderState) {
		this.opts = opts;
		this.context = context;

		useRefById(opts);

		useRefById({
			id: this.wrapperId,
			ref: this.wrapperRef,
			onRefChange: (node) => {
				this.context.indicatorTrackRef.current = node;
			},
			deps: () => this.wrapperMounted,
		});

		this.rovingFocusGroup = useRovingFocus({
			rootNodeId: opts.id,
			candidateSelector: `[${NAVIGATION_MENU_TRIGGER_ATTR}]:not([data-disabled]), [${NAVIGATION_MENU_LINK_ATTR}]:not([data-disabled])`,
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

	wrapperProps = $derived.by(
		() =>
			({
				id: this.wrapperId.current,
			}) as const
	);

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-orientation": getDataOrientation(this.context.opts.orientation.current),
				[NAVIGATION_MENU_LIST_ATTR]: "",
			}) as const
	);
}

type NavigationMenuItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		openOnHover: boolean;
	}>
>;

export class NavigationMenuItemState {
	readonly opts: NavigationMenuItemStateProps;
	readonly listContext: NavigationMenuListState;
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	focusProxyNode = $state<HTMLElement | null>(null);
	restoreContentTabOrder: AnyFn = noop;
	wasEscapeClose = false;
	contentId = $derived.by(() => this.contentNode?.id);
	triggerId = $derived.by(() => this.triggerNode?.id);
	contentChildren: ReadableBox<Snippet | undefined> = box(undefined);
	contentChild: ReadableBox<Snippet<[{ props: Record<string, unknown> }]> | undefined> =
		box(undefined);
	contentProps: ReadableBox<Record<string, unknown>> = box({});

	constructor(opts: NavigationMenuItemStateProps, listContext: NavigationMenuListState) {
		this.opts = opts;
		this.listContext = listContext;
	}

	#handleContentEntry = (side: "start" | "end" = "start") => {
		if (!this.contentNode) return;
		this.restoreContentTabOrder();
		const candidates = getTabbableCandidates(this.contentNode);
		if (candidates.length) focusFirst(side === "start" ? candidates : candidates.reverse());
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
				[NAVIGATION_MENU_ITEM_ATTR]: "",
			}) as const
	);
}

type NavigationMenuTriggerStateProps = WithRefProps &
	ReadableBoxedValues<{
		disabled: boolean | null | undefined;
	}>;

class NavigationMenuTriggerState {
	readonly opts: NavigationMenuTriggerStateProps;
	focusProxyId = box(useId());
	focusProxyRef = box<HTMLElement | null>(null);
	context: NavigationMenuProviderState;
	itemContext: NavigationMenuItemState;
	listContext: NavigationMenuListState;
	hasPointerMoveOpened = box(false);
	wasClickClose = false;
	open = $derived.by(
		() => this.itemContext.opts.value.current === this.context.opts.value.current
	);
	focusProxyMounted = $state(false);

	constructor(
		opts: NavigationMenuTriggerStateProps,
		context: {
			provider: NavigationMenuProviderState;
			item: NavigationMenuItemState;
			list: NavigationMenuListState;
			sub: NavigationMenuSubState | null;
		}
	) {
		this.opts = opts;
		this.hasPointerMoveOpened = boxAutoReset(false, 300);
		this.context = context.provider;
		this.itemContext = context.item;
		this.listContext = context.list;

		useRefById({
			...opts,
			onRefChange: (node) => {
				this.itemContext.triggerNode = node;
			},
		});

		useRefById({
			id: this.focusProxyId,
			ref: this.focusProxyRef,
			onRefChange: (node) => {
				this.itemContext.focusProxyNode = node;
			},
			deps: () => this.focusProxyMounted,
		});

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

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.opts.disabled.current,
				"data-disabled": getDataDisabled(Boolean(this.opts.disabled.current)),
				"data-state": getDataOpenClosed(this.open),
				"data-value": this.itemContext.opts.value.current,
				"aria-expanded": getAriaExpanded(this.open),
				"aria-controls": this.itemContext.contentId,
				[NAVIGATION_MENU_TRIGGER_ATTR]: "",
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				onpointerenter: this.onpointerenter,
				onclick: this.onclick,
				onkeydown: this.onkeydown,
			}) as const
	);

	focusProxyProps = $derived.by(
		() =>
			({
				id: this.focusProxyId.current,
				tabindex: 0,
				onfocus: this.focusProxyOnFocus,
			}) as const
	);

	restructureSpanProps = $derived.by(
		() =>
			({
				"aria-owns": this.itemContext.contentId,
			}) as const
	);
}

type NavigationMenuLinkStateProps = WithRefProps &
	ReadableBoxedValues<{
		active: boolean;
		onSelect: (e: Event) => void;
	}>;

const LINK_SELECT_EVENT = new CustomEventDispatcher("bitsLinkSelect", {
	bubbles: true,
	cancelable: true,
});

const ROOT_CONTENT_DISMISS_EVENT = new CustomEventDispatcher("bitsRootContentDismiss", {
	cancelable: true,
	bubbles: true,
});

class NavigationMenuLinkState {
	readonly opts: NavigationMenuLinkStateProps;
	readonly context: { provider: NavigationMenuProviderState; item: NavigationMenuItemState };
	isFocused = $state(false);

	constructor(
		opts: NavigationMenuLinkStateProps,
		context: { provider: NavigationMenuProviderState; item: NavigationMenuItemState }
	) {
		this.opts = opts;
		this.context = context;

		useRefById(opts);
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

	props = $derived.by(
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
				[NAVIGATION_MENU_LINK_ATTR]: "",
			}) as const
	);
}

type NavigationMenuIndicatorStateProps = WithRefProps;

class NavigationMenuIndicatorState {
	context: NavigationMenuProviderState;
	isVisible = $derived.by(() => Boolean(this.context.opts.value.current));

	constructor(context: NavigationMenuProviderState) {
		this.context = context;
	}
}

class NavigationMenuIndicatorImplState {
	readonly opts: NavigationMenuIndicatorStateProps;
	context: NavigationMenuProviderState;
	listContext: NavigationMenuListState;
	position = $state.raw<{ size: number; offset: number } | null>(null);
	isHorizontal = $derived.by(() => this.context.opts.orientation.current === "horizontal");
	isVisible = $derived.by(() => !!this.context.opts.value.current);
	activeTrigger = $derived.by(() => {
		const items = this.listContext.listTriggers;
		const triggerNode = items.find(
			(item) => item.getAttribute("data-value") === this.context.opts.value.current
		);
		return triggerNode ?? null;
	});
	shouldRender = $derived.by(() => this.position !== null);

	constructor(
		opts: NavigationMenuIndicatorStateProps,
		context: {
			provider: NavigationMenuProviderState;
			list: NavigationMenuListState;
		}
	) {
		this.opts = opts;
		this.context = context.provider;
		this.listContext = context.list;

		useResizeObserver(() => this.activeTrigger, this.handlePositionChange);
		useResizeObserver(() => this.context.indicatorTrackRef.current, this.handlePositionChange);

		useRefById({
			...opts,
			deps: () => this.context.opts.value.current,
		});
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

	props = $derived.by(
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
				[NAVIGATION_MENU_INDICATOR_ATTR]: "",
			}) as const
	);
}

type NavigationMenuContentStateProps = WithRefProps;

class NavigationMenuContentState {
	readonly opts: NavigationMenuContentStateProps;
	context: NavigationMenuProviderState;
	itemContext: NavigationMenuItemState;
	listContext: NavigationMenuListState;
	open = $derived.by(
		() => this.itemContext.opts.value.current === this.context.opts.value.current
	);
	mounted = $state(false);
	value = $derived.by(() => this.itemContext.opts.value.current);
	// We persist the last active content value as the viewport may be animating out
	// and we want the content to remain mounted for the lifecycle of the viewport.
	isLastActiveValue = $derived.by(() => {
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
		opts: NavigationMenuContentStateProps,
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

		useRefById({
			...opts,
			onRefChange: (node) => {
				this.itemContext.contentNode = node;
			},
			deps: () => this.mounted,
		});
	}

	onpointerenter = (_: BitsPointerEvent) => {
		this.context.onContentEnter();
	};

	onpointerleave = whenMouse(() => {
		if (!this.itemContext.opts.openOnHover.current) return;
		this.context.onContentLeave();
	});

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				onpointerenter: this.onpointerenter,
				onpointerleave: this.onpointerleave,
			}) as const
	);
}

type MotionAttribute = "to-start" | "to-end" | "from-start" | "from-end";
type NavigationMenuContentImplStateProps = WithRefProps;

class NavigationMenuContentImplState {
	readonly opts: NavigationMenuContentImplStateProps;
	readonly itemContext: NavigationMenuItemState;
	context: NavigationMenuProviderState;
	listContext: NavigationMenuListState;
	prevMotionAttribute: MotionAttribute | null = $state(null);
	motionAttribute: MotionAttribute | null = $derived.by(() => {
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

	constructor(opts: NavigationMenuContentImplStateProps, itemContext: NavigationMenuItemState) {
		this.opts = opts;
		this.itemContext = itemContext;
		this.listContext = itemContext.listContext;
		this.context = itemContext.listContext.context;

		useRefById({
			...opts,
			deps: () => this.context.opts.value.current,
		});

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
					if (content.contains(document.activeElement)) {
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
			target.closest(`[${NAVIGATION_MENU_ATTR}]`) !==
			this.context.opts.rootNavigationMenuRef.current
		)
			return;

		const isMetaKey = e.altKey || e.ctrlKey || e.metaKey;
		const isTabKey = e.key === kbd.TAB && !isMetaKey;
		const candidates = getTabbableCandidates(e.currentTarget);

		if (isTabKey) {
			const focusedElement = document.activeElement;
			const index = candidates.findIndex((candidate) => candidate === focusedElement);
			const isMovingBackwards = e.shiftKey;
			const nextCandidates = isMovingBackwards
				? candidates.slice(0, index).reverse()
				: candidates.slice(index + 1, candidates.length);
			if (focusFirst(nextCandidates)) {
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

		let activeEl: HTMLElement = document.activeElement as HTMLElement;

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
			attributeName: `[${NAVIGATION_MENU_LINK_ATTR}]`,
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

	props = $derived.by(
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
				[NAVIGATION_MENU_CONTENT_ATTR]: "",
			}) as const
	);
}

class NavigationMenuViewportState {
	readonly opts: NavigationMenuViewportImplStateProps;
	readonly context: NavigationMenuProviderState;
	open = $derived.by(() => !!this.context.opts.value.current);
	size = $state<{ width: number; height: number } | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	viewportWidth = $derived.by(() => (this.size ? `${this.size.width}px` : undefined));
	viewportHeight = $derived.by(() => (this.size ? `${this.size.height}px` : undefined));
	activeContentValue = $derived.by(() => this.context.opts.value.current);
	mounted = $state(false);

	constructor(opts: NavigationMenuViewportImplStateProps, context: NavigationMenuProviderState) {
		this.opts = opts;
		this.context = context;

		useRefById({
			...opts,
			onRefChange: (node) => {
				this.context.viewportRef.current = node;
			},
			deps: () => this.open,
		});

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
		useResizeObserver(
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

	props = $derived.by(
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
				[NAVIGATION_MENU_VIEWPORT_ATTR]: "",
				onpointerenter: this.context.onContentEnter,
				onpointerleave: this.context.onContentLeave,
			}) as const
	);
}

type NavigationMenuViewportImplStateProps = WithRefProps;

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

export function useNavigationMenuRoot(props: NavigationMenuRootStateProps) {
	return new NavigationMenuRootState(props);
}

export function useNavigationMenuProvider(props: NavigationMenuProviderStateProps) {
	return NavigationMenuProviderContext.set(new NavigationMenuProviderState(props));
}

export function useNavigationMenuSub(props: NavigationMenuSubStateProps) {
	return new NavigationMenuSubState(props, NavigationMenuProviderContext.get());
}

export function useNavigationMenuList(props: NavigationMenuListStateProps) {
	return NavigationMenuListContext.set(
		new NavigationMenuListState(props, NavigationMenuProviderContext.get())
	);
}

export function useNavigationMenuItem(props: NavigationMenuItemStateProps) {
	return NavigationMenuItemContext.set(
		new NavigationMenuItemState(props, NavigationMenuListContext.get())
	);
}

export function useNavigationMenuIndicatorImpl(props: NavigationMenuIndicatorStateProps) {
	return new NavigationMenuIndicatorImplState(props, {
		provider: NavigationMenuProviderContext.get(),
		list: NavigationMenuListContext.get(),
	});
}

export function useNavigationMenuTrigger(props: NavigationMenuTriggerStateProps) {
	return new NavigationMenuTriggerState(props, {
		provider: NavigationMenuProviderContext.get(),
		item: NavigationMenuItemContext.get(),
		list: NavigationMenuListContext.get(),
		sub: NavigationMenuSubContext.getOr(null),
	});
}

export function useNavigationMenuContent(props: NavigationMenuContentStateProps) {
	return NavigationMenuContentContext.set(
		new NavigationMenuContentState(props, {
			provider: NavigationMenuProviderContext.get(),
			item: NavigationMenuItemContext.get(),
			list: NavigationMenuListContext.get(),
		})
	);
}

export function useNavigationMenuLink(props: NavigationMenuLinkStateProps) {
	return new NavigationMenuLinkState(props, {
		provider: NavigationMenuProviderContext.get(),
		item: NavigationMenuItemContext.get(),
	});
}

export function useNavigationMenuContentImpl(
	props: NavigationMenuContentImplStateProps,
	itemState?: NavigationMenuItemState
) {
	return new NavigationMenuContentImplState(props, itemState ?? NavigationMenuItemContext.get());
}

export function useNavigationMenuViewport(props: NavigationMenuViewportImplStateProps) {
	return new NavigationMenuViewportState(props, NavigationMenuProviderContext.get());
}

export function useNavigationMenuIndicator() {
	return new NavigationMenuIndicatorState(NavigationMenuProviderContext.get());
}

//

function focusFirst(candidates: HTMLElement[]) {
	const previouslyFocusedElement = document.activeElement;
	return candidates.some((candidate) => {
		// if focus is already where we want to go, we don't want to keep going through the candidates
		if (candidate === previouslyFocusedElement) return true;
		candidate.focus();
		return document.activeElement !== previouslyFocusedElement;
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
