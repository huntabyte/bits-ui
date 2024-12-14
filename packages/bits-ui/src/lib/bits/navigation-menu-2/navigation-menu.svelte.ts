/**
 * Based on Radix UI's Navigation Menu
 * https://www.radix-ui.com/docs/primitives/components/navigation-menu
 */

import { createContext } from "$lib/internal/create-context.js";
import { useId, type Direction, type Orientation } from "$lib/shared/index.js";
import {
	box,
	onDestroyEffect,
	useRefById,
	type AnyFn,
	type ReadableBoxedValues,
	type WithRefProps,
	type WritableBoxedValues,
} from "svelte-toolbelt";
import { Previous } from "runed";
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
import { createCustomEvent } from "$lib/internal/events.js";

const ROOT_ATTR = "data-navigation-menu-root";
const SUB_ATTR = "data-navigation-menu-sub";
const LIST_ATTR = "data-navigation-menu-list";
const ITEM_ATTR = "data-navigation-menu-item";
const TRIGGER_ATTR = "data-navigation-menu-trigger";
const LINK_ATTR = "data-navigation-menu-link";

type NavigationMenuProviderStateProps = ReadableBoxedValues<{
	dir: Direction;
	orientation: Orientation;
}> &
	WritableBoxedValues<{
		rootNavigationMenuRef: HTMLElement | null;
		value: string;
	}> & {
		isRootMenu: boolean;
		onTriggerEnter(itemValue: string): void;
		onTriggerLeave?(): void;
		onContentEnter?(): void;
		onContentLeave?(): void;
		onItemSelect(itemValue: string): void;
		onItemDismiss(): void;
	};

class NavigationMenuProviderState {
	isRootMenu: NavigationMenuProviderStateProps["isRootMenu"];
	value: NavigationMenuProviderStateProps["value"];
	previousValue: Previous<string>;
	dir: NavigationMenuProviderStateProps["dir"];
	orientation: NavigationMenuProviderStateProps["orientation"];
	rootNavigationMenuRef: NavigationMenuProviderStateProps["rootNavigationMenuRef"];
	indicatorTrackRef = box<HTMLElement | null>(null);
	viewportRef = box<HTMLElement | null>(null);
	onTriggerEnter: NavigationMenuProviderStateProps["onTriggerEnter"];
	onTriggerLeave: () => void = noop;
	onContentEnter: () => void = noop;
	onContentLeave: () => void = noop;
	onItemSelect: NavigationMenuProviderStateProps["onItemSelect"];
	onItemDismiss: NavigationMenuProviderStateProps["onItemDismiss"];

	constructor(props: NavigationMenuProviderStateProps) {
		this.isRootMenu = props.isRootMenu;
		this.value = props.value;
		this.previousValue = new Previous(() => this.value.current);
		this.dir = props.dir;
		this.orientation = props.orientation;
		this.rootNavigationMenuRef = props.rootNavigationMenuRef;
		this.onTriggerEnter = props.onTriggerEnter;
		this.onTriggerLeave = props.onTriggerLeave ?? noop;
		this.onContentEnter = props.onContentEnter ?? noop;
		this.onContentLeave = props.onContentLeave ?? noop;
		this.onItemDismiss = props.onItemDismiss;
		this.onItemSelect = props.onItemSelect;

		this.onItemSelect = this.onItemSelect.bind(this);
		this.onItemDismiss = this.onItemDismiss.bind(this);
		this.onTriggerEnter = this.onTriggerEnter.bind(this);
		this.onTriggerLeave = this.onTriggerLeave.bind(this);
		this.onContentEnter = this.onContentEnter.bind(this);
		this.onContentLeave = this.onContentLeave.bind(this);
	}
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
	id: NavigationMenuRootStateProps["id"];
	ref: NavigationMenuRootStateProps["ref"];
	value: NavigationMenuRootStateProps["value"];
	dir: NavigationMenuRootStateProps["dir"];
	orientation: NavigationMenuRootStateProps["orientation"];
	delayDuration: NavigationMenuRootStateProps["delayDuration"];
	skipDelayDuration: NavigationMenuRootStateProps["skipDelayDuration"];

	openTimer = $state(0);
	closeTimer = $state(0);
	skipDelayTimer = $state(0);
	isOpenDelayed = $state(true);

	provider: NavigationMenuProviderState;

