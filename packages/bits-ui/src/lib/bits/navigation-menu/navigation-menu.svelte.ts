import { untrack } from "svelte";
import { box, type WritableBox } from "svelte-toolbelt";
import { Previous, useDebounce } from "runed";
import { getTabbableCandidates } from "../utilities/focus-scope/utils.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
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
import { isBrowser } from "$lib/internal/is.js";
import { useArrowNavigation } from "$lib/internal/useArrowNavigation.js";
import { boxAutoReset } from "$lib/internal/boxAutoReset.svelte.js";

const [setNavigationMenuRootContext, getNavigationMenuRootContext] =
	createContext<NavigationMenuRootState>("NavigationMenu.Root");

const [setNavigationMenuMenuContext, getNavigationMenuMenuContext] =
	createContext<NavigationMenuMenuState>("NavigationMenu.Root or NavigationMenu.Sub");

const [setNavigationMenuItemContext, getNavigationMenuItemContext] =
	createContext<NavigationMenuItemState>("NavigationMenu.Item");

const EVENT_ROOT_CONTENT_DISMISS = "navigationMenu.rootContentDismiss";

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
	WritableBoxedValues<{ value: string }>;

class NavigationMenuRootState {
	id: NavigationMenuRootStateProps["id"];
	delayDuration: NavigationMenuRootStateProps["delayDuration"];
	skipDelayDuration: NavigationMenuRootStateProps["skipDelayDuration"];
	orientation: NavigationMenuRootStateProps["orientation"];
	dir: NavigationMenuRootStateProps["dir"];
	value: NavigationMenuRootStateProps["value"];
	previousValue = new Previous(() => this.value.value);
	triggerIds = new Set<string>();
	isDelaySkipped: WritableBox<boolean>;
	derivedDelay = $derived.by(() => {
		const isOpen = this.value?.value !== "";
		if (isOpen || this.isDelaySkipped?.value) return 150;
		return this.delayDuration.value;
	});

	setValue = useDebounce((v: string) => {
		if (this.value.value === v) return;
		this.value.value = v;
	}, this.derivedDelay);

	constructor(props: NavigationMenuRootStateProps) {
		this.id = props.id;
		this.delayDuration = props.delayDuration;
		this.skipDelayDuration = props.skipDelayDuration;
		this.orientation = props.orientation;
		this.dir = props.dir;
		this.value = props.value;
		this.isDelaySkipped = boxAutoReset(false, this.skipDelayDuration.value);
	}

	getNode = () => {
		return document.getElementById(this.id.value);
	};

	registerTriggerId = (triggerId: string) => {
		this.triggerIds.add(triggerId);
	};

	deRegisterTriggerId = (triggerId: string) => {
		this.triggerIds.delete(triggerId);
	};

	getTriggerNodes = () => {
		return Array.from(this.triggerIds)
			.map((triggerId) => document.getElementById(triggerId))
			.filter((node): node is HTMLElement => Boolean(node));
	};

	onTriggerEnter = (itemValue: string) => {
		this.setValue(itemValue);
	};

	onTriggerLeave = () => {
		this.isDelaySkipped.value = false;
		this.setValue("");
	};

	onContentEnter = (itemValue: string) => {
		this.setValue(itemValue);
	};

	onContentLeave = () => {
		this.setValue("");
	};

	onItemSelect = (itemValue: string) => {
		this.value.value = itemValue;
	};

	onItemDismiss = () => {
		this.value.value = "";
	};

