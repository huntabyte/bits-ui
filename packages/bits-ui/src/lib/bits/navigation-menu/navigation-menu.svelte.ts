import { untrack } from "svelte";
import { box } from "svelte-toolbelt";
import { Previous } from "runed";
import {
	watch,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "$lib/internal/box.svelte.js";
import type { Direction, Orientation } from "$lib/shared/index.js";
import {
	getAriaExpanded,
	getAriaHidden,
	getDataDisabled,
	getDataOpenClosed,
	getDataOrientation,
	getDisabledAttr,
} from "$lib/internal/attrs.js";
import { createContext } from "$lib/internal/createContext.js";
import { useId } from "$lib/internal/useId.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import { useArrowNavigation } from "$lib/internal/useArrowNavigation.js";
import { boxAutoReset } from "$lib/internal/boxAutoReset.svelte.js";
import { useRefById } from "$lib/internal/useNodeById.svelte.js";
import type { ElementRef } from "$lib/internal/types.js";
import { afterTick } from "$lib/internal/afterTick.js";
import { getTabbableCandidates } from "../utilities/focus-scope/utils.js";
import { noop } from "$lib/internal/callbacks.js";

const [setNavigationMenuRootContext, getNavigationMenuRootContext] =
	createContext<NavigationMenuRootState>("NavigationMenu.Root");

const [setNavigationMenuMenuContext, getNavigationMenuMenuContext] = createContext<
	NavigationMenuMenuState | NavigationMenuSubState
>("NavigationMenu.Root or NavigationMenu.Sub");

const [setNavigationMenuItemContext, getNavigationMenuItemContext] =
	createContext<NavigationMenuItemState>("NavigationMenu.Item");

const ROOT_ATTR = "data-navigation-menu-root";
const SUB_ATTR = "data-navigation-menu-sub";
const ITEM_ATTR = "data-navigation-menu-item";
const INDICATOR_ATTR = "data-navigation-menu-indicator";
const LIST_ATTR = "data-navigation-menu-list";
const TRIGGER_ATTR = "data-navigation-menu-trigger";
const CONTENT_ATTR = "data-navigation-menu-content";
const LINK_ATTR = "data-navigation-menu-link";

type NavigationMenuRootStateProps = ReadableBoxedValues<{
	id: string;
	delayDuration: number;
	skipDelayDuration: number;
	orientation: Orientation;
	dir: Direction;
}> &
	WritableBoxedValues<{ value: string; ref: HTMLElement | null }>;

class NavigationMenuRootState {
	id: NavigationMenuRootStateProps["id"];
	rootRef: NavigationMenuRootStateProps["ref"];
	delayDuration: NavigationMenuRootStateProps["delayDuration"];
	skipDelayDuration: NavigationMenuRootStateProps["skipDelayDuration"];
	orientation: NavigationMenuRootStateProps["orientation"];
	dir: NavigationMenuRootStateProps["dir"];
	value: NavigationMenuRootStateProps["value"];
	previousValue = new Previous(() => this.value.value);
	openTimer = 0;
	closeTimer = 0;
	skipDelayTimer = 0;
	isOpenDelayed = $state<boolean>(false);

	setValue = (v: string) => {
		this.value.value = v;
	};

	constructor(props: NavigationMenuRootStateProps) {
		this.id = props.id;
		this.delayDuration = props.delayDuration;
		this.skipDelayDuration = props.skipDelayDuration;
		this.orientation = props.orientation;
		this.dir = props.dir;
		this.value = props.value;
		this.rootRef = props.ref;

		useRefById({
			id: this.id,
			ref: this.rootRef,
		});

		watch(this.value, (curr) => {
			const isOpen = curr !== "";
			const hasSkipDelayDuration = this.skipDelayDuration.value > 0;

			if (isOpen) {
				window.clearTimeout(this.skipDelayTimer);
				if (hasSkipDelayDuration) this.isOpenDelayed = false;
			} else {
				window.clearTimeout(this.skipDelayTimer);
				this.skipDelayTimer = window.setTimeout(
					() => (this.isOpenDelayed = true),
					this.skipDelayDuration.value
				);
			}
		});

		$effect(() => {
			return () => {
				window.clearTimeout(this.openTimer);
				window.clearTimeout(this.closeTimer);
				window.clearTimeout(this.skipDelayTimer);
			};
		});
	}

	startCloseTimer = () => {
		window.clearTimeout(this.closeTimer);
		this.closeTimer = window.setTimeout(() => this.setValue(""), 150);
	};

	handleOpen = (itemValue: string) => {
		window.clearTimeout(this.closeTimer);
		this.setValue(itemValue);
	};

	handleClose = () => {
		this.onItemDismiss();
		this.onContentLeave();
	};

	handleDelayedOpen = (itemValue: string) => {
		const isOpenItem = this.value.value === itemValue;
		if (isOpenItem) {
			// If the item is already open (e.g. we're transitioning from the content to the trigger)
			// then we want to clear the close timer immediately.
			window.clearTimeout(this.closeTimer);
		} else {
			this.openTimer = window.setTimeout(() => {
				window.clearTimeout(this.closeTimer);
				this.setValue(itemValue);
			}, this.delayDuration.value);
		}
	};

	onTriggerEnter = (itemValue: string) => {
		window.clearTimeout(this.openTimer);
		if (this.isOpenDelayed) {
			this.handleDelayedOpen(itemValue);
		} else {
			this.handleOpen(itemValue);
		}
	};

	onTriggerLeave = () => {
		window.clearTimeout(this.openTimer);
		this.startCloseTimer();
	};

	onContentEnter = () => {
		window.clearTimeout(this.closeTimer);
	};

	onContentLeave = () => {
		this.startCloseTimer();
	};

	onItemSelect = (itemValue: string) => {
		const prevValue = this.value.value;
		this.setValue(prevValue === itemValue ? "" : itemValue);
	};

	onItemDismiss = () => {
		this.setValue("");
	};

	props = $derived.by(() => ({
		id: this.id.value,
		"aria-label": "Main",
		"data-orientation": getDataOrientation(this.orientation.value),
		dir: this.dir.value,
		[ROOT_ATTR]: "",
	}));

	createMenu(props: NavigationMenuMenuStateProps) {
		return new NavigationMenuMenuState(props, this);
	}
}

type NavigationMenuMenuStateProps = ReadableBoxedValues<{
	rootNavigationId: string;
	dir: Direction;
	orientation: Orientation;
}> &
	WritableBoxedValues<{
		value: string;
	}> & {
		isRoot: boolean;
		onTriggerEnter: (itemValue: string) => void;
		onTriggerLeave?: () => void;
		onContentEnter?: () => void;
		onContentLeave?: () => void;
		onItemSelect: (itemValue: string) => void;
		onItemDismiss: () => void;
		previousValue: Previous<string>;
	};

class NavigationMenuMenuState {
	isRoot: NavigationMenuMenuStateProps["isRoot"] = $state(false);
	rootNavigationId: NavigationMenuMenuStateProps["rootNavigationId"];
	dir: NavigationMenuMenuStateProps["dir"];
	orientation: NavigationMenuMenuStateProps["orientation"];
	value: NavigationMenuMenuStateProps["value"];
	previousValue: NavigationMenuMenuStateProps["previousValue"];
	onTriggerEnter: NavigationMenuMenuStateProps["onTriggerEnter"];
	onTriggerLeave: NavigationMenuMenuStateProps["onTriggerLeave"];
	onContentEnter: NavigationMenuMenuStateProps["onContentEnter"];
	onContentLeave: NavigationMenuMenuStateProps["onContentLeave"];
	onItemSelect: NavigationMenuMenuStateProps["onItemSelect"];
	onItemDismiss: NavigationMenuMenuStateProps["onItemDismiss"];
	viewportNode = $state<HTMLElement | null>(null);
	indicatorTrackNode = $state<HTMLElement | null>(null);
	viewportContentId = box.with<string | undefined>(() => undefined);
	root: NavigationMenuRootState;
	triggerRefs = new Set<ElementRef>();

	constructor(props: NavigationMenuMenuStateProps, root: NavigationMenuRootState) {
		this.isRoot = props.isRoot;
		this.rootNavigationId = props.rootNavigationId;
		this.dir = props.dir;
		this.orientation = props.orientation;
		this.value = props.value;
		this.onTriggerEnter = props.onTriggerEnter;
		this.onTriggerLeave = props.onTriggerLeave;
		this.onContentEnter = props.onContentEnter;
		this.onContentLeave = props.onContentLeave;
		this.onItemSelect = props.onItemSelect;
		this.onItemDismiss = props.onItemDismiss;
		this.root = root;
		this.previousValue = props.previousValue;
	}

	registerTrigger = (ref: ElementRef) => {
		this.triggerRefs.add(ref);
	};

	deRegisterTrigger = (ref: ElementRef) => {
		this.triggerRefs.delete(ref);
	};

	getTriggerNodes = () => {
		return Array.from(this.triggerRefs)
			.map((ref) => ref.value)
			.filter((node): node is HTMLElement => Boolean(node));
	};

	createList(props: NavigationMenuListStateProps) {
		return new NavigationMenuListState(props, this);
	}

	createItem(props: NavigationMenuItemStateProps) {
		return new NavigationMenuItemState(props, this);
	}

	createIndicator(props: NavigationMenuIndicatorStateProps) {
		return new NavigationMenuIndicatorState(props, this);
	}

	createViewport(props: NavigationMenuViewportStateProps) {
		return new NavigationMenuViewportState(props, this);
	}

	createSubMenu(props: NavigationMenuSubStateProps) {
		return new NavigationMenuSubState(props, this.root);
	}
}

type NavigationMenuSubStateProps = ReadableBoxedValues<{
	id: string;
	orientation: Orientation;
}> &
	WritableBoxedValues<{
		value: string;
		ref: HTMLElement | null;
	}>;

class NavigationMenuSubState {
	id: NavigationMenuSubStateProps["id"];
	isRoot = false;
	rootNavigationId: NavigationMenuMenuStateProps["rootNavigationId"];
	dir: NavigationMenuMenuStateProps["dir"];
	orientation: NavigationMenuMenuStateProps["orientation"];
	value: NavigationMenuMenuStateProps["value"];
	previousValue = new Previous(() => this.value.value);
	onTriggerLeave: NavigationMenuMenuStateProps["onTriggerLeave"];
	onContentEnter: NavigationMenuMenuStateProps["onContentEnter"];
	onContentLeave: NavigationMenuMenuStateProps["onContentLeave"];
	viewportNode = $state<HTMLElement | null>(null);
	indicatorTrackNode = $state<HTMLElement | null>(null);
	viewportContentId = box.with<string | undefined>(() => undefined);
	root: NavigationMenuRootState;
	triggerRefs = new Set<ElementRef>();
	ref: NavigationMenuSubStateProps["ref"];

	constructor(props: NavigationMenuSubStateProps, root: NavigationMenuRootState) {
		this.id = props.id;
		this.rootNavigationId = root.id;
		this.dir = root.dir;
		this.orientation = props.orientation;
		this.value = props.value;
		this.root = root;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	onTriggerEnter = (itemValue: string) => {
		this.value.value = itemValue;
	};

	onItemSelect = (itemValue: string) => {
		this.value.value = itemValue;
	};

	onItemDismiss = () => {
		this.value.value = "";
	};

	registerTrigger = (ref: ElementRef) => {
		this.triggerRefs.add(ref);
	};

	deRegisterTrigger = (ref: ElementRef) => {
		this.triggerRefs.delete(ref);
	};

	getTriggerNodes = () => {
		return Array.from(this.triggerRefs)
			.map((ref) => ref.value)
			.filter((node): node is HTMLElement => Boolean(node));
	};

	createList(props: NavigationMenuListStateProps) {
		return new NavigationMenuListState(props, this);
	}

	createItem(props: NavigationMenuItemStateProps) {
		return new NavigationMenuItemState(props, this);
	}

	createIndicator(props: NavigationMenuIndicatorStateProps) {
		return new NavigationMenuIndicatorState(props, this);
	}

	createViewport(props: NavigationMenuViewportStateProps) {
		return new NavigationMenuViewportState(props, this);
	}

	props = $derived.by(() => ({
		id: this.id.value,
		"data-orientation": getDataOrientation(this.orientation.value),
		[SUB_ATTR]: "",
	}));
}

type NavigationMenuListStateProps = ReadableBoxedValues<{
	id: string;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
		indicatorTrackRef: HTMLElement | null;
	}>;

class NavigationMenuListState {
	id: NavigationMenuListStateProps["id"];
	listRef: NavigationMenuListStateProps["ref"];
	indicatorTrackRef: NavigationMenuListStateProps["indicatorTrackRef"];
	indicatorTrackId = box(useId());

	constructor(
		props: NavigationMenuListStateProps,
		private menu: NavigationMenuMenuState | NavigationMenuSubState
	) {
		this.id = props.id;
		this.listRef = props.ref;
		this.indicatorTrackRef = props.indicatorTrackRef;

		useRefById({
			id: this.id,
			ref: this.listRef,
		});

		useRefById({
			id: this.indicatorTrackId,
			ref: this.indicatorTrackRef,
			onRefChange: (node) => {
				this.menu.indicatorTrackNode = node;
			},
		});
	}

	indicatorTrackProps = $derived.by(
		() =>
			({
				id: this.indicatorTrackId.value,
				style: {
					position: "relative",
				},
			}) as const
	);

	props = $derived.by(
		() =>
			({
				"data-orientation": getDataOrientation(this.menu.orientation.value),
				[LIST_ATTR]: "",
			}) as const
	);
}

type NavigationMenuItemStateProps = ReadableBoxedValues<{
	id: string;
	value: string;
}>;

class NavigationMenuItemState {
	id: NavigationMenuItemStateProps["id"];
	value: NavigationMenuItemStateProps["value"];
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	focusProxyRef = box<HTMLElement | null>(null);
	focusProxyNode = $state<HTMLElement | null>(null);
	focusProxyId = box(useId());
	restoreContentTabOrder = noop;
	wasEscapeClose = $state(false);
	menu: NavigationMenuMenuState | NavigationMenuSubState;

	constructor(
		props: NavigationMenuItemStateProps,
		menu: NavigationMenuMenuState | NavigationMenuSubState
	) {
		this.id = props.id;
		this.value = props.value;
		this.menu = menu;
	}

	#handleContentEntry = (side: "start" | "end" = "start") => {
		if (!this.contentNode) return;
		this.restoreContentTabOrder();
		const candidates = getTabbableCandidates(this.contentNode);
		if (candidates.length) {
			if (side === "start") {
				candidates[0]?.focus();
			} else {
				candidates[candidates.length - 1]?.focus();
			}
		}
	};

	#handleContentExit = () => {
		if (!this.contentNode) return;
		const candidates = getTabbableCandidates(this.contentNode);
		if (candidates.length) {
			this.restoreContentTabOrder = removeFromTabOrder(candidates);
		}
	};

	onEntryKeydown = this.#handleContentEntry;
	onFocusProxyEnter = this.#handleContentEntry;
	onContentFocusOutside = this.#handleContentExit;
	onRootContentClose = this.#handleContentExit;

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				[ITEM_ATTR]: "",
			}) as const
	);

	createTrigger(props: NavigationMenuTriggerStateProps) {
		return new NavigationMenuTriggerState(props, this);
	}

	createContent(props: NavigationMenuContentStateProps) {
		return new NavigationMenuContentState(props, this);
	}

	createLink(props: NavigationMenuLinkStateProps) {
		return new NavigationMenuLinkState(props);
	}
}

type NavigationMenuTriggerStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean;
	focusProxyMounted: boolean;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class NavigationMenuTriggerState {
	id: NavigationMenuTriggerStateProps["id"];
	focusProxyMounted: NavigationMenuTriggerStateProps["focusProxyMounted"];
	menu: NavigationMenuMenuState | NavigationMenuSubState;
	item: NavigationMenuItemState;
	disabled: NavigationMenuTriggerStateProps["disabled"];
	hasPointerMoveOpened = boxAutoReset(false, 150);
	wasClickClose = $state(false);
	open = $derived.by(() => this.item.value.value === this.menu.value.value);
	triggerRef: NavigationMenuTriggerStateProps["ref"];

	constructor(props: NavigationMenuTriggerStateProps, item: NavigationMenuItemState) {
		this.id = props.id;
		this.triggerRef = props.ref;
		this.item = item;
		this.menu = item.menu;
		this.disabled = props.disabled;
		this.focusProxyMounted = props.focusProxyMounted;

		useRefById({
			id: this.id,
			ref: this.triggerRef,
			onRefChange: (node) => {
				this.item.triggerNode = node;
			},
		});

		useRefById({
			id: this.item.focusProxyId,
			ref: this.item.focusProxyRef,
			onRefChange: (node) => {
				this.item.focusProxyNode = node;
			},
			condition: () => this.focusProxyMounted.value,
		});

		$effect(() => {
			this.menu.registerTrigger(this.triggerRef);
			return () => {
				this.menu.deRegisterTrigger(this.triggerRef);
			};
		});
	}

	#onpointerenter = () => {
		this.wasClickClose = false;
		this.item.wasEscapeClose = false;
	};

	#onpointermove = (e: PointerEvent) => {
		if (e.pointerType !== "mouse") return;
		if (
			this.disabled.value ||
			this.wasClickClose ||
			this.item.wasEscapeClose ||
			this.hasPointerMoveOpened.value
		)
			return;
		this.menu.onTriggerEnter(this.item.value.value);
		this.hasPointerMoveOpened.value = true;
	};

	#onpointerleave = (e: PointerEvent) => {
		if (e.pointerType !== "mouse" || this.disabled.value) return;
		this.menu.onTriggerLeave?.();
		this.hasPointerMoveOpened.value = false;
	};

	#onclick = (e: PointerEvent) => {
		// if opened via pointer move, we prevent clicke event
		if (this.hasPointerMoveOpened.value) return;
		if (this.open) {
			this.menu.onItemSelect("");
		} else {
			this.menu.onItemSelect(this.item.value.value);
		}
		this.wasClickClose = this.open;
	};

	#onkeydown = (e: KeyboardEvent) => {
		const verticalEntryKey = this.menu.dir.value === "rtl" ? kbd.ARROW_LEFT : kbd.ARROW_RIGHT;
		const entryKey = {
			horizontal: kbd.ARROW_DOWN,
			vertical: verticalEntryKey,
		}[this.menu.orientation.value];
		if (this.open && e.key === entryKey) {
			this.item.onEntryKeydown();
			e.preventDefault();
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				disabled: getDisabledAttr(this.disabled.value),
				"data-disabled": getDataDisabled(this.disabled.value),
				"data-state": getDataOpenClosed(this.open),
				"aria-expanded": getAriaExpanded(this.open),
				"aria-controls": this.item.contentNode ? this.item.contentNode.id : undefined,
				"data-value": this.item.value.value,
				onpointerenter: this.#onpointerenter,
				onpointermove: this.#onpointermove,
				onpointerleave: this.#onpointerleave,
				onclick: this.#onclick,
				onkeydown: this.#onkeydown,
				[TRIGGER_ATTR]: "",
			}) as const
	);

	visuallyHiddenProps = $derived.by(
		() =>
			({
				id: this.item.focusProxyId.value,
				"aria-hidden": "true",
				tabIndex: 0,
				onfocus: (e: FocusEvent) => {
					const prevFocusedElement = e.relatedTarget as HTMLElement | null;
					const wasTriggerFocused = prevFocusedElement === this.item.triggerNode;
					const wasFocusFromContent = this.item.contentNode?.contains(prevFocusedElement);

					if (wasTriggerFocused || !wasFocusFromContent) {
						e.preventDefault();
						this.item.onFocusProxyEnter(wasTriggerFocused ? "start" : "end");
					}
				},
			}) as const
	);
}