	constructor(props: NavigationMenuRootStateProps) {
		this.id = props.id;
		this.ref = props.ref;
		this.value = props.value;
		this.dir = props.dir;
		this.orientation = props.orientation;
		this.delayDuration = props.delayDuration;
		this.skipDelayDuration = props.skipDelayDuration;

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		onDestroyEffect(() => {
			window.clearTimeout(this.openTimer);
			window.clearTimeout(this.closeTimer);
			window.clearTimeout(this.skipDelayTimer);
		});

		this.provider = useNavigationMenuProvider({
			value: this.value,
			dir: this.dir,
			orientation: this.orientation,
			rootNavigationMenuRef: this.ref,
			isRootMenu: true,
			onTriggerEnter: (itemValue) => this.#onTriggerEnter(itemValue),
			onTriggerLeave: () => this.#onTriggerLeave(),
			onContentEnter: () => this.#onContentEnter(),
			onContentLeave: () => this.#onContentLeave(),
			onItemSelect: (itemValue) => this.#onItemSelect(itemValue),
			onItemDismiss: () => this.#onItemDismiss(),
		});
	}

	#onTriggerEnter(itemValue: string) {
		window.clearTimeout(this.openTimer);
		if (this.isOpenDelayed) this.handleDelayedOpen(itemValue);
		else this.handleOpen(itemValue);
	}

	#onTriggerLeave() {
		window.clearTimeout(this.openTimer);
		this.startCloseTimer();
	}

	#onContentEnter() {
		window.clearTimeout(this.closeTimer);
	}

	#onContentLeave() {
		this.startCloseTimer();
	}

	#onItemSelect(itemValue: string) {
		if (this.value.current === itemValue) {
			this.setValue("");
		} else {
			this.setValue(itemValue);
		}
	}

	#onItemDismiss() {
		this.setValue("");
	}

	setValue(newValue: string) {
		this.value.current = newValue;
	}

	handleValueChange(newValue: string) {
		const isOpen = newValue !== "";
		const hasSkipDelayDuration = this.skipDelayDuration.current > 0;

		if (isOpen) {
			window.clearTimeout(this.skipDelayTimer);
			if (hasSkipDelayDuration) this.isOpenDelayed = false;
		} else {
			window.clearTimeout(this.skipDelayTimer);
			this.skipDelayTimer = window.setTimeout(
				() => (this.isOpenDelayed = true),
				this.skipDelayDuration.current
			);
		}
	}

	startCloseTimer() {
		window.clearTimeout(this.closeTimer);
		this.closeTimer = window.setTimeout(() => this.setValue(""), 150);
	}

	handleOpen(itemValue: string) {
		window.clearTimeout(this.closeTimer);
		this.setValue(itemValue);
	}

	handleDelayedOpen(itemValue: string) {
		const isOpenItem = this.value.current === itemValue;
		if (isOpenItem) {
			// If the item is already open (e.g. we're transitioning from the content to the trigger) then we want to clear the close timer immediately.
			window.clearTimeout(this.closeTimer);
		} else {
			this.openTimer = window.setTimeout(() => {
				window.clearTimeout(this.closeTimer);
				this.setValue(itemValue);
			}, this.delayDuration.current);
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"aria-label": "Main",
				"data-orientation": getDataOrientation(this.orientation.current),
				dir: this.dir.current,
				[ROOT_ATTR]: "",
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
	id: NavigationMenuSubStateProps["id"];
	ref: NavigationMenuSubStateProps["ref"];
	value: NavigationMenuSubStateProps["value"];
	context: NavigationMenuProviderState;
	orientation: NavigationMenuSubStateProps["orientation"];

	constructor(props: NavigationMenuSubStateProps, context: NavigationMenuProviderState) {
		this.id = props.id;
		this.ref = props.ref;
		this.value = props.value;
		this.orientation = props.orientation;
		this.context = context;

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		useNavigationMenuProvider({
			isRootMenu: false,
			value: this.value,
			dir: this.context.dir,
			orientation: this.orientation,
			rootNavigationMenuRef: this.context.rootNavigationMenuRef,
			onTriggerEnter: (itemValue) => this.setValue(itemValue),
			onItemSelect: (itemValue) => this.setValue(itemValue),
			onItemDismiss: () => this.setValue(""),
		});
	}

	setValue(newValue: string) {
		this.value.current = newValue;
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-orientation": getDataOrientation(this.orientation.current),
				[SUB_ATTR]: "",
			}) as const
	);
}

type NavigationMenuListStateProps = WithRefProps;

class NavigationMenuListState {
	id: NavigationMenuListStateProps["id"];
	ref: NavigationMenuListStateProps["ref"];
	context: NavigationMenuProviderState;
	wrapperId = box.with(() => useId());
	wrapperRef = box<HTMLElement | null>(null);

	constructor(props: NavigationMenuListStateProps, context: NavigationMenuProviderState) {
		this.id = props.id;
		this.ref = props.ref;
		this.context = context;

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		useRefById({
			id: this.wrapperId,
			ref: this.wrapperRef,
			onRefChange: (node) => {
				this.context.indicatorTrackRef.current = node;
			},
		});
	}