	props = $derived.by(() => ({
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
		onContentEnter?: (itemValue: string) => void;
		onContentLeave?: () => void;
		onItemSelect: (itemValue: string) => void;
		onItemDismiss: () => void;
		getTriggerNodes: () => HTMLElement[];
		registerTriggerId: (triggerId: string) => void;
		deRegisterTriggerId: (triggerId: string) => void;
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
	getTriggerNodes: NavigationMenuMenuStateProps["getTriggerNodes"];
	registerTriggerId: NavigationMenuMenuStateProps["registerTriggerId"];
	deRegisterTriggerId: NavigationMenuMenuStateProps["deRegisterTriggerId"];
	viewportId = box.with<string | undefined>(() => undefined);
	viewportContentId = box.with<string | undefined>(() => undefined);
	indicatorTrackId = box.with<string | undefined>(() => undefined);
	root: NavigationMenuRootState;

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
		this.deRegisterTriggerId = props.deRegisterTriggerId;
		this.registerTriggerId = props.registerTriggerId;
		this.getTriggerNodes = props.getTriggerNodes;
		this.root = root;
		this.previousValue = props.previousValue;
	}

	getViewportNode = () => {
		return document.getElementById(this.viewportId.value ?? "");
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
}

type NavigationMenuListStateProps = ReadableBoxedValues<{
	id: string;
}>;

class NavigationMenuListState {
	id: NavigationMenuListStateProps["id"];
	indicatorId = box(useId());

	constructor(
		props: NavigationMenuListStateProps,
		private menu: NavigationMenuMenuState
	) {
		this.id = props.id;
	}

	indicatorProps = $derived.by(
		() =>
			({
				id: this.indicatorId.value,
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
	contentId = box.with<string | undefined>(() => undefined);
	triggerId = box.with<string | undefined>(() => undefined);
	focusProxyId = box.with<string | undefined>(() => useId());
	restoreContentTabOrder = $state(() => {});
	wasEscapeClose = $state(false);
	menu: NavigationMenuMenuState;

	constructor(props: NavigationMenuItemStateProps, menu: NavigationMenuMenuState) {
		this.id = props.id;
		this.value = props.value;
		this.menu = menu;
	}

	getContentNode = () => {
		return document.getElementById(this.contentId.value ?? "");
	};

	getTriggerNode = () => {
		return document.getElementById(this.triggerId.value ?? "");
	};

	getFocusProxyNode = () => {
		return document.getElementById(this.focusProxyId.value ?? "");
	};

	#handleContentEntry = (side: "start" | "end" = "start") => {
		const contentNode = this.getContentNode();
		if (!contentNode) return;
		this.restoreContentTabOrder();
		const candidates = getTabbableCandidates(contentNode);
		if (candidates.length) {
			focusFirst(side === "start" ? candidates : candidates.reverse());
		}
	};

	#handleContentExit = () => {
		const contentNode = this.getContentNode();
		if (!contentNode) return;
		const candidates = getTabbableCandidates(contentNode);
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
}>;

class NavigationMenuTriggerState {
	menu: NavigationMenuMenuState;
	item: NavigationMenuItemState;
	disabled: NavigationMenuTriggerStateProps["disabled"];
	hasPointerMoveOpened = boxAutoReset(false, 300);
	wasClickClose = $state(false);
	open = $derived.by(() => this.item.value.value === this.menu.value.value);

	constructor(props: NavigationMenuTriggerStateProps, item: NavigationMenuItemState) {
		this.item = item;
		this.menu = item.menu;
		this.item.triggerId = props.id;
		this.disabled = props.disabled;
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
			e.stopPropagation();
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.item.triggerId.value,
				disabled: getDisabledAttr(this.disabled.value),
				"data-disabled": getDataDisabled(this.disabled.value),
				"data-state": getDataOpenClosed(this.open),
				"aria-expanded": getAriaExpanded(this.open),
				"aria-controls": this.item.contentId.value ? this.item.contentId.value : undefined,
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
					const contentNode = this.item.getContentNode();
					const prevFocusedElement = e.relatedTarget as HTMLElement | null;
					const wasTriggerFocused = prevFocusedElement === this.item.getFocusProxyNode();
					const wasFocusFromContent = contentNode?.contains(prevFocusedElement);

					if (wasTriggerFocused || !wasFocusFromContent) {
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
		const linkSelectEvent = new CustomEvent(" navigationMenu.linkSelect", {
			bubbles: true,
			cancelable: true,
		});

		this.onSelect.value(linkSelectEvent);

		if (!linkSelectEvent.defaultPrevented && !e.metaKey) {
			// TODO: handle dismiss
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				"data-active": this.active.value ? "" : undefined,
				"aria-current": this.active.value ? "page" : undefined,
				onclick: this.#onclick,
			}) as const
	);
}

type NavigationMenuIndicatorStateProps = ReadableBoxedValues<{
	id: string;
}>;

class NavigationMenuIndicatorState {
	id: NavigationMenuIndicatorStateProps["id"];
	menu: NavigationMenuMenuState;
	activeTrigger = $state<HTMLElement | null>(null);
	position = $state<{ size: number; offset: number } | null>(null);
	isHorizontal = $derived.by(() => this.menu.orientation.value === "horizontal");
	isVisible = $derived.by(() => Boolean(this.menu.value.value));
	indicatorTrackNode = $state<HTMLElement | null>(null);

	constructor(props: NavigationMenuIndicatorStateProps, menu: NavigationMenuMenuState) {
		this.id = props.id;
		this.menu = menu;

		$effect(() => {
			const triggerNodes = this.menu.getTriggerNodes();
			const triggerNode = triggerNodes.find(
				(node) => node.dataset.value === untrack(() => this.menu.value.value)
			);
			if (triggerNode) {
				untrack(() => {
					this.activeTrigger = triggerNode;
				});
			}
		});

		$effect(() => {
			const indicatorTrackNode = document.getElementById(
				this.menu.indicatorTrackId.value ?? ""
			);
			untrack(() => (this.indicatorTrackNode = indicatorTrackNode));
		});

		useResizeObserver(() => this.activeTrigger, this.handlePositionChange);
		useResizeObserver(() => this.indicatorTrackNode, this.handlePositionChange);
	}

	handlePositionChange = () => {
		untrack(() => {
			if (!this.activeTrigger) return;
			this.position = {
				size: this.isHorizontal
					? this.activeTrigger.offsetWidth
					: this.activeTrigger.offsetHeight,
				offset: this.isHorizontal
					? this.activeTrigger.offsetLeft
					: this.activeTrigger.offsetTop,
			};
		});
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
}>;

type MotionAttribute = "to-start" | "to-end" | "from-start" | "from-end";

class NavigationMenuContentState {
	id: NavigationMenuContentStateProps["id"];
	menu: NavigationMenuMenuState;
	item: NavigationMenuItemState;
	prevMotionAttribute = $state<MotionAttribute | null>(null);
	motionAttribute = $state<MotionAttribute | null>(null);
	open = $derived.by(() => this.menu.value.value === this.item.value.value);
	// isLastActiveValue = $derived.by(() => {
	// 	if (!isBrowser) return false;
	// 	if (this.menu.viewportId.value) {
	// 		const viewportNode = document.getElementById(this.menu.viewportId.value);
	// 		if (viewportNode) {
	// 			if (!this.menu.value.value && this.menu.previousValue.current) {
	// 				return this.menu.previousValue.current === this.item.value.value;
	// 			}
	// 		}
	// 	}
	// 	return false;
	// });

	constructor(props: NavigationMenuContentStateProps, item: NavigationMenuItemState) {
		this.id = props.id;
		this.item = item;
		this.menu = item.menu;

		// $effect(() => {
		// 	console.log("1");
		// 	const contentNode = this.getNode();
		// 	if (this.menu.isRoot && contentNode) {
		// 		// bubble dimiss to the root content node and focus its trigger
		// 		const handleClose = () => {
		// 			this.menu.onItemDismiss();
		// 			this.item.onRootContentClose();
		// 			if (contentNode.contains(document.activeElement)) {
		// 				this.item.getTriggerNode()?.focus();
		// 			}
		// 		};

		// 		contentNode.addEventListener(EVENT_ROOT_CONTENT_DISMISS, handleClose);

		// 		return () => {
		// 			contentNode.removeEventListener(EVENT_ROOT_CONTENT_DISMISS, handleClose);
		// 		};
		// 	}
		// });

		// $effect(() => {
		// 	const items = untrack(() => this.menu.getTriggerNodes());
		// 	const prev = untrack(() => this.menu.previousValue.value);
		// 	const values = items
		// 		.map((item) => item.dataset.value)
		// 		.filter((v): v is string => Boolean(v));
		// 	if (this.menu.dir.value === "rtl") values.reverse();
		// 	const index = values.indexOf(this.menu.value.value);
		// 	const prevIndex = values.indexOf(prev ?? "");
		// 	const isSelected = untrack(() => this.item.value.value === this.menu.value.value);
		// 	const wasSelected = untrack(() => prevIndex === values.indexOf(this.item.value.value));

		// 	// We only want to update selected and the last selected content
		// 	// this avoids animations being interrupted outside of that range
		// 	if (!isSelected && !wasSelected) {
		// 		untrack(() => (this.motionAttribute = this.prevMotionAttribute));
		// 	}

		// 	untrack(() => {
		// 		const attribute = (() => {
		// 			// Don't provide a direction on the initial open
		// 			if (index !== prevIndex) {
		// 				// If we're moving to this item from another
		// 				if (isSelected && prevIndex !== -1) {
		// 					return index > prevIndex ? "from-end" : "from-start";
		// 				}
		// 				// If we're leaving this item for another
		// 				if (wasSelected && index !== -1) {
		// 					return index > prevIndex ? "to-start" : "to-end";
		// 				}
		// 			}
		// 			// Otherwise we're entering from closed or leaving the list
		// 			// entirely and should not animate in any direction
		// 			return null;
		// 		})();
		// 		this.prevMotionAttribute = attribute;
		// 		this.motionAttribute = attribute;
		// 	});
		// });
	}

	getNode = () => {
		return document.getElementById(this.id.value);
	};

	onFocusOutside = (e: Event) => {
		if (e.defaultPrevented) return;
		this.item.onContentFocusOutside();
		const target = e.target as HTMLElement;
		// only dismiss content when focus moves outside the menu
		if (this.menu.root.getNode()?.contains(target)) {
			e.preventDefault();
		}
	};

	onInteractOutside = (e: Event) => {
		if (e.defaultPrevented) return;
		const target = e.target as HTMLElement;
		const isTrigger = this.menu.getTriggerNodes().some((node) => node.contains(target));
		const isRootViewport = this.menu.isRoot && this.menu.getViewportNode()?.contains(target);

		if (isTrigger || isRootViewport || !this.menu.isRoot) {
			e.preventDefault();
		}
	};

	onEscapeKeydown = (e: KeyboardEvent) => {
		if (e.defaultPrevented) return;
		this.menu.onItemDismiss();
		this.item.getTriggerNode()?.focus();
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
			} else {
				// If we can't focus that means we're at the edges
				// so focus the proxy and let browser handle
				// tab/shift+tab keypress on the proxy instead
				this.item.getFocusProxyNode()?.focus();
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
				"aria-labelledby": this.item.triggerId.value,
				"data-motion": this.motionAttribute,
				"data-state": getDataOpenClosed(this.menu.value.value === this.item.value.value),
				"data-orientation": getDataOrientation(this.menu.orientation.value),
				[CONTENT_ATTR]: "",
				onkeydown: this.#onkeydown,
			}) as const
	);
}

type NavigationMenuViewportStateProps = ReadableBoxedValues<{
	id: string;
}>;

class NavigationMenuViewportState {
	id: NavigationMenuViewportStateProps["id"];
	menu: NavigationMenuMenuState;
	size = $state<{ width: number; height: number } | null>(null);
	open = $derived.by(() => this.menu.value.value !== "");
	activeContentValue = $derived.by(() => this.menu.value.value);
	contentNode = $state<HTMLElement | null>();

	constructor(props: NavigationMenuViewportStateProps, menu: NavigationMenuMenuState) {
		this.id = props.id;
		this.menu = menu;
		this.menu.viewportId = props.id;

		$effect(() => {
			this.open;
			this.activeContentValue;
			const currentNode = untrack(() => this.getNode());
			if (!currentNode) return;
			untrack(() => {
				this.contentNode = currentNode.querySelector("[data-state=open]")
					?.children?.[0] as HTMLElement | null;
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

	getNode = () => {
		return document.getElementById(this.id.value);
	};

	#onpointerenter = () => {
		this.menu.onContentEnter?.(this.menu.value.value);
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

// Context Methods

// export function useNavigationMenuSub(props: NavigationMenuSubStateProps) {
// 	const rootState = getNavigationMenuRootContext();
// 	const menuState = rootState.createMenu({
// 		getTriggerNodes: rootState.getTriggerNodes,
// 		rootNavigationId: rootState.id,
// 		dir: rootState.dir,
// 		orientation: rootState.orientation,
// 		value: rootState.value,
// 		isRoot: false,
// 		deRegisterTriggerId: rootState.deRegisterTriggerId,
// 		registerTriggerId: rootState.registerTriggerId,
// 		onTriggerEnter: rootState.onTriggerEnter,
// 		onItemSelect: rootState.onItemSelect,
// 		onItemDismiss: rootState.onItemDismiss,
// 		onContentEnter: rootState.onContentEnter,
// 		onContentLeave: rootState.onContentLeave,
// 		onTriggerLeave: rootState.onTriggerLeave,
// 		previousValue: new Previous,
// 	});

// 	setNavigationMenuMenuContext(menuState);
// 	return new NavigationMenuSubState(
// 		{
// 			dir: props.dir,
// 			id: props.id,
// 			orientation: props.orientation,
// 			value: props.value,
// 		},
// 		rootState
// 	);
// }

export function useNavigationMenuRoot(props: NavigationMenuRootStateProps) {
	const rootState = new NavigationMenuRootState(props);
	const menuState = rootState.createMenu({
		getTriggerNodes: rootState.getTriggerNodes,
		rootNavigationId: rootState.id,
		dir: rootState.dir,
		orientation: rootState.orientation,
		value: rootState.value,
		isRoot: true,
		deRegisterTriggerId: rootState.deRegisterTriggerId,
		registerTriggerId: rootState.registerTriggerId,
		onTriggerEnter: rootState.onTriggerEnter,
		onItemSelect: rootState.onItemSelect,
		onItemDismiss: rootState.onItemDismiss,
		onContentEnter: rootState.onContentEnter,
		onContentLeave: rootState.onContentLeave,
		onTriggerLeave: rootState.onTriggerLeave,
		previousValue: rootState.previousValue,
	});

	setNavigationMenuMenuContext(menuState);
	return setNavigationMenuRootContext(new NavigationMenuRootState(props));
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
	return new NavigationMenuLinkState(props);
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