type NavigationMenuLinkStateProps = ReadableBoxedValues<{
	id: string;
	active: boolean;
	onSelect: (e: Event) => void;
}>;

class NavigationMenuLinkState {
	id: NavigationMenuItemState["id"];
	active: NavigationMenuLinkStateProps["active"];
	onSelect: NavigationMenuLinkStateProps["onSelect"];

	constructor(props: NavigationMenuLinkStateProps) {
		this.id = props.id;
		this.active = props.active;
		this.onSelect = props.onSelect;
	}

	#onclick = (e: MouseEvent) => {
		const linkSelectEvent = new CustomEvent("navigationMenu.linkSelect", {
			bubbles: true,
			cancelable: true,
		});

		this.onSelect.value(linkSelectEvent);

		if (!linkSelectEvent.defaultPrevented && !e.metaKey) {
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				"data-active": this.active.value ? "" : undefined,
				"aria-current": this.active.value ? "page" : undefined,
				onclick: this.#onclick,
				onfocus: (e: FocusEvent) => {},
			}) as const
	);
}

type NavigationMenuIndicatorStateProps = ReadableBoxedValues<{
	id: string;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class NavigationMenuIndicatorState {
	id: NavigationMenuIndicatorStateProps["id"];
	menu: NavigationMenuMenuState | NavigationMenuSubState;
	activeTrigger = $state<HTMLElement | null>(null);
	position = $state<{ size: number; offset: number } | null>(null);
	isHorizontal = $derived.by(() => this.menu.orientation.value === "horizontal");
	isVisible = $derived.by(() => Boolean(this.menu.value.value));
	indicatorRef: NavigationMenuIndicatorStateProps["ref"];

	constructor(
		props: NavigationMenuIndicatorStateProps,
		menu: NavigationMenuMenuState | NavigationMenuSubState
	) {
		this.id = props.id;
		this.indicatorRef = props.ref;
		this.menu = menu;

		useRefById({
			id: this.id,
			ref: this.indicatorRef,
			onRefChange: (node) => {
				this.menu.viewportNode = node;
			},
		});

		$effect(() => {
			const triggerNodes = this.menu.getTriggerNodes();
			const triggerNode = triggerNodes.find(
				(node) => node.dataset.value === this.menu.value.value
			);
			if (triggerNode) {
				untrack(() => {
					this.activeTrigger = triggerNode;
				});
			}
		});

		useResizeObserver(() => this.activeTrigger, this.handlePositionChange);
		useResizeObserver(() => this.menu.indicatorTrackNode, this.handlePositionChange);
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
				"aria-hidden": getAriaHidden(true),
				"data-state": this.isVisible ? "visible" : "hidden",
				"data-orientation": getDataOrientation(this.menu.orientation.value),
				style: {
					position: "absolute",
					...(this.isHorizontal
						? {
								left: 0,
								width: this.position ? `${this.position.size}px` : undefined,
								transform: this.position
									? `translateX(${this.position.offset}px)`
									: undefined,
							}
						: {
								top: 0,
								height: this.position ? `${this.position.size}px` : undefined,
								transform: this.position
									? `translateY(${this.position.offset}px)`
									: undefined,
							}),
				},
			}) as const
	);
}