	wrapperProps = $derived.by(
		() =>
			({
				id: this.id.current,
			}) as const
	);

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-orientation": getDataOrientation(this.context.orientation.current),
				[LIST_ATTR]: "",
			}) as const
	);
}

type NavigationMenuItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
	}>
>;

class NavigationMenuItemState {
	ref: NavigationMenuItemStateProps["ref"];
	id: NavigationMenuItemStateProps["id"];
	value: NavigationMenuItemStateProps["value"];
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	focusProxyNode = $state<HTMLElement | null>(null);
	restoreContentTabOrder: AnyFn = noop;
	wasEscapeClose = $state(false);

	constructor(props: NavigationMenuItemStateProps) {
		this.ref = props.ref;
		this.id = props.id;
		this.value = props.value;
	}

	#handleContentEntry = (side: "start" | "end" = "start") => {
		if (!this.contentNode) return;
		this.restoreContentTabOrder();
		const candidates = getTabbableCandidates(this.contentNode);
		if (candidates.length) focusFirst(side === "start" ? candidates : candidates.reverse());
	};

	#handleContextExit = () => {
		if (!this.contentNode) return;
		const candidates = getTabbableCandidates(this.contentNode);
		if (candidates.length) this.restoreContentTabOrder = removeFromTabOrder(candidates);
	};

	onEntryKeydown = this.#handleContentEntry;
	onFocusProxyEnter = this.#handleContentEntry;
	onRootContentClose = this.#handleContextExit;
	onContentFocusOutside = this.#handleContextExit;

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				[ITEM_ATTR]: "",
			}) as const
	);
}

type NavigationMenuTriggerStateProps = WithRefProps &
	ReadableBoxedValues<{
		disabled: boolean | null | undefined;
	}>;

class NavigationMenuTriggerState {
	id: NavigationMenuTriggerStateProps["id"];
	ref: NavigationMenuTriggerStateProps["ref"];
	focusProxyId = box.with(() => useId());
	focusProxyRef = box<HTMLElement | null>(null);
	disabled: NavigationMenuTriggerStateProps["disabled"];
	context: NavigationMenuProviderState;
	itemContext: NavigationMenuItemState;
	contentId = $derived.by(() => this.itemContext.contentNode?.id ?? undefined);
	hasPointerMoveOpened = $state(false);
	wasClickClose = $state(false);
	open = $derived.by(() => this.itemContext.value.current === this.context.value.current);

	constructor(
		props: NavigationMenuTriggerStateProps,
		context: NavigationMenuProviderState,
		itemContext: NavigationMenuItemState
	) {
		this.id = props.id;
		this.ref = props.ref;
		this.disabled = props.disabled;
		this.context = context;
		this.itemContext = itemContext;
		this.open = itemContext.value.current === context.value.current;

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		useRefById({
			id: this.focusProxyId,
			ref: this.focusProxyRef,
			onRefChange: (node) => {
				this.itemContext.focusProxyNode = node;
			},
			deps: () => this.open,
		});

		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.focusProxyOnFocus = this.focusProxyOnFocus.bind(this);
	}

	onpointerenter(_: BitsPointerEvent<HTMLButtonElement>) {
		this.wasClickClose = false;
		this.itemContext.wasEscapeClose = false;
	}

	onpointermove = whenMouse(() => {
		if (
			this.disabled.current ||
			this.wasClickClose ||
			this.itemContext.wasEscapeClose ||
			this.hasPointerMoveOpened
		) {
			return;
		}
		this.context.onTriggerEnter(this.itemContext.value.current);
		this.hasPointerMoveOpened = true;
	});

	onpointerleave = whenMouse(() => {
		if (this.disabled.current) return;
		this.context.onTriggerLeave();
		this.hasPointerMoveOpened = false;
	});

	onclick(_: BitsMouseEvent<HTMLButtonElement>) {
		this.context.onItemSelect(this.itemContext.value.current);
		this.wasClickClose = this.open;
	}

	onkeydown(e: BitsKeyboardEvent<HTMLButtonElement>) {
		const verticalEntryKey =
			this.context.dir.current === "rtl" ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT;
		const entryKey = { horizontal: kbd.ARROW_DOWN, vertical: verticalEntryKey }[
			this.context.orientation.current
		];
		if (this.open && e.key === entryKey) {
			this.itemContext.onEntryKeydown();
			// prevent focus group from handling the event
			e.preventDefault();
		}
	}