type NavigationMenuContentStateProps = ReadableBoxedValues<{
	id: string;
	forceMount: boolean;
	isMounted: boolean;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

type MotionAttribute = "to-start" | "to-end" | "from-start" | "from-end";

class NavigationMenuContentState {
	id: NavigationMenuContentStateProps["id"];
	forceMount: NavigationMenuContentStateProps["forceMount"];
	isMounted: NavigationMenuContentStateProps["isMounted"];
	contentRef: NavigationMenuContentStateProps["ref"];
	menu: NavigationMenuMenuState | NavigationMenuSubState;
	item: NavigationMenuItemState;
	prevMotionAttribute = $state<MotionAttribute | null>(null);
	motionAttribute = $state<MotionAttribute | null>(null);
	open = $derived.by(() => this.menu.value.value === this.item.value.value);
	isPresent = $derived.by(() => this.open || this.forceMount.value);

	constructor(props: NavigationMenuContentStateProps, item: NavigationMenuItemState) {
		this.id = props.id;
		this.forceMount = props.forceMount;
		this.isMounted = props.isMounted;
		this.item = item;
		this.menu = item.menu;
		this.contentRef = props.ref;

		useRefById({
			id: this.id,
			ref: this.contentRef,
			onRefChange: (node) => {
				this.item.contentNode = node;
			},
			condition: () => this.isMounted.value,
		});

		$effect(() => {
			const items = this.menu.getTriggerNodes();
			const prev = this.menu.previousValue.current;
			const values = items
				.map((item) => item.dataset.value)
				.filter((v): v is string => Boolean(v));
			if (this.menu.dir.value === "rtl") values.reverse();
			const index = values.indexOf(this.menu.value.value);
			const prevIndex = values.indexOf(prev ?? "");
			const isSelected = this.item.value.value === this.menu.value.value;
			const wasSelected = prevIndex === values.indexOf(this.item.value.value);

			// We only want to update selected and the last selected content
			// this avoids animations being interrupted outside of that range
			if (!isSelected && !wasSelected) {
				this.motionAttribute = this.prevMotionAttribute;
			}

			const attribute = (() => {
				// Don't provide a direction on the initial open
				if (index !== prevIndex) {
					// If we're moving to this item from another
					if (isSelected && prevIndex !== -1) {
						return index > prevIndex ? "from-end" : "from-start";
					}
					// If we're leaving this item for another
					if (wasSelected && index !== -1) {
						return index > prevIndex ? "to-start" : "to-end";
					}
				}
				// Otherwise we're entering from closed or leaving the list
				// entirely and should not animate in any direction
				return null;
			})();

			this.prevMotionAttribute = attribute;
			this.motionAttribute = attribute;
		});
	}

	onFocusOutside = (e: Event) => {
		this.item.onContentFocusOutside();
		const target = e.target as HTMLElement;
		// only dismiss content when focus moves outside the menu

		if (this.menu.root.rootRef.value?.contains(target)) {
			e.preventDefault();
		} else {
			this.menu.root.handleClose();
		}
	};

	onInteractOutside = (e: Event) => {
		if (e.defaultPrevented) return;
		const target = e.target as HTMLElement;
		const isTrigger = this.menu.getTriggerNodes().some((node) => node.contains(target));

		const isRootViewport = this.menu.isRoot && this.menu.viewportNode?.contains(target);

		if (isTrigger || isRootViewport || !this.menu.isRoot) {
			e.preventDefault();
		}
	};

	onEscapeKeydown = (e: KeyboardEvent) => {
		this.menu.root.handleClose();
		const target = e.target as HTMLElement;

		if (this.contentRef.value?.contains(target)) {
			this.item.triggerNode?.focus();
		}
		this.item.wasEscapeClose = true;
	};

	#onkeydown = (e: KeyboardEvent) => {
		const isMetaKey = e.altKey || e.ctrlKey || e.metaKey;
		const isTabKey = e.key === kbd.TAB && !isMetaKey;

		const candidates = getTabbableCandidates(e.currentTarget as HTMLElement);
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
				this.item.focusProxyNode?.focus();
				return;
			}
		}
		const newSelectedElement = useArrowNavigation(
			e,
			document.activeElement as HTMLElement,
			undefined,
			{
				itemsArray: candidates,
				attributeName: `[${LINK_ATTR}]`,
				loop: false,
				enableIgnoredElement: true,
			}
		);

		newSelectedElement?.focus();
	};

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				"aria-labelledby": this.item.triggerNode?.id ?? undefined,
				"data-motion": this.motionAttribute,
				"data-state": getDataOpenClosed(this.menu.value.value === this.item.value.value),
				"data-orientation": getDataOrientation(this.menu.orientation.value),
				[CONTENT_ATTR]: "",
				style: {
					pointerEvents: !this.open && this.menu.isRoot ? "none" : undefined,
				},
				onkeydown: this.#onkeydown,
			}) as const
	);
}

type NavigationMenuViewportStateProps = ReadableBoxedValues<{
	id: string;
}> &
	WritableBoxedValues<{
		ref: HTMLElement | null;
	}>;

class NavigationMenuViewportState {
	id: NavigationMenuViewportStateProps["id"];
	menu: NavigationMenuMenuState | NavigationMenuSubState;
	size = $state<{ width: number; height: number } | null>(null);
	open = $derived.by(() => this.menu.value.value !== "");
	activeContentValue = $derived.by(() => this.menu.value.value);
	viewportRef: NavigationMenuViewportStateProps["ref"];
	contentNode = $state<HTMLElement | null>();

	constructor(
		props: NavigationMenuViewportStateProps,
		menu: NavigationMenuMenuState | NavigationMenuSubState
	) {
		this.id = props.id;
		this.menu = menu;
		this.viewportRef = props.ref;

		useRefById({
			id: this.id,
			ref: this.viewportRef,
			onRefChange: (node) => {
				this.menu.viewportNode = node;
			},
			condition: () => this.open,
		});

		$effect(() => {
			this.open;
			this.activeContentValue;
			const currentNode = untrack(() => this.viewportRef.value);
			if (!currentNode) return;
			afterTick(() => {
				const contentNode = currentNode.querySelector("[data-state=open]")
					?.children?.[0] as HTMLElement;
				this.contentNode = contentNode;
			});
		});

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
	}