	focusProxyOnFocus(e: BitsFocusEvent) {
		const content = this.itemContext.contentNode;
		const prevFocusedElement = e.relatedTarget as HTMLElement | null;
		const wasTriggerFocused = this.ref.current && prevFocusedElement === this.ref.current;
		const wasFocusFromContent = content?.contains(prevFocusedElement);

		if (wasTriggerFocused || !wasFocusFromContent) {
			this.itemContext.onFocusProxyEnter(wasTriggerFocused ? "start" : "end");
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				disabled: this.disabled.current,
				"data-disabled": getDataDisabled(Boolean(this.disabled.current)),
				"data-state": getDataOpenClosed(this.open),
				"aria-expanded": getAriaExpanded(this.open),
				"aria-controls": this.contentId,
				[TRIGGER_ATTR]: "",
			}) as const
	);

	focusProxyProps = $derived.by(
		() =>
			({
				"aria-hidden": "true",
				tabindex: 0,
				onfocus: this.focusProxyOnFocus,
			}) as const
	);

	restructureSpanProps = $derived.by(
		() =>
			({
				"aria-owns": this.contentId,
			}) as const
	);
}

type NavigationMenuLinkStateProps = WithRefProps &
	ReadableBoxedValues<{
		active: boolean;
		onSelect: (e: Event) => void;
	}>;

const [dispatchLinkSelect, listenLinkSelect] = createCustomEvent("bitsLinkSelect", {
	bubbles: true,
	cancelable: true,
});

const [dispatchRootContentDismiss, listenRootContentDismiss] = createCustomEvent(
	"bitsRootContentDismiss",
	{
		cancelable: true,
		bubbles: true,
	}
);

class NavigationMenuLinkState {
	id: NavigationMenuLinkStateProps["id"];
	ref: NavigationMenuLinkStateProps["ref"];
	active: NavigationMenuLinkStateProps["active"];
	onSelect: NavigationMenuLinkStateProps["onSelect"];

	constructor(props: NavigationMenuLinkStateProps, context: NavigationMenuProviderState) {
		this.id = props.id;
		this.ref = props.ref;
		this.active = props.active;
		this.onSelect = props.onSelect;

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		this.onclick = this.onclick.bind(this);
	}

	onclick(e: BitsMouseEvent<HTMLAnchorElement>) {
		const currTarget = e.currentTarget;

		listenLinkSelect(currTarget, (e) => this.onSelect.current(e), { once: true });
		const linkSelectEvent = dispatchLinkSelect(currTarget);

		if (!linkSelectEvent.defaultPrevented && !e.metaKey) {
			dispatchRootContentDismiss(currTarget);
		}
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"data-active": this.active.current ? "" : undefined,
				"aria-current": this.active.current ? "page" : undefined,
				onclick: this.onclick,
				[LINK_ATTR]: "",
			}) as const
	);
}

type NavigationMenuIndicatorStateProps = WithRefProps;

class NavigationMenuIndicatorState {
	context: NavigationMenuProviderState;
	isVisible = $derived.by(() => Boolean(this.context.value.current));

	constructor(context: NavigationMenuProviderState) {
		this.context = context;
	}
}

class NavigationMenuIndicatorImplState {
	id: NavigationMenuIndicatorStateProps["id"];
	ref: NavigationMenuIndicatorStateProps["ref"];
	context: NavigationMenuProviderState;
	activeTrigger = $state<HTMLElement | null>(null);
	position = $state<{ size: number; offset: number } | null>(null);
	isHorizontal = $derived.by(() => this.context.orientation.current === "horizontal");
	isVisible = $derived.by(() => Boolean(this.context.value.current));

	constructor(props: NavigationMenuIndicatorStateProps, context: NavigationMenuProviderState) {
		this.id = props.id;
		this.ref = props.ref;
		this.context = context;

		useRefById({
			id: this.id,
			ref: this.ref,
			deps: () => this.context.value.current,
		});
	}
}

const [setNavigationMenuProviderContext, getNavigationMenuProviderContext] =
	createContext<NavigationMenuProviderState>("NavigationMenu.Root", "NavigationMenuProvider");

const [setNavigationMenuItemContext, getNavigationMenuItemContext] =
	createContext<NavigationMenuItemState>("NavigationMenu.Item");

export function useNavigationMenuProvider(props: NavigationMenuProviderStateProps) {
	return setNavigationMenuProviderContext(new NavigationMenuProviderState(props));
}

export function useNavigationMenuSub(props: NavigationMenuSubStateProps) {
	return new NavigationMenuSubState(props, getNavigationMenuProviderContext());
}

export function useNavigationMenuList(props: NavigationMenuListStateProps) {
	return new NavigationMenuListState(props, getNavigationMenuProviderContext());
}

export function useNavigationMenuItem(props: NavigationMenuItemStateProps) {
	return setNavigationMenuItemContext(new NavigationMenuItemState(props));
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

type BitsPointerEventHandler<T extends HTMLElement = HTMLElement> = (
	e: BitsPointerEvent<T>
) => void;

function whenMouse<T extends HTMLElement = HTMLElement>(
	handler: BitsPointerEventHandler<T>
): BitsPointerEventHandler<T> {
	return (e) => (e.pointerType === "mouse" ? handler(e) : undefined);
}