	#onpointerenter = () => {
		this.menu.onContentEnter?.();
	};

	#onpointerleave = (e: PointerEvent) => {
		if (e.pointerType !== "mouse") return;
		this.menu.onContentLeave?.();
	};

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				"data-state": getDataOpenClosed(this.open),
				"data-orientation": getDataOrientation(this.menu.orientation.value),
				style: {
					pointerEvents: !this.open && this.menu.isRoot ? "none" : undefined,
					"--bits-navigation-menu-viewport-width": this.size
						? `${this.size.width}px`
						: undefined,
					"--bits-navigation-menu-viewport-height": this.size
						? `${this.size.height}px`
						: undefined,
				},
				onpointerenter: this.#onpointerenter,
				onpointerleave: this.#onpointerleave,
			}) as const
	);
}

export function useNavigationMenuRoot(props: NavigationMenuRootStateProps) {
	const rootState = new NavigationMenuRootState(props);
	const menuState = rootState.createMenu({
		rootNavigationId: rootState.id,
		dir: rootState.dir,
		orientation: rootState.orientation,
		value: rootState.value,
		isRoot: true,
		onTriggerEnter: rootState.onTriggerEnter,
		onItemSelect: rootState.onItemSelect,
		onItemDismiss: rootState.onItemDismiss,
		onContentEnter: rootState.onContentEnter,
		onContentLeave: rootState.onContentLeave,
		onTriggerLeave: rootState.onTriggerLeave,
		previousValue: rootState.previousValue,
	});

	setNavigationMenuMenuContext(menuState);
	return setNavigationMenuRootContext(rootState);
}

export function useNavigationMenuSub(props: NavigationMenuSubStateProps) {
	const parentMenu = getNavigationMenuMenuContext();
	if (parentMenu instanceof NavigationMenuMenuState) {
		return setNavigationMenuMenuContext(
			parentMenu.createSubMenu(props)
		) as NavigationMenuSubState;
	}
	throw new Error("useNavigationMenuSub must be used within a NavigationMenuMenu");
}

export function useNavigationMenuList(props: NavigationMenuListStateProps) {
	const menuState = getNavigationMenuMenuContext();
	return menuState.createList(props);
}

export function useNavigationMenuItem(props: NavigationMenuItemStateProps) {
	const menuState = getNavigationMenuMenuContext();
	return setNavigationMenuItemContext(menuState.createItem(props));
}

export function useNavigationMenuTrigger(props: NavigationMenuTriggerStateProps) {
	return getNavigationMenuItemContext().createTrigger(props);
}

export function useNavigationMenuContent(props: NavigationMenuContentStateProps) {
	return getNavigationMenuItemContext().createContent(props);
}

export function useNavigationMenuViewport(props: NavigationMenuViewportStateProps) {
	return getNavigationMenuMenuContext().createViewport(props);
}

export function useNavigationMenuIndicator(props: NavigationMenuIndicatorStateProps) {
	return getNavigationMenuMenuContext().createIndicator(props);
}

export function useNavigationMenuLink(props: NavigationMenuLinkStateProps) {
	return getNavigationMenuItemContext().createLink(props);
}

/// Utils

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

function useResizeObserver(element: () => HTMLElement | null | undefined, onResize: () => void) {
	$effect(() => {
		let rAF = 0;
		const node = element();
		if (node) {
			const resizeObserver = new ResizeObserver(() => {
				cancelAnimationFrame(rAF);
				rAF = window.requestAnimationFrame(onResize);
			});

			resizeObserver.observe(node);

			return () => {
				window.cancelAnimationFrame(rAF);
				resizeObserver.unobserve(node);
			};
		}
	});
}
