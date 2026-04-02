import {
	attachRef,
	boxWith,
	onDestroyEffect,
	onMountEffect,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "svelte-toolbelt";
import { Context, watch } from "runed";
import {
	createBitsAttrs,
	boolToEmptyStrOrUndef,
	boolToStr,
	boolToStrTrueOrUndef,
	getDataOpenClosed,
	getDataTransitionAttrs,
	type TransitionState,
} from "$lib/internal/attrs.js";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	OnChangeFn,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import { kbd } from "$lib/internal/kbd.js";
import { isIOS } from "$lib/internal/is.js";
import { PresenceManager } from "$lib/internal/presence-manager.svelte.js";
import type { DrawerSnapPoint, DrawerSwipeDirection } from "./types.js";
import {
	SwipeDismiss,
	getDisplacement,
	getElementTransform,
	type SwipeDirection,
} from "./swipe-dismiss.svelte.js";
import { SvelteMap } from "svelte/reactivity";

type ResolvedDrawerSnapPoint = {
	value: DrawerSnapPoint;
	height: number;
	offset: number;
};

type ScrollAxis = "horizontal" | "vertical";

type TouchScrollState = {
	startX: number;
	startY: number;
	lastX: number;
	lastY: number;
	scrollTarget: HTMLElement | null;
	hasCrossAxisScrollableContent: boolean;
	allowSwipe: boolean | null;
	preserveNativeCrossAxisScroll: boolean;
};

type DrawerViewportSwipeDelegate = {
	onpointerdown(event: PointerEvent): void;
	onpointermove(event: PointerEvent): void;
	onpointerup(event: PointerEvent): void;
	onpointercancel(event: PointerEvent): void;
	ontouchstart(event: TouchEvent): void;
	ontouchmove(event: TouchEvent): void;
	ontouchend(event: TouchEvent): void;
	ontouchcancel(event: TouchEvent): void;
	isSwipeGestureActive(): boolean;
};

const FAST_SWIPE_VELOCITY = 0.5;
const SNAP_VELOCITY_THRESHOLD = 0.5;
const SNAP_VELOCITY_MULTIPLIER = 300;
const MAX_SNAP_VELOCITY = 4;
const BITS_UI_SWIPE_IGNORE_SELECTOR = "[data-bits-ui-swipe-ignore], [data-swipe-ignore]";
const IOS_FOCUS_RELAY_CLONE_ATTR = "data-bits-ui-focus-relay-clone";
const IOS_FOCUS_RELAY_DELAY_MS = 32;
const IOS_VIRTUAL_KEYBOARD_DELTA_THRESHOLD = 200;
const IOS_KEYBOARD_INSET_MIN_PX = 80;
const IOS_KEYBOARD_FOCUS_VISIBILITY_GUTTER_PX = 16;
const IOS_RECENT_TOUCH_INTENT_WINDOW_MS = 350;
const NON_KEYBOARD_INPUT_TYPES = new Set([
	"button",
	"checkbox",
	"color",
	"file",
	"hidden",
	"image",
	"radio",
	"range",
	"reset",
	"submit",
]);

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

function isElement(target: EventTarget | null): target is Element {
	return target instanceof Element;
}

function isRangeInput(target: EventTarget | null): target is HTMLInputElement {
	return target instanceof HTMLInputElement && target.type === "range";
}

function isTextSelectionControl(
	target: EventTarget | null
): target is HTMLInputElement | HTMLTextAreaElement {
	return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

function isVirtualKeyboardTarget(target: EventTarget | null): target is HTMLElement {
	if (target instanceof HTMLTextAreaElement) {
		return !target.disabled && !target.readOnly;
	}
	if (target instanceof HTMLInputElement) {
		if (target.disabled || target.readOnly) return false;
		return !NON_KEYBOARD_INPUT_TYPES.has(target.type);
	}
	if (target instanceof HTMLSelectElement) {
		return !target.disabled;
	}
	return target instanceof HTMLElement && target.isContentEditable;
}

function isTextEditableInputTarget(target: EventTarget | null): target is HTMLElement {
	if (target instanceof HTMLTextAreaElement) {
		return !target.disabled && !target.readOnly;
	}
	if (target instanceof HTMLInputElement) {
		if (target.disabled || target.readOnly) return false;
		return !NON_KEYBOARD_INPUT_TYPES.has(target.type);
	}
	return target instanceof HTMLElement && target.isContentEditable;
}

function isSelectLikeInputTarget(target: EventTarget | null) {
	return (
		target instanceof HTMLSelectElement ||
		(target instanceof HTMLInputElement && target.type === "color")
	);
}

function isSensitiveAuthInputTarget(target: EventTarget | null) {
	if (!(target instanceof HTMLInputElement)) return false;
	if (target.type === "password") return true;
	if (target.type === "text" && target.autocomplete === "username") return true;
	return Boolean(target.closest("form")?.querySelector('input[type="password"]'));
}

function isNearKeyboardVisualViewportEdge(target: HTMLElement) {
	const win = target.ownerDocument.defaultView;
	const visualViewport = win?.visualViewport;
	if (!visualViewport) return false;
	const targetRect = target.getBoundingClientRect();
	const viewportHeight = visualViewport.height;
	const offsetFromKeyboardEdge = viewportHeight - targetRect.bottom;
	return (
		offsetFromKeyboardEdge > -targetRect.height / 2 &&
		offsetFromKeyboardEdge < targetRect.height + 32
	);
}

function getLayoutViewportHeight(win: Window) {
	return Math.max(win.innerHeight, win.document.documentElement.clientHeight);
}

function focusWithoutScroll(target: HTMLElement) {
	target.focus({ preventScroll: true });
}

function hasExpandedSelectionWithinTarget(selection: Selection, target: Element): boolean {
	const anchorElement =
		selection.anchorNode instanceof Element
			? selection.anchorNode
			: selection.anchorNode?.parentElement;
	const focusElement =
		selection.focusNode instanceof Element
			? selection.focusNode
			: selection.focusNode?.parentElement;
	return (
		selection.containsNode(target, true) ||
		(anchorElement != null && target.contains(anchorElement)) ||
		(focusElement != null && target.contains(focusElement))
	);
}

function shouldIgnoreSwipeForTextSelection(doc: Document, rootElement: HTMLElement): boolean {
	const activeElement = doc.activeElement;
	if (
		activeElement &&
		rootElement.contains(activeElement) &&
		isTextSelectionControl(activeElement)
	) {
		const { selectionStart, selectionEnd } = activeElement;
		if (selectionStart != null && selectionEnd != null && selectionStart < selectionEnd) {
			return true;
		}
	}

	const selection = doc.getSelection?.();
	if (!selection || selection.isCollapsed) return false;

	return hasExpandedSelectionWithinTarget(selection, rootElement);
}

function isEventOnRangeInput(event: TouchEvent): boolean {
	const composedPath = event.composedPath();
	if (composedPath.length > 0) {
		return composedPath.some((pathTarget) => isRangeInput(pathTarget));
	}
	return isRangeInput(event.target);
}

function isScrollableOnAxis(element: HTMLElement, axis: ScrollAxis): boolean {
	const style =
		element.ownerDocument.defaultView?.getComputedStyle(element) ?? getComputedStyle(element);
	if (axis === "vertical") {
		return (
			(style.overflowY === "auto" || style.overflowY === "scroll") &&
			element.scrollHeight > element.clientHeight
		);
	}
	return (
		(style.overflowX === "auto" || style.overflowX === "scroll") &&
		element.scrollWidth > element.clientWidth
	);
}

function findScrollableTouchTarget(
	target: EventTarget | null,
	root: HTMLElement,
	axis: ScrollAxis
): HTMLElement | null {
	let node = isElement(target) ? target : null;
	while (node && node !== root) {
		if (node instanceof HTMLElement && isScrollableOnAxis(node, axis)) {
			return node;
		}
		node = node.parentElement;
	}

	return isScrollableOnAxis(root, axis) ? root : null;
}

function updateTouchScrollPosition(touchState: TouchScrollState, touch: Touch) {
	touchState.lastX = touch.clientX;
	touchState.lastY = touch.clientY;
}

function preserveNativeCrossAxisScrollOnMove(
	touchState: TouchScrollState,
	touch: Touch,
	isVerticalScrollAxis: boolean
) {
	if (touchState.preserveNativeCrossAxisScroll) return true;

	if (touchState.allowSwipe === true || !touchState.hasCrossAxisScrollableContent) {
		return false;
	}

	const drawerAxisGestureDelta = isVerticalScrollAxis
		? touch.clientY - touchState.startY
		: touch.clientX - touchState.startX;
	const crossAxisGestureDelta = isVerticalScrollAxis
		? touch.clientX - touchState.startX
		: touch.clientY - touchState.startY;
	const absDrawerAxisGestureDelta = Math.abs(drawerAxisGestureDelta);
	const absCrossAxisGestureDelta = Math.abs(crossAxisGestureDelta);

	if (absCrossAxisGestureDelta < 6 || absCrossAxisGestureDelta <= absDrawerAxisGestureDelta + 2) {
		return false;
	}

	touchState.preserveNativeCrossAxisScroll = true;
	return true;
}

function hasScrollableContentOnAxis(scrollTarget: HTMLElement, axis: ScrollAxis) {
	return axis === "vertical"
		? scrollTarget.scrollHeight > scrollTarget.clientHeight
		: scrollTarget.scrollWidth > scrollTarget.clientWidth;
}

function getScrollMetrics(scrollTarget: HTMLElement, axis: ScrollAxis) {
	if (axis === "vertical") {
		return {
			offset: scrollTarget.scrollTop,
			max: Math.max(0, scrollTarget.scrollHeight - scrollTarget.clientHeight),
		};
	}

	return {
		offset: scrollTarget.scrollLeft,
		max: Math.max(0, scrollTarget.scrollWidth - scrollTarget.clientWidth),
	};
}

function shouldDismissFromStartEdge(direction: SwipeDirection, axis: ScrollAxis): boolean | null {
	if (axis === "vertical") {
		if (direction === "down") return true;
		if (direction === "up") return false;
		return null;
	}

	if (direction === "right") return true;
	if (direction === "left") return false;
	return null;
}

function isAtSwipeStartEdge(
	scrollTarget: HTMLElement,
	axis: ScrollAxis,
	direction: SwipeDirection
) {
	const { offset, max } = getScrollMetrics(scrollTarget, axis);
	const dismissFromStartEdge = shouldDismissFromStartEdge(direction, axis);
	if (dismissFromStartEdge === null) return false;
	return dismissFromStartEdge ? offset <= 0 : offset >= max;
}

function canSwipeFromScrollEdgeOnMove(
	scrollTarget: HTMLElement,
	axis: ScrollAxis,
	direction: SwipeDirection,
	delta: number
) {
	const { offset, max } = getScrollMetrics(scrollTarget, axis);
	const dismissFromStartEdge = shouldDismissFromStartEdge(direction, axis);
	if (dismissFromStartEdge === null) return false;

	const movingTowardDismiss = dismissFromStartEdge ? delta > 0 : delta < 0;
	if (!movingTowardDismiss) return false;

	return dismissFromStartEdge ? offset <= 0 : offset >= max;
}

function resolveSnapPointValue(
	snapPoint: DrawerSnapPoint,
	viewportHeight: number,
	rootFontSize: number
) {
	if (!Number.isFinite(viewportHeight) || viewportHeight <= 0) return null;

	if (typeof snapPoint === "number") {
		if (!Number.isFinite(snapPoint)) return null;
		if (snapPoint <= 1) return clamp(snapPoint, 0, 1) * viewportHeight;
		return snapPoint;
	}

	const trimmed = snapPoint.trim();

	if (trimmed.endsWith("px")) {
		const value = Number.parseFloat(trimmed);
		return Number.isFinite(value) ? value : null;
	}

	if (trimmed.endsWith("rem")) {
		const value = Number.parseFloat(trimmed);
		return Number.isFinite(value) ? value * rootFontSize : null;
	}

	return null;
}

function findClosestSnapPoint(height: number, points: ResolvedDrawerSnapPoint[]) {
	let closest: ResolvedDrawerSnapPoint | null = null;
	let closestDistance = Infinity;

	for (const point of points) {
		const distance = Math.abs(point.height - height);
		if (distance < closestDistance) {
			closestDistance = distance;
			closest = point;
		}
	}

	return closest;
}

function oppositeSwipeDirection(direction: DrawerSwipeDirection): DrawerSwipeDirection {
	switch (direction) {
		case "up":
			return "down";
		case "down":
			return "up";
		case "left":
			return "right";
		case "right":
			return "left";
	}
}

function drawerPresenceSlideOffset(
	direction: DrawerSwipeDirection,
	status: TransitionState
): { x: string; y: string } {
	if (status !== "starting" && status !== "ending") return { x: "0px", y: "0px" };
	switch (direction) {
		case "right":
			return { x: "100%", y: "0px" };
		case "left":
			return { x: "-100%", y: "0px" };
		case "down":
			return { x: "0px", y: "100%" };
		case "up":
			return { x: "0px", y: "-100%" };
	}
}

function drawerBackdropPresenceInterpolate(status: TransitionState): string {
	return status === "starting" || status === "ending" ? "0" : "1";
}

const drawerAttrs = createBitsAttrs({
	component: "drawer",
	parts: [
		"trigger",
		"backdrop",
		"viewport",
		"popup",
		"content",
		"title",
		"description",
		"close",
		"swipe-area",
		"indent",
		"indent-background",
	],
});

export const DrawerProviderContext = new Context<DrawerProviderState | null>("Drawer.Provider");

export class DrawerProviderState {
	static create() {
		return DrawerProviderContext.set(new DrawerProviderState());
	}

	openById = $state.raw<Record<string, boolean>>({});
	swipeProgress = $state(0);
	frontmostHeight = $state(0);

	setDrawerOpen(id: string, open: boolean) {
		if (this.openById[id] === open) return;
		this.openById = { ...this.openById, [id]: open };
	}

	removeDrawer(id: string) {
		if (!(id in this.openById)) return;
		const next = { ...this.openById };
		delete next[id];
		this.openById = next;
	}

	setVisualState(next: { swipeProgress?: number; frontmostHeight?: number }) {
		if (next.swipeProgress !== undefined) {
			this.swipeProgress = Number.isFinite(next.swipeProgress) ? next.swipeProgress : 0;
		}

		if (next.frontmostHeight !== undefined) {
			this.frontmostHeight = Number.isFinite(next.frontmostHeight) ? next.frontmostHeight : 0;
		}
	}

	get active() {
		return Object.values(this.openById).some(Boolean);
	}
}

type DrawerTriggerRecord = {
	id: string;
	node: HTMLElement | null;
	payload: unknown;
	disabled: boolean;
};

class DrawerTriggerRegistryState {
	triggers = new SvelteMap<string, DrawerTriggerRecord>();
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

	register = (record: DrawerTriggerRecord) => {
		this.triggers.set(record.id, record);
		this.#coerceActiveTrigger();
	};

	update = (record: DrawerTriggerRecord) => {
		this.triggers.set(record.id, record);
		this.#coerceActiveTrigger();
	};

	unregister = (id: string) => {
		if (!this.triggers.has(id)) return;
		this.triggers.delete(id);
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

class DrawerTetherState {
	readonly registry = new DrawerTriggerRegistryState();
	root = $state<DrawerRootState | null>(null);
}

// oxlint-disable-next-line no-unused-vars
export class DrawerTether<Payload = unknown> {
	readonly #state = new DrawerTetherState();

	get state() {
		return this.#state;
	}

	open(triggerId: string) {
		if (!this.#state.registry.has(triggerId)) return;
		this.#state.registry.setActiveTrigger(triggerId);
		this.#state.root?.setActiveTrigger(triggerId);
		this.#state.root?.handleOpen();
	}

	openWithPayload(payload: Payload) {
		this.#state.root?.handleOpenWithPayload(payload);
	}

	close() {
		this.#state.root?.handleClose();
	}

	get isOpen() {
		return this.#state.root?.opts.open.current ?? false;
	}

	get payload() {
		return this.#state.root?.tetherPayload ?? null;
	}

	get triggerId() {
		return this.#state.root?.activeTriggerId ?? null;
	}
}

export function createTether<Payload = unknown>() {
	return new DrawerTether<Payload>();
}

const DrawerRootContext = new Context<DrawerRootState>("Drawer.Root");

interface DrawerRootStateOpts
	extends WritableBoxedValues<{
			open: boolean;
			snapPoint: DrawerSnapPoint | null | undefined;
			triggerId: string | null;
		}>,
		ReadableBoxedValues<{
			id: string;
			swipeDirection: DrawerSwipeDirection;
			snapPoints: DrawerSnapPoint[] | undefined;
			snapToSequentialPoints: boolean;
			tether: DrawerTether<any> | undefined;
			onOpenChangeComplete: OnChangeFn<boolean>;
			onSnapPointChange: OnChangeFn<DrawerSnapPoint | null | undefined>;
		}> {}

export class DrawerRootState {
	static create(opts: DrawerRootStateOpts) {
		const parent = DrawerRootContext.getOr(null);
		return DrawerRootContext.set(new DrawerRootState(opts, parent));
	}

	readonly opts: DrawerRootStateOpts;
	readonly parent: DrawerRootState | null;
	readonly provider = DrawerProviderContext.getOr(null);
	readonly depth: number;
	readonly tetherState: DrawerTetherState | null;
	readonly registry: DrawerTriggerRegistryState;

	get triggerNode() {
		return this.registry.activeTriggerNode;
	}

	get activeTriggerId() {
		return this.registry.activeTriggerId;
	}

	get activePayload() {
		return this.registry.activePayload;
	}

	backdropNode = $state<HTMLElement | null>(null);
	viewportNode = $state<HTMLElement | null>(null);
	viewportSwipeDelegate: DrawerViewportSwipeDelegate | null = null;
	touchSwipeSource = $state<"viewport" | "backdrop" | null>(null);
	popupNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	titleId = $state<string | undefined>(undefined);
	descriptionId = $state<string | undefined>(undefined);
	popupId = $state<string | undefined>(undefined);
	tetherPayload = $state<unknown | null>(null);
	nestedOpenCount = $state(0);
	popupHeight = $state(0);
	frontmostHeight = $state(0);
	viewportHeight = $state(0);
	rootFontSize = $state(16);
	nestedSwiping = $state(false);
	nestedSwipeProgress = $state(0);
	nestedDrawerPresent = $state(false);
	swipeDismissed = $state(false);
	swipeReleaseStrength = $state<number | null>(null);
	lastTouchTriggerUpAt = $state(0);
	lastTouchTriggerUpId = $state<string | null>(null);
	lastCommittedSnapOffset = $state<number | null>(null);
	backdropSwipeProgress = $state(0);

	popupPresence: PresenceManager;
	backdropPresence: PresenceManager;

	constructor(opts: DrawerRootStateOpts, parent: DrawerRootState | null) {
		this.opts = opts;
		this.parent = parent;
		this.depth = parent ? parent.depth + 1 : 0;
		this.tetherState = opts.tether.current?.state ?? null;
		this.registry = this.tetherState?.registry ?? new DrawerTriggerRegistryState();

		this.popupPresence = new PresenceManager({
			ref: boxWith(() => this.popupNode),
			open: this.opts.open,
			enabled: true,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
		});

		this.backdropPresence = new PresenceManager({
			ref: boxWith(() => this.backdropNode),
			open: this.opts.open,
			enabled: true,
		});

		watch(
			[
				() => this.activeResolvedSnapPoint?.offset ?? null,
				() => this.opts.open.current,
				() => this.popupPresence.shouldRender,
			],
			([offset, open, shouldRender]) => {
				if (typeof offset === "number" && Number.isFinite(offset)) {
					this.lastCommittedSnapOffset = offset;
				}
				if (!open && !shouldRender) {
					this.lastCommittedSnapOffset = null;
				}
			}
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

		watch(
			() => this.opts.open.current,
			(isOpen) => {
				if (isOpen) {
					this.ensureActiveTrigger();
					this.parent?.incrementNested();
				} else {
					this.parent?.decrementNested();
					const snaps = this.opts.snapPoints.current;
					if (snaps?.length) {
						// use raw snap list so we reset even when popupHeight is already 0 (no resolved points)
						const def = this.opts.snapPoint.current;
						const next =
							def !== undefined && def !== null
								? (snaps.find((s) => Object.is(s, def)) ?? snaps[0])
								: snaps[0];
						if (next !== undefined && this.opts.snapPoint.current !== next) {
							this.opts.snapPoint.current = next;
						}
					}
				}
				this.provider?.setDrawerOpen(this.opts.id.current, isOpen);
				// nested roots share Drawer.Provider
				// zeroing here on every close reset the whole stack
				if (!isOpen && this.parent == null) {
					this.provider?.setVisualState({ swipeProgress: 0, frontmostHeight: 0 });
				}
			},
			{ lazy: true }
		);

		const tether = this.opts.tether.current;
		if (tether) {
			tether.state.root = this;
			onMountEffect(() => {
				return () => {
					if (tether.state.root === this) {
						tether.state.root = null;
					}
				};
			});
		}

		onDestroyEffect(() => {
			if (this.opts.open.current) {
				this.parent?.decrementNested();
			}
			this.provider?.removeDrawer(this.opts.id.current);
		});
	}

	handleOpen = () => {
		this.ensureActiveTrigger();
		this.opts.open.current = true;
	};

	handleOpenWithPayload = (payload: unknown) => {
		this.registry.setActiveTrigger(null);
		this.tetherPayload = payload;
		this.opts.open.current = true;
	};

	handleClose = () => {
		if (!this.opts.open.current) return;
		this.opts.open.current = false;
	};

	setActiveTrigger = (triggerId: string | null) => {
		this.registry.setActiveTrigger(triggerId);
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
		}
	};

	registerTrigger = (trigger: DrawerTriggerRecord) => {
		this.registry.register(trigger);

		if (
			trigger.disabled &&
			this.registry.activeTriggerId === trigger.id &&
			this.opts.open.current
		) {
			this.handleClose();
		}
	};

	updateTrigger = (trigger: DrawerTriggerRecord) => {
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

	incrementNested() {
		this.nestedOpenCount++;
		this.parent?.incrementNested();
	}

	decrementNested() {
		if (this.nestedOpenCount === 0) return;
		this.nestedOpenCount--;
		if (this.nestedOpenCount === 0 && this.popupHeight > 0) {
			this.frontmostHeight = this.popupHeight;
		}
		this.parent?.decrementNested();
	}

	getBitsAttr: typeof drawerAttrs.getAttr = (part) => {
		return drawerAttrs.getAttr(part);
	};

	get hasNestedDrawer() {
		return this.nestedOpenCount > 0 || this.nestedDrawerPresent;
	}

	setPopupHeight(height: number) {
		const nextHeight = Number.isFinite(height) ? height : 0;
		if (this.popupHeight === nextHeight) return;
		this.popupHeight = nextHeight;

		if (!this.hasNestedDrawer && nextHeight > 0) {
			this.frontmostHeight = nextHeight;
		}

		if (this.opts.open.current) {
			this.provider?.setVisualState({
				frontmostHeight: this.frontmostHeight,
			});
		}
	}

	setNestedFrontmostHeight(height: number) {
		if (height > 0) {
			this.frontmostHeight = height;
		} else if (this.popupHeight > 0) {
			this.frontmostHeight = this.popupHeight;
		}

		if (this.opts.open.current) {
			this.provider?.setVisualState({
				frontmostHeight: this.frontmostHeight,
			});
		}
	}

	setNestedDrawerPresence(present: boolean) {
		this.nestedDrawerPresent = present;
	}

	setNestedSwiping(swiping: boolean) {
		this.nestedSwiping = swiping;
		this.parent?.setNestedSwiping(swiping);
	}

	setNestedSwipeProgress(progress: number) {
		const resolved = Number.isFinite(progress) ? progress : 0;
		this.nestedSwipeProgress = resolved;
		this.parent?.setNestedSwipeProgress(resolved);
	}

	setViewportMeasurements(viewportHeight: number, rootFontSize: number) {
		this.viewportHeight = Number.isFinite(viewportHeight) ? viewportHeight : 0;
		this.rootFontSize = Number.isFinite(rootFontSize) ? rootFontSize : 16;
	}

	get resolvedSnapPoints() {
		const snapPoints = this.opts.snapPoints.current;
		if (!snapPoints?.length || this.viewportHeight <= 0 || this.popupHeight <= 0) {
			return [];
		}

		const maxHeight = Math.min(this.popupHeight, this.viewportHeight);
		if (!Number.isFinite(maxHeight) || maxHeight <= 0) return [];

		const resolved = snapPoints
			.map((value): ResolvedDrawerSnapPoint | null => {
				const resolvedHeight = resolveSnapPointValue(
					value,
					this.viewportHeight,
					this.rootFontSize
				);
				if (resolvedHeight === null || !Number.isFinite(resolvedHeight)) {
					return null;
				}

				const clampedHeight = clamp(resolvedHeight, 0, maxHeight);
				return {
					value,
					height: clampedHeight,
					offset: Math.max(0, this.popupHeight - clampedHeight),
				};
			})
			.filter((point): point is ResolvedDrawerSnapPoint => Boolean(point));

		if (resolved.length <= 1) return resolved;

		const deduped: ResolvedDrawerSnapPoint[] = [];
		const seenHeights: number[] = [];

		for (let index = resolved.length - 1; index >= 0; index -= 1) {
			const point = resolved[index];
			if (!point) continue;
			const isDuplicate = seenHeights.some((height) => Math.abs(height - point.height) <= 1);
			if (isDuplicate) continue;
			seenHeights.push(point.height);
			deduped.push(point);
		}

		deduped.reverse();
		return deduped;
	}

	get resolvedDefaultSnapPoint(): ResolvedDrawerSnapPoint | undefined {
		const resolved = this.resolvedSnapPoints;
		if (!resolved.length) return undefined;
		const def = this.opts.snapPoint.current;
		if (def !== undefined && def !== null) {
			const match = resolved.find((point) => Object.is(point.value, def));
			if (match) return match;
		}
		return resolved[0];
	}

	get activeResolvedSnapPoint() {
		const activeSnapPoint = this.opts.snapPoint.current;
		const resolvedSnapPoints = this.resolvedSnapPoints;
		if (!resolvedSnapPoints.length) return;

		if (activeSnapPoint === null) {
			if (!this.opts.open.current || this.swipeDismissed) return;
			return this.resolvedDefaultSnapPoint;
		}
		if (activeSnapPoint === undefined) return this.resolvedDefaultSnapPoint;

		const exactMatch = resolvedSnapPoints.find((point) =>
			Object.is(point.value, activeSnapPoint)
		);
		if (exactMatch) return exactMatch;

		const maxHeight = Math.min(this.popupHeight, this.viewportHeight);
		const resolvedHeight = resolveSnapPointValue(
			activeSnapPoint,
			this.viewportHeight,
			this.rootFontSize
		);
		if (resolvedHeight === null || !Number.isFinite(resolvedHeight)) return;

		const clampedHeight = clamp(resolvedHeight, 0, maxHeight);
		return findClosestSnapPoint(clampedHeight, resolvedSnapPoints) ?? undefined;
	}

	get activeSnapPointOffset() {
		const resolved = this.activeResolvedSnapPoint?.offset;
		if (typeof resolved === "number" && Number.isFinite(resolved)) return resolved;
		if (
			(this.opts.open.current || this.popupPresence.shouldRender) &&
			typeof this.lastCommittedSnapOffset === "number" &&
			Number.isFinite(this.lastCommittedSnapOffset)
		) {
			return this.lastCommittedSnapOffset;
		}
		return null;
	}

	get snapPointBackdropRange(): { minOffset: number; range: number } | null {
		const snapPoints = this.opts.snapPoints.current;
		if (!snapPoints || snapPoints.length < 2) return null;
		const dir = this.opts.swipeDirection.current;
		if (dir !== "down" && dir !== "up") return null;
		const resolved = this.resolvedSnapPoints;
		if (resolved.length < 2) return null;
		const offsets = resolved
			.map((point) => point.offset)
			.filter((offset) => Number.isFinite(offset))
			.sort((a, b) => a - b);
		if (offsets.length < 2) return null;
		const minOffset = offsets[0]!;
		const nextOffset = offsets[1]!;
		const maxOffset = offsets[offsets.length - 1]!;
		let range = nextOffset - minOffset;
		if (!Number.isFinite(range) || range <= 0) {
			const fallbackRange = maxOffset - minOffset;
			if (!Number.isFinite(fallbackRange) || fallbackRange <= 0) return null;
			range = fallbackRange;
		}
		return { minOffset, range };
	}

	get snapPointProgressForBackdrop(): number | null {
		const r = this.snapPointBackdropRange;
		if (!r) return null;
		const off = this.activeSnapPointOffset;
		if (off === null || typeof off !== "number" || !Number.isFinite(off)) return null;
		return clamp((off - r.minOffset) / r.range, 0, 1);
	}

	readonly sharedProps = $derived.by(
		() =>
			({
				"data-state": getDataOpenClosed(this.opts.open.current),
			}) as const
	);
}

interface DrawerTriggerStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			tether: DrawerTether<any> | undefined;
			payload: unknown;
		}> {}

export class DrawerTriggerState {
	static create(opts: DrawerTriggerStateOpts) {
		if (opts.tether.current) {
			return new DrawerTriggerState(opts, null, opts.tether.current.state);
		}
		return new DrawerTriggerState(opts, DrawerRootContext.getOr(null), null);
	}

	readonly opts: DrawerTriggerStateOpts;
	readonly root: DrawerRootState | null;
	readonly tetherState: DrawerTetherState | null;
	readonly attachment: RefAttachment;
	#mounted = false;
	#lastRegisteredId: string | null = null;

	constructor(
		opts: DrawerTriggerStateOpts,
		root: DrawerRootState | null,
		tetherState: DrawerTetherState | null
	) {
		this.opts = opts;
		this.root = root;
		this.tetherState = tetherState;
		this.attachment = attachRef(this.opts.ref, (v) => this.#register(v));
		this.onclick = this.onclick.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onkeydown = this.onkeydown.bind(this);

		onMountEffect(() => {
			this.#mounted = true;
			return () => {
				this.#mounted = false;
			};
		});

		watch(
			[
				() => this.opts.id.current,
				() => this.opts.payload.current,
				() => this.opts.disabled.current,
			],
			() => {
				this.#mounted = true;
				this.#register(this.opts.ref.current);

				return () => {
					const root = this.#getRoot();
					const id = this.#lastRegisteredId;
					if (id) {
						if (this.tetherState) {
							this.tetherState.registry.unregister(id);
						} else {
							root?.unregisterTrigger(id);
						}
					}
					this.#lastRegisteredId = null;
				};
			}
		);
	}

	#getRoot = () => {
		return this.tetherState?.root ?? this.root;
	};

	#register = (node: HTMLElement | null) => {
		if (!this.#mounted) return;
		const id = this.opts.id.current;
		const payload = this.opts.payload.current;
		const disabled = this.opts.disabled.current;

		if (this.#lastRegisteredId && this.#lastRegisteredId !== id) {
			const root = this.#getRoot();
			if (this.tetherState) {
				this.tetherState.registry.unregister(this.#lastRegisteredId);
			} else {
				root?.unregisterTrigger(this.#lastRegisteredId);
			}
		}

		const triggerRecord: DrawerTriggerRecord = {
			id,
			node,
			payload,
			disabled,
		};

		const root = this.#getRoot();
		if (this.tetherState) {
			if (this.tetherState.registry.has(id)) {
				this.tetherState.registry.update(triggerRecord);
			} else {
				this.tetherState.registry.register(triggerRecord);
			}

			if (
				disabled &&
				this.tetherState.registry.activeTriggerId === id &&
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

			if (
				root &&
				disabled &&
				root.registry.activeTriggerId === id &&
				root.opts.open.current
			) {
				root.handleClose();
			}
		}

		this.#lastRegisteredId = id;
	};

	#open() {
		const root = this.#getRoot();
		if (!root) return;
		if (this.opts.tether.current) {
			this.opts.tether.current.open(this.opts.id.current);
			return;
		}
		root.setActiveTrigger(this.opts.id.current);
		root.handleOpen();
	}

	#getOpenState() {
		return this.root?.opts.open.current ?? this.opts.tether.current?.isOpen ?? false;
	}

	#getAriaControls() {
		if (!this.#getOpenState()) return undefined;
		return this.#getRoot()?.popupId;
	}

	onclick(e: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		if (e.button > 0) return;
		this.#open();
	}

	onpointerup(event: PointerEvent) {
		const root = this.#getRoot();
		if (!root) return;
		if (event.pointerType !== "touch") return;
		root.lastTouchTriggerUpAt = Date.now();
		root.lastTouchTriggerUpId = this.opts.id.current;
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.opts.disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			e.preventDefault();
			this.#open();
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-haspopup": "dialog",
				"aria-expanded": boolToStr(this.#getOpenState()),
				"aria-controls": this.#getAriaControls(),
				[this.#getRoot()?.getBitsAttr("trigger") ?? drawerAttrs.trigger]: "",
				disabled: this.opts.disabled.current ? true : undefined,
				onpointerup: this.onpointerup,
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.#getRoot()?.sharedProps,
				...this.attachment,
			}) as const
	);
}

interface DrawerCloseStateOpts extends WithRefOpts, ReadableBoxedValues<{ disabled: boolean }> {}

export class DrawerCloseState {
	static create(opts: DrawerCloseStateOpts) {
		return new DrawerCloseState(opts, DrawerRootContext.get());
	}

	readonly opts: DrawerCloseStateOpts;
	readonly root: DrawerRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DrawerCloseStateOpts, root: DrawerRootState) {
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
				[this.root.getBitsAttr("close")]: "",
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				disabled: this.opts.disabled.current ? true : undefined,
				tabindex: 0,
				...this.root.sharedProps,
				...this.attachment,
			}) as const
	);
}

interface DrawerTitleStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{ level: 1 | 2 | 3 | 4 | 5 | 6 }> {}

export class DrawerTitleState {
	static create(opts: DrawerTitleStateOpts) {
		return new DrawerTitleState(opts, DrawerRootContext.get());
	}

	readonly opts: DrawerTitleStateOpts;
	readonly root: DrawerRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DrawerTitleStateOpts, root: DrawerRootState) {
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

interface DrawerDescriptionStateOpts extends WithRefOpts {}

export class DrawerDescriptionState {
	static create(opts: DrawerDescriptionStateOpts) {
		return new DrawerDescriptionState(opts, DrawerRootContext.get());
	}

	readonly opts: DrawerDescriptionStateOpts;
	readonly root: DrawerRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DrawerDescriptionStateOpts, root: DrawerRootState) {
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

interface DrawerBackdropStateOpts extends WithRefOpts {}

export class DrawerBackdropState {
	static create(opts: DrawerBackdropStateOpts) {
		return new DrawerBackdropState(opts, DrawerRootContext.get());
	}

	readonly opts: DrawerBackdropStateOpts;
	readonly root: DrawerRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DrawerBackdropStateOpts, root: DrawerRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.backdropNode = v;
		});
		this.onclick = this.onclick.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onpointercancel = this.onpointercancel.bind(this);
		this.ontouchstart = this.ontouchstart.bind(this);
		this.ontouchmove = this.ontouchmove.bind(this);
		this.ontouchend = this.ontouchend.bind(this);
		this.ontouchcancel = this.ontouchcancel.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (e.button > 0) return;
		this.root.handleClose();
	}

	onpointerdown(event: PointerEvent) {
		if (event.pointerType === "touch") return;
		this.root.viewportSwipeDelegate?.onpointerdown(event);
	}

	onpointermove(event: PointerEvent) {
		if (event.pointerType === "touch") return;
		this.root.viewportSwipeDelegate?.onpointermove(event);
	}

	onpointerup(event: PointerEvent) {
		if (event.pointerType === "touch") return;
		this.root.viewportSwipeDelegate?.onpointerup(event);
	}

	onpointercancel(event: PointerEvent) {
		if (event.pointerType === "touch") return;
		this.root.viewportSwipeDelegate?.onpointercancel(event);
	}

	ontouchstart(event: TouchEvent) {
		this.root.touchSwipeSource = "backdrop";
		this.root.viewportSwipeDelegate?.ontouchstart(event);
	}

	ontouchmove(event: TouchEvent) {
		this.root.viewportSwipeDelegate?.ontouchmove(event);
	}

	ontouchend(event: TouchEvent) {
		this.root.viewportSwipeDelegate?.ontouchend(event);
	}

	ontouchcancel(event: TouchEvent) {
		this.root.viewportSwipeDelegate?.ontouchcancel(event);
	}

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "presentation",
				[this.root.getBitsAttr("backdrop")]: "",
				style: {
					pointerEvents: this.root.opts.open.current ? "auto" : "none",
					"--nested-drawers": this.root.nestedOpenCount,
					"--drawer-swipe-progress": this.root.backdropSwipeProgress,
					"--drawer-swipe-strength":
						this.root.swipeReleaseStrength != null
							? `${this.root.swipeReleaseStrength}`
							: 1,
					"--drawer-backdrop-interpolate": drawerBackdropPresenceInterpolate(
						this.root.backdropPresence.transitionStatus
					),
				},
				"data-swipe-dismiss": boolToEmptyStrOrUndef(this.root.swipeDismissed),
				"data-nested-drawer-open": boolToEmptyStrOrUndef(this.root.nestedOpenCount > 0),
				"data-nested-drawer-stacked": boolToEmptyStrOrUndef(this.root.hasNestedDrawer),
				"data-nested-drawer-swiping": boolToEmptyStrOrUndef(this.root.nestedSwiping),
				"data-nested": boolToEmptyStrOrUndef(this.root.parent !== null),
				...getDataTransitionAttrs(this.root.backdropPresence.transitionStatus),
				onclick: this.onclick,
				onpointerdown: this.onpointerdown,
				onpointermove: this.onpointermove,
				onpointerup: this.onpointerup,
				onpointercancel: this.onpointercancel,
				ontouchstart: this.ontouchstart,
				ontouchmove: this.ontouchmove,
				ontouchend: this.ontouchend,
				ontouchcancel: this.ontouchcancel,
				...this.root.sharedProps,
				...this.attachment,
			}) as const
	);

	get shouldRender() {
		return this.root.backdropPresence.shouldRender;
	}
}

interface DrawerViewportStateOpts extends WithRefOpts {}

export class DrawerViewportState {
	static create(opts: DrawerViewportStateOpts) {
		return new DrawerViewportState(opts, DrawerRootContext.get());
	}

	readonly opts: DrawerViewportStateOpts;
	readonly root: DrawerRootState;
	readonly attachment: RefAttachment;
	readonly swipe: SwipeDismiss;
	popupTransition = "";
	touchScrollState: TouchScrollState | null = null;
	ignoreTouchSwipe = false;
	keyboardViewportInset = $state(0);
	lastKeyboardAutoScrollSignature = "";

	constructor(opts: DrawerViewportStateOpts, root: DrawerRootState) {
		this.opts = opts;
		this.root = root;
		this.root.viewportSwipeDelegate = this;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.viewportNode = v;
		});
		this.swipe = new SwipeDismiss({
			enabled: () => this.root.opts.open.current && this.root.nestedOpenCount === 0,
			directions: () => {
				const hasSnapPoints =
					(this.root.opts.snapPoints.current?.length ?? 0) > 0 &&
					(this.root.opts.swipeDirection.current === "down" ||
						this.root.opts.swipeDirection.current === "up");

				if (hasSnapPoints) {
					return [
						this.root.opts.swipeDirection.current,
						oppositeSwipeDirection(this.root.opts.swipeDirection.current),
					];
				}

				return [this.root.opts.swipeDirection.current];
			},
			element: () => this.root.popupNode,
			ignoreSelectorWhenTouch: false,
			ignoreScrollableAncestors: true,
			trackDrag: false,
			canStart: (position, details) => {
				const popupElement = this.root.popupNode;
				if (!popupElement) return false;

				const doc = popupElement.ownerDocument;
				const elementAtPoint = doc.elementFromPoint(position.x, position.y);
				const nativeEvent = details.nativeEvent;
				const touchLike =
					nativeEvent instanceof TouchEvent ||
					(nativeEvent instanceof PointerEvent && nativeEvent.pointerType === "touch");
				let reason = "allow";

				if (!elementAtPoint || !popupElement.contains(elementAtPoint)) {
					reason = "outside-popup";
				} else if (touchLike && shouldIgnoreSwipeForTextSelection(doc, popupElement)) {
					reason = "text-selection";
				} else if (
					nativeEvent.type === "touchstart" &&
					elementAtPoint.closest(BITS_UI_SWIPE_IGNORE_SELECTOR)
				) {
					reason = "swipe-ignore";
				}

				return reason === "allow";
			},
			onSwipeStart: (event) => {
				if (event instanceof TouchEvent) return;
				const popupElement = this.root.popupNode;
				if (!popupElement) return;
				const selection = popupElement.ownerDocument.getSelection?.();
				if (!selection || selection.isCollapsed) return;

				const anchorElement =
					selection.anchorNode instanceof HTMLElement
						? selection.anchorNode
						: selection.anchorNode?.parentElement;
				const focusElement =
					selection.focusNode instanceof HTMLElement
						? selection.focusNode
						: selection.focusNode?.parentElement;

				if (
					!popupElement.contains(anchorElement ?? null) &&
					!popupElement.contains(focusElement ?? null)
				) {
					return;
				}

				selection.removeAllRanges();
			},
			onSwipingChange: (swiping) => {
				if (swiping) {
					this.syncSwipeBaselineForSnapPoints();
				}
				this.setPopupUserSelectSuppressedForSwipe(swiping);
				this.setBackdropSwipingAttribute(swiping);
				this.root.parent?.setNestedSwiping(swiping);
				if (!swiping) {
					this.root.parent?.setNestedSwipeProgress(0);
				}
			},
			onProgress: (progress, details) => {
				const currentDirection = details?.direction ?? this.swipe.swipeDirection;
				const isDismissSwipe =
					currentDirection === undefined ||
					currentDirection === this.root.opts.swipeDirection.current;
				const hasSnapPoints = Boolean(this.root.opts.snapPoints.current?.length);
				const isVerticalSwipe =
					this.root.opts.swipeDirection.current === "down" ||
					this.root.opts.swipeDirection.current === "up";
				const shouldTrackProgress =
					(hasSnapPoints && isVerticalSwipe) ||
					!hasSnapPoints ||
					this.root.opts.swipeDirection.current === "left" ||
					this.root.opts.swipeDirection.current === "right" ||
					isDismissSwipe;

				let resolvedProgress = progress;
				const snapRange = this.root.snapPointBackdropRange;
				const popupHeight = this.root.popupHeight;
				if (snapRange && popupHeight > 0) {
					if (details && Number.isFinite(details.deltaY)) {
						const baseOffset = this.root.activeSnapPointOffset ?? snapRange.minOffset;
						const nextOffset = clamp(baseOffset + details.deltaY, 0, popupHeight);
						resolvedProgress = clamp(
							(nextOffset - snapRange.minOffset) / snapRange.range,
							0,
							1
						);
					} else {
						const snapPointProgress = this.root.snapPointProgressForBackdrop;
						if (snapPointProgress !== null) {
							resolvedProgress = snapPointProgress;
						} else if (currentDirection === "down" || currentDirection === "up") {
							const displacement = progress * popupHeight;
							const baseOffset =
								this.root.activeSnapPointOffset ?? snapRange.minOffset;
							const nextOffset =
								currentDirection === "down"
									? baseOffset + displacement
									: baseOffset - displacement;
							resolvedProgress = clamp(
								(nextOffset - snapRange.minOffset) / snapRange.range,
								0,
								1
							);
						}
					}
				}

				this.applySwipeProgress(resolvedProgress, shouldTrackProgress, true);
			},
			onRelease: ({
				direction,
				deltaX,
				deltaY,
				velocityX,
				velocityY,
				releaseVelocityX,
				releaseVelocityY,
			}) => {
				return this.onRelease({
					direction,
					deltaX,
					deltaY,
					velocityX,
					velocityY,
					releaseVelocityX,
					releaseVelocityY,
				});
			},
			onDismiss: () => {
				this.prepareSwipeDismissTransition();
				this.root.handleClose();
			},
		});

		watch(
			() => [
				this.swipe.swiping,
				this.root.opts.open.current,
				this.root.parent !== null,
				this.root.snapPointProgressForBackdrop,
				this.root.snapPointBackdropRange?.minOffset ?? null,
				this.root.snapPointBackdropRange?.range ?? null,
			],
			() => {
				const swiping = this.swipe.swiping;
				if (swiping) return;
				const open = this.root.opts.open.current;
				const nested = this.root.parent !== null;
				const snapProgress = this.root.snapPointProgressForBackdrop;
				const range = this.root.snapPointBackdropRange;
				if (!range) {
					// without 2+ snap points this watch used to bail entirely; swipe progress could
					// stay at 1 after touch so (1 - progress) scrim stays invisible on mobile
					if (open && !nested) {
						this.applySwipeProgress(0, true, false);
					}
					return;
				}
				const resolvedProgress = !open || nested ? 0 : (snapProgress ?? 0);
				this.applySwipeProgress(resolvedProgress, true, false);
			}
		);

		watch(
			() => this.root.opts.open.current,
			(isOpen) => {
				if (!isOpen) return;
				this.swipe.reset();
				this.clearSwipeStyles();
			}
		);

		watch(
			() => this.root.viewportNode ?? this.root.popupNode,
			(rootElement) => {
				if (!rootElement) return;
				const doc = rootElement.ownerDocument;
				const handleNativeTouchMove = (event: TouchEvent) => {
					const touchState = this.touchScrollState;
					const touch = event.touches[0];
					if (this.ignoreTouchSwipe || !touch || !touchState) return;

					const scrollAxis = this.scrollAxis;
					const isVerticalScrollAxis = scrollAxis === "vertical";
					const drawerAxisDelta = isVerticalScrollAxis
						? touch.clientY - touchState.lastY
						: touch.clientX - touchState.lastX;

					if (isEventOnRangeInput(event)) {
						touchState.allowSwipe = false;
						updateTouchScrollPosition(touchState, touch);
						return;
					}

					if (event.touches.length === 2) {
						updateTouchScrollPosition(touchState, touch);
						return;
					}

					if (
						shouldIgnoreSwipeForTextSelection(doc, rootElement) ||
						!this.root.opts.open.current ||
						this.root.nestedOpenCount > 0
					) {
						updateTouchScrollPosition(touchState, touch);
						return;
					}

					if (
						preserveNativeCrossAxisScrollOnMove(touchState, touch, isVerticalScrollAxis)
					) {
						updateTouchScrollPosition(touchState, touch);
						return;
					}

					this.swipe.refreshPendingTouchIntent(
						{ x: touch.clientX, y: touch.clientY },
						event
					);
					const shouldLockDocumentTouchMove =
						this.swipe.swiping || this.swipe.shouldLockTouchMove;

					// stop touch scrolling from leaking to the page when the gesture started on
					// a non-scrollable surface of the drawer.
					const startedOnNonScrollableDrawerSurface =
						touchState.scrollTarget == null &&
						!touchState.hasCrossAxisScrollableContent;
					const shouldPreventBodyScrollThrough =
						shouldLockDocumentTouchMove || startedOnNonScrollableDrawerSurface;

					const scrollTarget = touchState.scrollTarget;
					if (
						!scrollTarget ||
						scrollTarget === doc.documentElement ||
						scrollTarget === doc.body
					) {
						if (event.cancelable && shouldPreventBodyScrollThrough) {
							event.preventDefault();
						}
						updateTouchScrollPosition(touchState, touch);
						return;
					}

					if (!hasScrollableContentOnAxis(scrollTarget, scrollAxis)) {
						if (event.cancelable && shouldPreventBodyScrollThrough) {
							event.preventDefault();
						}
						updateTouchScrollPosition(touchState, touch);
						return;
					}

					if (drawerAxisDelta !== 0) {
						const canSwipeFromScrollEdge = canSwipeFromScrollEdgeOnMove(
							scrollTarget,
							scrollAxis,
							this.root.opts.swipeDirection.current,
							drawerAxisDelta
						);

						if (!touchState.allowSwipe) {
							if (!event.cancelable) {
								touchState.allowSwipe = false;
							} else if (canSwipeFromScrollEdge && shouldPreventBodyScrollThrough) {
								touchState.allowSwipe = true;
								event.preventDefault();
							} else {
								touchState.allowSwipe = false;
							}
						} else if (event.cancelable && shouldPreventBodyScrollThrough) {
							event.preventDefault();
						}
					}

					updateTouchScrollPosition(touchState, touch);
				};

				doc.addEventListener("touchmove", handleNativeTouchMove, {
					passive: false,
					capture: true,
				});

				return () => {
					doc.removeEventListener("touchmove", handleNativeTouchMove, true);
				};
			}
		);

		watch(
			() => this.opts.ref.current,
			(viewport) => {
				if (!viewport) return;

				const syncMeasurements = () => {
					const rootFontSize = Number.parseFloat(
						getComputedStyle(document.documentElement).fontSize || "16"
					);
					this.root.setViewportMeasurements(viewport.offsetHeight, rootFontSize);
					const visualViewportBottom =
						viewport.ownerDocument.defaultView?.visualViewport != null
							? viewport.ownerDocument.defaultView.visualViewport.offsetTop +
								viewport.ownerDocument.defaultView.visualViewport.height
							: viewport.getBoundingClientRect().bottom;
					if (isIOS && this.root.opts.open.current && this.keyboardViewportInset > 0) {
						this.syncFocusedInputVisibilityWithinPopup(visualViewportBottom);
					}
				};

				syncMeasurements();

				const ro = new ResizeObserver(syncMeasurements);

				ro.observe(viewport);

				return () => {
					ro.disconnect();
				};
			}
		);

		watch(
			[() => this.root.opts.open.current, () => this.opts.ref.current],
			([open, viewport]) => {
				if (!isIOS || !open || !viewport) {
					this.keyboardViewportInset = 0;
					return;
				}

				const doc = viewport.ownerDocument;
				const win = doc.defaultView;
				const visualViewport = win?.visualViewport;
				if (!win || !visualViewport) {
					this.keyboardViewportInset = 0;
					return;
				}

				let baselineLayoutViewportHeight = getLayoutViewportHeight(win);
				let rafId = 0;
				let focusVisibilityRafId = 0;
				let maxObservedKeyboardInset = 0;
				const updateKeyboardInset = (source: string) => {
					const layoutViewportHeight = getLayoutViewportHeight(win);
					const visualViewportBottom = visualViewport.offsetTop + visualViewport.height;
					const currentLayoutInset = Math.max(
						0,
						layoutViewportHeight - visualViewportBottom
					);
					if (currentLayoutInset < IOS_VIRTUAL_KEYBOARD_DELTA_THRESHOLD) {
						baselineLayoutViewportHeight = Math.max(
							baselineLayoutViewportHeight,
							layoutViewportHeight
						);
					}
					const keyboardInset = Math.max(
						0,
						baselineLayoutViewportHeight - visualViewportBottom
					);
					const keyboardLikelyOpenByViewport =
						currentLayoutInset >= IOS_VIRTUAL_KEYBOARD_DELTA_THRESHOLD;
					if (keyboardLikelyOpenByViewport) {
						maxObservedKeyboardInset = Math.max(
							maxObservedKeyboardInset,
							keyboardInset
						);
					} else if (currentLayoutInset < IOS_KEYBOARD_INSET_MIN_PX) {
						maxObservedKeyboardInset = 0;
					}
					const stabilizedKeyboardInset = keyboardLikelyOpenByViewport
						? Math.max(keyboardInset, maxObservedKeyboardInset)
						: keyboardInset;
					const computedKeyboardInset =
						stabilizedKeyboardInset >= IOS_KEYBOARD_INSET_MIN_PX
							? Math.round(stabilizedKeyboardInset)
							: 0;
					const activeElement = doc.activeElement;
					const activeElementIsVirtualKeyboardTarget =
						isVirtualKeyboardTarget(activeElement);
					const shouldForceKeyboardInsetClosedByFocusChange =
						source.startsWith("document.focusout") &&
						!activeElementIsVirtualKeyboardTarget;
					const resolvedKeyboardInset = shouldForceKeyboardInsetClosedByFocusChange
						? 0
						: computedKeyboardInset;
					this.keyboardViewportInset = resolvedKeyboardInset;
					if (resolvedKeyboardInset > 0) {
						this.syncFocusedInputVisibilityWithinPopup(visualViewportBottom);
						if (focusVisibilityRafId !== 0) {
							win.cancelAnimationFrame(focusVisibilityRafId);
						}
						focusVisibilityRafId = win.requestAnimationFrame(() => {
							focusVisibilityRafId = 0;
							const nextVisualViewportBottom =
								visualViewport.offsetTop + visualViewport.height;
							this.syncFocusedInputVisibilityWithinPopup(nextVisualViewportBottom);
						});
					} else {
						if (focusVisibilityRafId !== 0) {
							win.cancelAnimationFrame(focusVisibilityRafId);
							focusVisibilityRafId = 0;
						}
						this.lastKeyboardAutoScrollSignature = "";
					}
				};
				const scheduleUpdateKeyboardInset = (source: string) => {
					if (rafId !== 0) return;
					rafId = win.requestAnimationFrame(() => {
						rafId = 0;
						updateKeyboardInset(`${source}:raf`);
					});
				};
				const handleVisualViewportResize = () =>
					scheduleUpdateKeyboardInset("visualViewport.resize");
				const handleVisualViewportScroll = () =>
					scheduleUpdateKeyboardInset("visualViewport.scroll");
				const handleWindowResize = () => scheduleUpdateKeyboardInset("window.resize");
				const handleDocumentFocusIn = (event: FocusEvent) => {
					if (!isVirtualKeyboardTarget(event.target)) return;
					scheduleUpdateKeyboardInset("document.focusin");
				};
				const handleDocumentFocusOut = (event: FocusEvent) => {
					if (!isVirtualKeyboardTarget(event.target)) return;
					if (isVirtualKeyboardTarget(event.relatedTarget)) return;
					scheduleUpdateKeyboardInset("document.focusout");
				};

				updateKeyboardInset("watch:init");
				visualViewport.addEventListener("resize", handleVisualViewportResize);
				visualViewport.addEventListener("scroll", handleVisualViewportScroll);
				win.addEventListener("resize", handleWindowResize);
				doc.addEventListener("focusin", handleDocumentFocusIn, true);
				doc.addEventListener("focusout", handleDocumentFocusOut, true);

				return () => {
					visualViewport.removeEventListener("resize", handleVisualViewportResize);
					visualViewport.removeEventListener("scroll", handleVisualViewportScroll);
					win.removeEventListener("resize", handleWindowResize);
					doc.removeEventListener("focusin", handleDocumentFocusIn, true);
					doc.removeEventListener("focusout", handleDocumentFocusOut, true);
					if (rafId !== 0) {
						win.cancelAnimationFrame(rafId);
						rafId = 0;
					}
					if (focusVisibilityRafId !== 0) {
						win.cancelAnimationFrame(focusVisibilityRafId);
						focusVisibilityRafId = 0;
					}
					this.keyboardViewportInset = 0;
				};
			}
		);

		onDestroyEffect(() => {
			if (this.root.viewportSwipeDelegate === this) {
				this.root.viewportSwipeDelegate = null;
			}
		});
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onpointercancel = this.onpointercancel.bind(this);
		this.ontouchstart = this.ontouchstart.bind(this);
		this.ontouchmove = this.ontouchmove.bind(this);
		this.ontouchend = this.ontouchend.bind(this);
		this.ontouchcancel = this.ontouchcancel.bind(this);
	}

	get scrollAxis(): ScrollAxis {
		return this.root.opts.swipeDirection.current === "left" ||
			this.root.opts.swipeDirection.current === "right"
			? "horizontal"
			: "vertical";
	}

	get crossScrollAxis(): ScrollAxis {
		return this.scrollAxis === "vertical" ? "horizontal" : "vertical";
	}

	isSwipeIgnoredTarget(target: Element | null) {
		return Boolean(target?.closest(BITS_UI_SWIPE_IGNORE_SELECTOR));
	}

	isSwipeGestureActive(): boolean {
		return this.swipe.shouldLockTouchMove || this.swipe.swiping;
	}

	resetTouchTrackingState() {
		this.ignoreTouchSwipe = false;
		this.touchScrollState = null;
	}

	syncFocusedInputVisibilityWithinPopup(visualViewportBottom: number) {
		const popupElement = this.root.popupNode;
		if (!popupElement) return;
		const activeElement = popupElement.ownerDocument.activeElement;
		if (!(activeElement instanceof HTMLElement)) return;
		if (!popupElement.contains(activeElement)) return;
		if (!isVirtualKeyboardTarget(activeElement)) return;

		const popupRect = popupElement.getBoundingClientRect();
		const activeRect = activeElement.getBoundingClientRect();
		const visibleTop = popupRect.top;
		const visibleBottom = Math.min(popupRect.bottom, visualViewportBottom);
		const currentScrollTop = popupElement.scrollTop;
		const visibilitySignature = [
			activeElement.id || activeElement.tagName,
			Math.round(activeRect.top),
			Math.round(activeRect.bottom),
			Math.round(visibleBottom),
			popupElement.clientHeight,
			Math.round(currentScrollTop),
		].join(":");
		if (visibilitySignature === this.lastKeyboardAutoScrollSignature) return;
		this.lastKeyboardAutoScrollSignature = visibilitySignature;

		let adjustment = 0;
		if (activeRect.bottom > visibleBottom - IOS_KEYBOARD_FOCUS_VISIBILITY_GUTTER_PX) {
			adjustment =
				activeRect.bottom - (visibleBottom - IOS_KEYBOARD_FOCUS_VISIBILITY_GUTTER_PX);
		} else if (activeRect.top < visibleTop + IOS_KEYBOARD_FOCUS_VISIBILITY_GUTTER_PX) {
			adjustment = activeRect.top - (visibleTop + IOS_KEYBOARD_FOCUS_VISIBILITY_GUTTER_PX);
		}

		if (Math.abs(adjustment) < 1) return;
		const maxScrollTop = Math.max(0, popupElement.scrollHeight - popupElement.clientHeight);
		const targetScrollTop = clamp(currentScrollTop + adjustment, 0, maxScrollTop);
		if (Math.abs(targetScrollTop - currentScrollTop) < 1) return;

		popupElement.scrollTop = targetScrollTop;
	}

	setBackdropSwipingAttribute(swiping: boolean) {
		if (!this.root.backdropNode) return;
		if (swiping) {
			this.root.backdropNode.setAttribute("data-swiping", "");
		} else {
			this.root.backdropNode.removeAttribute("data-swiping");
		}
	}

	/**
	 * TextSelectionLayer sets the popup to user-select:text on pointerdown.
	 * Override while swiping so drag does not highlight text
	 */
	setPopupUserSelectSuppressedForSwipe(suppress: boolean) {
		const popup = this.root.popupNode;
		if (!popup) return;
		if (suppress) {
			popup.style.userSelect = "none";
			popup.style.setProperty("-webkit-user-select", "none");
		} else {
			popup.style.removeProperty("user-select");
			popup.style.removeProperty("-webkit-user-select");
		}
	}

	applySwipeProgress(progress: number, shouldTrackProgress: boolean, notifyParent: boolean) {
		const popupElement = this.root.popupNode;
		const backdropElement = this.root.backdropNode;
		if (!popupElement) return;

		const isActive = this.root.opts.open.current && shouldTrackProgress;
		const swipeProgress = isActive ? progress : 0;
		this.root.backdropSwipeProgress = swipeProgress;
		if (notifyParent && this.root.parent) {
			this.root.parent.setNestedSwipeProgress(swipeProgress);
		}

		this.root.provider?.setVisualState({
			swipeProgress,
			frontmostHeight: swipeProgress > 0 ? this.root.frontmostHeight : 0,
		});

		if (backdropElement) {
			if (swipeProgress > 0 && this.root.frontmostHeight > 0) {
				backdropElement.style.setProperty(
					"--drawer-height",
					`${this.root.frontmostHeight}px`
				);
			} else {
				backdropElement.style.removeProperty("--drawer-height");
			}
		}
	}

	clearSwipeStyles() {
		const popupElement = this.root.popupNode;
		const backdropElement = this.root.backdropNode;
		this.root.swipeDismissed = false;
		this.root.swipeReleaseStrength = null;
		if (popupElement) {
			// keep vars defined so consumer calc(... + var(--drawer-swipe-movement-y)) (e.g. snap demo padding/transform) never goes invalid when movement returns to rest
			popupElement.style.setProperty("--drawer-swipe-movement-x", "0px");
			popupElement.style.setProperty("--drawer-swipe-movement-y", "0px");
			popupElement.style.removeProperty("--drawer-swipe-strength");
			popupElement.style.removeProperty("user-select");
			popupElement.style.removeProperty("-webkit-user-select");
			popupElement.removeAttribute("data-swiping");
			popupElement.removeAttribute("data-swipe-dismiss");
			popupElement.removeAttribute("data-ending-style");
			popupElement.style.transition = this.popupTransition;
		}
		if (backdropElement) {
			backdropElement.style.removeProperty("--drawer-swipe-strength");
			backdropElement.removeAttribute("data-swiping");
			backdropElement.removeAttribute("data-swipe-dismiss");
		}
		this.root.backdropSwipeProgress = 0;
		this.root.provider?.setVisualState({ swipeProgress: 0, frontmostHeight: 0 });
	}

	prepareSwipeDismissTransition() {
		const popupElement = this.root.popupNode;
		const backdropElement = this.root.backdropNode;

		if (popupElement) {
			popupElement.style.transition = this.popupTransition;
			popupElement.style.removeProperty("user-select");
			popupElement.style.removeProperty("-webkit-user-select");
			popupElement.removeAttribute("data-swiping");
			popupElement.setAttribute("data-swipe-dismiss", "");
			popupElement.setAttribute("data-ending-style", "");
		}

		if (backdropElement) {
			backdropElement.style.removeProperty("--drawer-height");
			backdropElement.removeAttribute("data-swiping");
			backdropElement.setAttribute("data-swipe-dismiss", "");
			if (this.root.swipeReleaseStrength != null) {
				backdropElement.style.setProperty(
					"--drawer-swipe-strength",
					`${this.root.swipeReleaseStrength}`
				);
			}
		}

		this.root.backdropSwipeProgress = 0;
		this.root.provider?.setVisualState({ swipeProgress: 0, frontmostHeight: 0 });
	}

	resolveSwipeStrength({
		direction,
		deltaX,
		deltaY,
		velocityX,
		velocityY,
		releaseVelocityX,
		releaseVelocityY,
	}: {
		direction: SwipeDirection;
		deltaX: number;
		deltaY: number;
		velocityX: number;
		velocityY: number;
		releaseVelocityX: number;
		releaseVelocityY: number;
	}) {
		const popupElement = this.root.popupNode;
		if (!popupElement) return 1;
		const size =
			direction === "left" || direction === "right"
				? popupElement.offsetWidth
				: popupElement.offsetHeight;
		if (!Number.isFinite(size) || size <= 0) return 1;

		const axisDelta = direction === "left" || direction === "right" ? deltaX : deltaY;
		const axisVelocity =
			direction === "left" || direction === "right" ? releaseVelocityX : releaseVelocityY;
		const fallbackVelocity =
			direction === "left" || direction === "right" ? velocityX : velocityY;
		const resolvedVelocity = Math.abs(axisVelocity) > 0 ? axisVelocity : fallbackVelocity;
		const directionalVelocity =
			direction === "left" || direction === "up" ? -resolvedVelocity : resolvedVelocity;
		if (!Number.isFinite(directionalVelocity) || directionalVelocity <= 0.2) return 1;

		const translationAlongDirection =
			direction === "left" || direction === "up" ? -axisDelta : axisDelta;
		const remainingDistance = Math.max(0, size - translationAlongDirection);
		const clampedVelocity = clamp(directionalVelocity, 0.2, 4);
		const durationMs = clamp(remainingDistance / clampedVelocity, 80, 360);
		const normalizedDuration = (durationMs - 80) / (360 - 80);
		return clamp(0.1 + normalizedDuration * (1 - 0.1), 0.1, 1);
	}

	onRelease({
		direction,
		deltaX,
		deltaY,
		velocityX,
		velocityY,
		releaseVelocityX,
		releaseVelocityY,
	}: {
		direction: SwipeDirection | undefined;
		deltaX: number;
		deltaY: number;
		velocityX: number;
		velocityY: number;
		releaseVelocityX: number;
		releaseVelocityY: number;
	}) {
		const popupElement = this.root.popupNode;
		if (!popupElement) {
			this.clearSwipeStyles();
			return undefined;
		}

		const snapPoints = this.root.opts.snapPoints.current;
		if (!snapPoints?.length) {
			if (!direction) {
				this.clearSwipeStyles();
				return undefined;
			}

			const size =
				direction === "left" || direction === "right"
					? popupElement.offsetWidth
					: popupElement.offsetHeight;
			const baseThreshold = Math.max(40, size * 0.25);
			const delta = direction === "left" || direction === "right" ? deltaX : deltaY;
			const directionalDelta = direction === "left" || direction === "up" ? -delta : delta;
			const velocity = direction === "left" || direction === "right" ? velocityX : velocityY;
			const directionalVelocity =
				direction === "left" || direction === "up" ? -velocity : velocity;
			const resolvedSwipeStrength = this.resolveSwipeStrength({
				direction,
				deltaX,
				deltaY,
				velocityX,
				velocityY,
				releaseVelocityX,
				releaseVelocityY,
			});

			if (directionalVelocity >= FAST_SWIPE_VELOCITY && directionalDelta > 0) {
				this.root.swipeDismissed = true;
				this.root.swipeReleaseStrength = resolvedSwipeStrength;
				popupElement.setAttribute("data-swipe-dismiss", "");
				popupElement.style.setProperty(
					"--drawer-swipe-strength",
					`${resolvedSwipeStrength}`
				);
				return true;
			}

			const shouldClose = directionalDelta > baseThreshold;
			if (shouldClose) {
				this.root.swipeDismissed = true;
				this.root.swipeReleaseStrength = resolvedSwipeStrength;
				popupElement.setAttribute("data-swipe-dismiss", "");
				popupElement.style.setProperty(
					"--drawer-swipe-strength",
					`${resolvedSwipeStrength}`
				);
			} else {
				this.clearSwipeStyles();
			}

			return shouldClose;
		}

		if (
			this.root.opts.swipeDirection.current !== "down" &&
			this.root.opts.swipeDirection.current !== "up"
		) {
			this.clearSwipeStyles();
			return undefined;
		}

		if (!this.root.popupHeight || this.root.resolvedSnapPoints.length === 0) {
			this.clearSwipeStyles();
			return undefined;
		}

		const dragDelta = this.root.opts.swipeDirection.current === "down" ? deltaY : -deltaY;
		const currentOffset = this.root.activeSnapPointOffset ?? 0;
		const releaseDirectionalVelocity =
			this.root.opts.swipeDirection.current === "down" ? releaseVelocityY : -releaseVelocityY;
		const fallbackDirectionalVelocity =
			this.root.opts.swipeDirection.current === "down" ? velocityY : -velocityY;
		const resolvedDirectionalVelocity = Number.isFinite(releaseDirectionalVelocity)
			? releaseDirectionalVelocity
			: fallbackDirectionalVelocity;
		const velocityOffset =
			Number.isFinite(resolvedDirectionalVelocity) &&
			Math.abs(resolvedDirectionalVelocity) >= SNAP_VELOCITY_THRESHOLD
				? clamp(resolvedDirectionalVelocity, -MAX_SNAP_VELOCITY, MAX_SNAP_VELOCITY) *
					SNAP_VELOCITY_MULTIPLIER
				: 0;
		const dragTargetOffset = clamp(currentOffset + dragDelta, 0, this.root.popupHeight);
		const targetOffset = this.root.opts.snapToSequentialPoints.current
			? dragTargetOffset
			: clamp(dragTargetOffset + velocityOffset, 0, this.root.popupHeight);
		const resolvedSwipeStrength = this.resolveSwipeStrength({
			direction: this.root.opts.swipeDirection.current,
			deltaX,
			deltaY,
			velocityX,
			velocityY,
			releaseVelocityX,
			releaseVelocityY,
		});

		let closestSnapPoint = this.root.resolvedSnapPoints[0];
		if (!closestSnapPoint) {
			this.clearSwipeStyles();
			return false;
		}
		let closestDistance = Math.abs(targetOffset - closestSnapPoint.offset);
		for (const snapPoint of this.root.resolvedSnapPoints) {
			const distance = Math.abs(targetOffset - snapPoint.offset);
			if (distance < closestDistance) {
				closestDistance = distance;
				closestSnapPoint = snapPoint;
			}
		}

		const closeDistance = Math.abs(targetOffset - this.root.popupHeight);
		if (
			closeDistance < closestDistance ||
			(resolvedDirectionalVelocity >= FAST_SWIPE_VELOCITY && dragDelta > 0)
		) {
			this.root.swipeDismissed = true;
			this.root.swipeReleaseStrength = resolvedSwipeStrength;
			popupElement.setAttribute("data-swipe-dismiss", "");
			popupElement.style.setProperty("--drawer-swipe-strength", `${resolvedSwipeStrength}`);
			this.root.opts.snapPoint.current = null;
			return true;
		}

		this.root.opts.snapPoint.current = closestSnapPoint.value;
		this.clearSwipeStyles();
		return false;
	}

	onpointerdown(event: PointerEvent) {
		if (event.pointerType === "touch") return;
		if (!this.root.opts.open.current || this.root.nestedOpenCount > 0) return;
		const currentTarget = event.currentTarget;
		if (!(currentTarget instanceof Element)) return;
		const elementAtPoint = currentTarget.ownerDocument.elementFromPoint(
			event.clientX,
			event.clientY
		);
		if (elementAtPoint?.closest(BITS_UI_SWIPE_IGNORE_SELECTOR)) return;
		const contentAttr = this.root.getBitsAttr("content");
		if (elementAtPoint?.closest(`[${contentAttr}]`)) return;
		this.swipe.onpointerdown(event);
	}

	onpointermove(event: PointerEvent) {
		if (event.pointerType === "touch") return;
		this.swipe.onpointermove(event);
		this.applyMovement();
		this.clearStaleSwipeStyles();
	}

	onpointerup(event: PointerEvent) {
		if (event.pointerType === "touch") return;
		this.swipe.onpointerup(event);
		this.clearStaleSwipeStyles();
	}

	onpointercancel(event: PointerEvent) {
		if (event.pointerType === "touch") return;
		this.swipe.onpointercancel(event);
		this.clearSwipeStyles();
	}

	ontouchstart(event: TouchEvent) {
		if (this.root.touchSwipeSource === null) {
			this.root.touchSwipeSource = "viewport";
		}
		const touch = event.touches[0];
		const rootElement = this.root.viewportNode ?? this.root.popupNode;
		if (
			!this.root.opts.open.current ||
			this.root.nestedOpenCount > 0 ||
			!touch ||
			!rootElement
		) {
			this.resetTouchTrackingState();
			return;
		}

		if (isEventOnRangeInput(event)) {
			this.resetTouchTrackingState();
			return;
		}

		const elementAtPoint = rootElement.ownerDocument.elementFromPoint(
			touch.clientX,
			touch.clientY
		);
		this.ignoreTouchSwipe = this.isSwipeIgnoredTarget(elementAtPoint);
		if (this.ignoreTouchSwipe) {
			this.touchScrollState = null;
			return;
		}

		const eventTarget = isElement(event.target) ? event.target : null;
		if (
			this.root.touchSwipeSource !== "backdrop" &&
			rootElement &&
			eventTarget &&
			!rootElement.contains(eventTarget)
		) {
			this.ignoreTouchSwipe = true;
			this.touchScrollState = null;
			return;
		}

		let scrollTarget: HTMLElement | null = null;
		let hasCrossAxisScrollableContent = false;
		if (eventTarget instanceof HTMLElement) {
			scrollTarget = findScrollableTouchTarget(eventTarget, rootElement, this.scrollAxis);
			hasCrossAxisScrollableContent =
				findScrollableTouchTarget(eventTarget, rootElement, this.crossScrollAxis) != null;
		}

		let allowSwipe: boolean | null = null;
		if (scrollTarget) {
			allowSwipe = isAtSwipeStartEdge(
				scrollTarget,
				this.scrollAxis,
				this.root.opts.swipeDirection.current
			)
				? null
				: false;
		}

		this.touchScrollState = {
			startX: touch.clientX,
			startY: touch.clientY,
			lastX: touch.clientX,
			lastY: touch.clientY,
			scrollTarget,
			hasCrossAxisScrollableContent,
			allowSwipe,
			preserveNativeCrossAxisScroll: false,
		};
		this.swipe.ontouchstart(event);
		if (!this.swipe.pendingSwipe && !this.swipe.swiping) {
			this.touchScrollState = null;
		}
	}

	ontouchmove(event: TouchEvent) {
		if (this.ignoreTouchSwipe) return;

		const touchState = this.touchScrollState;
		if (touchState?.preserveNativeCrossAxisScroll) return;

		if (
			touchState?.allowSwipe === false ||
			(touchState?.scrollTarget != null && !touchState.allowSwipe)
		) {
			return;
		}

		this.swipe.ontouchmove(event);
		this.applyMovement();
		this.clearStaleSwipeStyles();
	}

	ontouchend(event: TouchEvent) {
		this.swipe.ontouchend(event);
		this.clearStaleSwipeStyles();
		this.root.touchSwipeSource = null;
		this.resetTouchTrackingState();
	}

	ontouchcancel(event: TouchEvent) {
		this.swipe.ontouchcancel(event);
		this.clearSwipeStyles();
		this.root.touchSwipeSource = null;
		this.resetTouchTrackingState();
	}

	clearStaleSwipeStyles() {
		const popupElement = this.root.popupNode;
		if (!popupElement) return;
		if (this.swipe.swiping) return;
		if (!popupElement.hasAttribute("data-swiping")) return;
		// if dismiss flow is active, prepareSwipeDismissTransition owns the ending styles
		if (popupElement.hasAttribute("data-swipe-dismiss")) return;

		this.clearSwipeStyles();
	}

	/**
	 * Popup translate lives in CSS vars (--drawer-snap-point-offset + slide + movement), not in
	 * transform matrix, so SwipeDismiss getElementTransform() baseline is 0. Seed Y/X baseline to
	 * current snap + slide so dragOffset matches total offset (Base DrawerPopup nextOffset model).
	 */
	syncSwipeBaselineForSnapPoints() {
		const popup = this.root.popupNode;
		if (!popup || !this.root.opts.snapPoints.current?.length) return;

		const dir = this.root.opts.swipeDirection.current;
		const snapBase = this.root.activeSnapPointOffset ?? 0;
		const slideXS = popup.style.getPropertyValue("--drawer-transition-slide-x") || "0px";
		const slideYS = popup.style.getPropertyValue("--drawer-transition-slide-y") || "0px";
		const slideX = Number.parseFloat(slideXS) || 0;
		const slideY = Number.parseFloat(slideYS) || 0;
		const transform = getElementTransform(popup);

		if (dir === "down" || dir === "up") {
			const baselineY = snapBase + slideY;
			this.swipe.initialTransform = { x: transform.x, y: baselineY, scale: transform.scale };
			this.swipe.dragOffset = { x: transform.x, y: baselineY };
		} else if (dir === "left" || dir === "right") {
			const baselineX = snapBase + slideX;
			this.swipe.initialTransform = { x: baselineX, y: transform.y, scale: transform.scale };
			this.swipe.dragOffset = { x: baselineX, y: transform.y };
		}

		this.swipe.recordDragSample(
			{ x: this.swipe.dragOffset.x, y: this.swipe.dragOffset.y },
			this.swipe.swipeStartTime
		);
	}

	applyMovement() {
		const popupElement = this.root.popupNode;
		if (!popupElement) return;
		if (!this.swipe.swiping) return;
		if (popupElement.style.transition !== "none") {
			this.popupTransition = popupElement.style.transition;
			popupElement.style.transition = "none";
		}

		let moveX = this.swipe.dragOffset.x;
		let moveY = this.swipe.dragOffset.y;
		if (this.root.opts.snapPoints.current?.length) {
			const snapBase = this.root.activeSnapPointOffset ?? 0;
			const slideXS =
				popupElement.style.getPropertyValue("--drawer-transition-slide-x") || "0px";
			const slideYS =
				popupElement.style.getPropertyValue("--drawer-transition-slide-y") || "0px";
			const slideX = Number.parseFloat(slideXS) || 0;
			const slideY = Number.parseFloat(slideYS) || 0;
			const dir = this.root.opts.swipeDirection.current;
			if (dir === "down" || dir === "up") {
				moveY = this.swipe.dragOffset.y - snapBase - slideY;
				if (
					dir === "down" &&
					this.swipe.swiping &&
					Number.isFinite(this.swipe.dragOffset.y)
				) {
					const nextOffset = this.swipe.dragOffset.y;
					if (nextOffset < 0) {
						const overshoot = Math.abs(nextOffset);
						const dampedOffset = -Math.sqrt(overshoot);
						moveY = dampedOffset - snapBase - slideY;
					}
				}
			} else if (dir === "left" || dir === "right") {
				moveX = this.swipe.dragOffset.x - snapBase - slideX;
			}
		}
		popupElement.style.setProperty("--drawer-swipe-movement-x", `${moveX}px`);
		popupElement.style.setProperty("--drawer-swipe-movement-y", `${moveY}px`);
		if (this.swipe.swiping) {
			popupElement.setAttribute("data-swiping", "");
		}
	}

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr("viewport")]: "",
				style: {
					"--nested-drawers": this.root.nestedOpenCount,
					"--drawer-keyboard-inset": `${this.keyboardViewportInset}px`,
				},
				"data-nested": boolToEmptyStrOrUndef(this.root.parent !== null),
				onpointerdown: this.onpointerdown,
				onpointermove: this.onpointermove,
				onpointerup: this.onpointerup,
				onpointercancel: this.onpointercancel,
				ontouchstart: this.ontouchstart,
				ontouchmove: this.ontouchmove,
				ontouchend: this.ontouchend,
				ontouchcancel: this.ontouchcancel,
				...this.root.sharedProps,
				...this.attachment,
			}) as const
	);

	get shouldRender() {
		return this.root.popupPresence.shouldRender;
	}
}

interface DrawerPopupStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			trapFocus: boolean;
			preventScroll: boolean;
		}> {}

export class DrawerPopupState {
	static create(opts: DrawerPopupStateOpts) {
		return new DrawerPopupState(opts, DrawerRootContext.get());
	}

	readonly opts: DrawerPopupStateOpts;
	readonly root: DrawerRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DrawerPopupStateOpts, root: DrawerRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.popupNode = v;
			this.root.popupId = v?.id;
		});

		let lastMeasuredHeight = 0;

		watch(
			() => this.opts.ref.current,
			(popup) => {
				if (!popup) return;
				const syncHeight = () => {
					// during leave, offsetHeight can grow to full intrinsic content
					// before unmount; applying that blows up --drawer-height and snap offsets for one frame
					if (!this.root.opts.open.current && this.root.popupPresence.shouldRender) {
						return;
					}

					const offsetHeight = popup.offsetHeight;

					if (
						lastMeasuredHeight > 0 &&
						this.root.frontmostHeight > lastMeasuredHeight &&
						offsetHeight > lastMeasuredHeight
					) {
						return;
					}

					const keepHeightWhileNested =
						lastMeasuredHeight > 0 && this.root.hasNestedDrawer;
					if (keepHeightWhileNested) {
						this.root.setPopupHeight(lastMeasuredHeight);
						return;
					}

					if (offsetHeight === lastMeasuredHeight) return;

					lastMeasuredHeight = offsetHeight;
					this.root.setPopupHeight(offsetHeight);
				};

				syncHeight();

				const resizeObserver = new ResizeObserver(syncHeight);
				resizeObserver.observe(popup);

				return () => {
					resizeObserver.disconnect();
					lastMeasuredHeight = 0;
					this.root.setPopupHeight(0);
				};
			}
		);

		watch(
			[
				() => this.root.parent,
				() => this.root.opts.open.current,
				() => this.root.popupPresence.shouldRender,
				() => this.root.frontmostHeight,
			],
			([parent, open, shouldRender, height]) => {
				if (!parent) return;
				const stillMountedForExit = shouldRender && !open;
				if (open) {
					parent.setNestedFrontmostHeight(height);
					return;
				}
				if (stillMountedForExit) return;
				parent.setNestedFrontmostHeight(0);
			}
		);

		watch(
			[
				() => this.root.parent,
				() => this.root.opts.open.current,
				() => this.root.popupPresence.shouldRender,
			],
			([parent, open, shouldRender]) => {
				if (!parent) return;
				const present = open || shouldRender;
				parent.setNestedDrawerPresence(present);
			}
		);

		onDestroyEffect(() => {
			const parent = this.root.parent;
			if (!parent) return;
			parent.setNestedDrawerPresence(false);
			parent.setNestedFrontmostHeight(0);
		});

		watch(
			[() => this.root.opts.open.current, () => this.root.nestedOpenCount],
			([open, nestedOpenCount]) => {
				if (!open) return;
				if (nestedOpenCount > 0) return;
				const win = this.opts.ref.current?.ownerDocument.defaultView;
				if (!win) return;
				const isAndroid = /Android/i.test(win.navigator.userAgent);
				if (!isAndroid) return;

				const CloseWatcherCtor = (
					win as Window & {
						CloseWatcher?: new () => EventTarget & { destroy?: () => void };
					}
				).CloseWatcher;
				if (!CloseWatcherCtor) return;

				const closeWatcher = new CloseWatcherCtor();

				const handleCloseWatcher = () => {
					if (!this.root.opts.open.current) return;
					this.root.handleClose();
				};

				closeWatcher.addEventListener("close", handleCloseWatcher);

				return () => {
					closeWatcher.removeEventListener("close", handleCloseWatcher);
					closeWatcher.destroy?.();
				};
			}
		);

		watch(
			[
				() => this.root.opts.open.current,
				() => this.opts.preventScroll.current,
				() => this.opts.ref.current,
			],
			([open, preventScroll, popup]) => {
				if (!open || !preventScroll || !isIOS || !popup) return;

				const doc = popup.ownerDocument;
				const win = doc.defaultView;
				if (!win) return;
				let keyboardFocusWithinPopup = false;
				let touchStartRestoreListener: ((event: TouchEvent) => void) | null = null;
				let focusRelayTimeoutId: number | null = null;
				let focusRelayClone: HTMLElement | null = null;
				let lastTouchStartTarget: HTMLElement | null = null;
				let lastTouchStartTimestamp = 0;

				const hasKeyboardFocusWithinPopup = () => {
					const activeElement = doc.activeElement;
					return Boolean(
						activeElement &&
							popup.contains(activeElement) &&
							isVirtualKeyboardTarget(activeElement)
					);
				};

				const syncKeyboardFocusWithinPopup = () => {
					keyboardFocusWithinPopup = hasKeyboardFocusWithinPopup();
				};

				const isFocusRelayClone = (target: EventTarget | null): boolean => {
					return (
						target instanceof HTMLElement &&
						target.getAttribute(IOS_FOCUS_RELAY_CLONE_ATTR) === "true"
					);
				};

				const clearFocusRelayClone = () => {
					if (focusRelayClone?.isConnected) {
						focusRelayClone.remove();
					}
					focusRelayClone = null;
					if (focusRelayTimeoutId !== null) {
						win.clearTimeout(focusRelayTimeoutId);
						focusRelayTimeoutId = null;
					}
				};

				const clearTouchStartRestoreListener = () => {
					if (!touchStartRestoreListener) return;
					doc.removeEventListener("touchstart", touchStartRestoreListener, true);
					touchStartRestoreListener = null;
				};

				const installTouchStartRestoreListener = () => {
					clearTouchStartRestoreListener();
					touchStartRestoreListener = (event) => {
						const target = event.target;
						if (!(target instanceof HTMLElement) || !popup.contains(target)) return;
						if (!isVirtualKeyboardTarget(target)) return;
						focusWithoutScroll(target);
						clearTouchStartRestoreListener();
					};
					doc.addEventListener("touchstart", touchStartRestoreListener, {
						capture: true,
						passive: true,
					});
				};

				const handleTouchStartIntentCapture = (event: TouchEvent) => {
					const target = event.target;
					if (!(target instanceof HTMLElement) || !popup.contains(target)) return;
					lastTouchStartTarget = target;
					lastTouchStartTimestamp = Date.now();
				};

				const relayFocusViaClone = (from: HTMLElement, to: HTMLElement) => {
					clearFocusRelayClone();
					const clone = from.cloneNode(false);
					if (!(clone instanceof HTMLElement)) {
						focusWithoutScroll(to);
						return;
					}
					clone.removeAttribute("id");
					clone.setAttribute(IOS_FOCUS_RELAY_CLONE_ATTR, "true");
					clone.style.setProperty("position", "fixed");
					clone.style.setProperty("left", "0");
					clone.style.setProperty("top", "0");
					clone.style.setProperty("transform", "translateY(-3000px) scale(0)");
					popup.appendChild(clone);
					focusRelayClone = clone;
					focusWithoutScroll(clone);
					focusRelayTimeoutId = win.setTimeout(() => {
						focusRelayTimeoutId = null;
						focusWithoutScroll(to);
						if (focusRelayClone === clone) {
							focusRelayClone = null;
						}
						if (clone.isConnected) {
							clone.remove();
						}
					}, IOS_FOCUS_RELAY_DELAY_MS);
				};

				const shouldBlockBackgroundGesture = (target: EventTarget | null) => {
					if (!keyboardFocusWithinPopup && !hasKeyboardFocusWithinPopup()) {
						return false;
					}
					return !(target instanceof Node && popup.contains(target));
				};

				const handleFocusIn = (event: FocusEvent) => {
					const target = event.target;
					if (!(target instanceof Node) || !popup.contains(target)) return;
					if (isFocusRelayClone(target)) return;
					if (!isVirtualKeyboardTarget(target)) return;
					keyboardFocusWithinPopup = true;
				};

				const handleFocusOut = () => {
					setTimeout(() => {
						syncKeyboardFocusWithinPopup();
					}, 0);
				};

				const handleBlurCapture = (event: FocusEvent) => {
					const target = event.target;
					if (!(target instanceof HTMLElement) || !popup.contains(target)) return;
					if (isFocusRelayClone(target)) return;

					const relatedTarget = event.relatedTarget;
					if (!(relatedTarget instanceof HTMLElement)) {
						const visualViewport = win.visualViewport;
						const layoutViewportHeight = visualViewport
							? getLayoutViewportHeight(win)
							: null;
						const visualViewportBottom =
							visualViewport && layoutViewportHeight !== null
								? visualViewport.offsetTop + visualViewport.height
								: null;
						const currentLayoutInset =
							layoutViewportHeight !== null && visualViewportBottom !== null
								? Math.max(0, layoutViewportHeight - visualViewportBottom)
								: null;
						const touchIntentAgeMs =
							lastTouchStartTimestamp > 0
								? Date.now() - lastTouchStartTimestamp
								: null;
						const recentTouchIntentTarget = lastTouchStartTarget;
						const recentTouchTargetIsBlurredTarget =
							recentTouchIntentTarget != null && recentTouchIntentTarget === target;
						const activeElement = doc.activeElement;
						const activeElementIsBody = activeElement === doc.body;
						const shouldUseRecentTouchIntentFallback = Boolean(
							recentTouchIntentTarget &&
								recentTouchIntentTarget.isConnected &&
								popup.contains(recentTouchIntentTarget) &&
								isVirtualKeyboardTarget(recentTouchIntentTarget) &&
								touchIntentAgeMs !== null &&
								touchIntentAgeMs <= IOS_RECENT_TOUCH_INTENT_WINDOW_MS &&
								!recentTouchTargetIsBlurredTarget
						);
						const shouldUseSameTargetCloneFallback = Boolean(
							recentTouchTargetIsBlurredTarget &&
								touchIntentAgeMs !== null &&
								touchIntentAgeMs <= IOS_RECENT_TOUCH_INTENT_WINDOW_MS &&
								activeElementIsBody &&
								currentLayoutInset !== null &&
								currentLayoutInset >= IOS_VIRTUAL_KEYBOARD_DELTA_THRESHOLD &&
								isVirtualKeyboardTarget(target)
						);

						if (shouldUseRecentTouchIntentFallback && recentTouchIntentTarget) {
							clearTouchStartRestoreListener();
							keyboardFocusWithinPopup = true;
							focusWithoutScroll(recentTouchIntentTarget);
							return;
						}

						if (shouldUseSameTargetCloneFallback) {
							clearTouchStartRestoreListener();
							keyboardFocusWithinPopup = true;
							relayFocusViaClone(target, target);
							return;
						}

						installTouchStartRestoreListener();
						return;
					}
					if (isFocusRelayClone(relatedTarget)) return;
					if (!popup.contains(relatedTarget)) return;

					clearTouchStartRestoreListener();

					const relatedTargetSensitiveAuth = isSensitiveAuthInputTarget(relatedTarget);
					const targetIsTextEditable = isTextEditableInputTarget(target);
					const targetNearKeyboardEdge = isNearKeyboardVisualViewportEdge(target);
					const targetIsSelectLike = isSelectLikeInputTarget(target);
					const shouldUseFocusRelayClone =
						!relatedTargetSensitiveAuth &&
						targetIsTextEditable &&
						targetNearKeyboardEdge &&
						!targetIsSelectLike;

					if (shouldUseFocusRelayClone) {
						relayFocusViaClone(target, relatedTarget);
						return;
					}

					focusWithoutScroll(relatedTarget);
				};

				const handleTouchMoveCapture = (event: TouchEvent) => {
					if (!event.cancelable || event.touches.length > 1) return;
					if (!shouldBlockBackgroundGesture(event.target)) return;
					event.preventDefault();
				};

				const handleWheelCapture = (event: WheelEvent) => {
					if (!event.cancelable) return;
					if (!shouldBlockBackgroundGesture(event.target)) return;
					event.preventDefault();
				};

				syncKeyboardFocusWithinPopup();
				doc.addEventListener("focusin", handleFocusIn, true);
				doc.addEventListener("focusout", handleFocusOut, true);
				doc.addEventListener("blur", handleBlurCapture, true);
				doc.addEventListener("touchstart", handleTouchStartIntentCapture, {
					capture: true,
					passive: true,
				});
				doc.addEventListener("touchmove", handleTouchMoveCapture, {
					passive: false,
					capture: true,
				});
				doc.addEventListener("wheel", handleWheelCapture, {
					passive: false,
					capture: true,
				});

				return () => {
					doc.removeEventListener("focusin", handleFocusIn, true);
					doc.removeEventListener("focusout", handleFocusOut, true);
					doc.removeEventListener("blur", handleBlurCapture, true);
					doc.removeEventListener("touchstart", handleTouchStartIntentCapture, true);
					doc.removeEventListener("touchmove", handleTouchMoveCapture, true);
					doc.removeEventListener("wheel", handleWheelCapture, true);
					clearTouchStartRestoreListener();
					clearFocusRelayClone();
				};
			}
		);
	}

	readonly snippetProps = $derived.by(() => ({ open: this.root.opts.open.current }));

	readonly props = $derived.by(() => {
		const slide = drawerPresenceSlideOffset(
			this.root.opts.swipeDirection.current,
			this.root.popupPresence.transitionStatus
		);
		// presence may still read transitionStatus as idle for a frame after open flips false
		// without this, we drop --drawer-height (auto layout) and the sheet flashes to full
		// intrinsic height before exit
		const exitLayoutLocked =
			this.root.popupPresence.transitionStatus === "ending" ||
			(!this.root.opts.open.current && this.root.popupPresence.shouldRender);
		const shouldUseAutoHeight = !this.root.hasNestedDrawer && !exitLayoutLocked;
		const popupHeightCssVarValue =
			this.root.popupHeight > 0 && !shouldUseAutoHeight
				? `${this.root.popupHeight}px`
				: undefined;
		const frontmostHeightCssVarValue =
			this.root.frontmostHeight > 0 ? `${this.root.frontmostHeight}px` : undefined;

		return {
			id: this.opts.id.current,
			role: "dialog",
			"aria-modal": boolToStrTrueOrUndef(
				this.opts.trapFocus.current && this.opts.preventScroll.current
			),
			"aria-describedby": this.root.descriptionId,
			"aria-labelledby": this.root.titleId,
			tabindex: -1,
			[this.root.getBitsAttr("popup")]: "",
			style: {
				"--nested-drawers": this.root.nestedOpenCount,
				"--drawer-height": popupHeightCssVarValue,
				"--drawer-frontmost-height": frontmostHeightCssVarValue,
				"--drawer-swipe-progress": `${this.root.nestedSwipeProgress}`,
				"--drawer-swipe-movement-x": "0px",
				"--drawer-swipe-movement-y": "0px",
				"--drawer-transition-slide-x": slide.x,
				"--drawer-transition-slide-y": slide.y,
				"--drawer-snap-point-offset":
					this.root.activeSnapPointOffset === null
						? "0px"
						: `${this.root.activeSnapPointOffset}px`,
				"--drawer-swipe-strength":
					this.root.swipeReleaseStrength != null
						? `${this.root.swipeReleaseStrength}`
						: 1,
			},
			"data-swipe-dismiss": boolToEmptyStrOrUndef(this.root.swipeDismissed),
			"data-nested-drawer-open": boolToEmptyStrOrUndef(this.root.nestedOpenCount > 0),
			"data-nested-drawer-stacked": boolToEmptyStrOrUndef(this.root.hasNestedDrawer),
			"data-nested-drawer-swiping": boolToEmptyStrOrUndef(this.root.nestedSwiping),
			"data-nested": boolToEmptyStrOrUndef(this.root.parent !== null),
			"data-expanded": boolToEmptyStrOrUndef(this.root.activeResolvedSnapPoint?.value === 1),
			"data-swipe-direction": this.root.opts.swipeDirection.current,
			...getDataTransitionAttrs(this.root.popupPresence.transitionStatus),
			...this.root.sharedProps,
			...this.attachment,
		} as const;
	});

	get shouldRender() {
		return this.root.popupPresence.shouldRender;
	}
}

interface DrawerContentStateOpts extends WithRefOpts {}

export class DrawerContentState {
	static create(opts: DrawerContentStateOpts) {
		return new DrawerContentState(opts, DrawerRootContext.get());
	}

	readonly opts: DrawerContentStateOpts;
	readonly root: DrawerRootState;
	readonly attachment: RefAttachment;

	constructor(opts: DrawerContentStateOpts, root: DrawerRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.contentNode = v;
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr("content")]: "",
				...this.root.sharedProps,
				...this.attachment,
			}) as const
	);
}

interface DrawerSwipeAreaStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			swipeDirection: DrawerSwipeDirection | undefined;
		}> {}

export class DrawerSwipeAreaState {
	static create(opts: DrawerSwipeAreaStateOpts) {
		return new DrawerSwipeAreaState(opts, DrawerRootContext.get());
	}

	readonly opts: DrawerSwipeAreaStateOpts;
	readonly root: DrawerRootState;
	readonly attachment: RefAttachment;
	readonly swipe: SwipeDismiss;
	swipeActive = $state(false);
	openedBySwipe = false;
	closedOffset: number | null = null;
	popupSwipeTransition: string | null = null;

	constructor(opts: DrawerSwipeAreaStateOpts, root: DrawerRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onpointercancel = this.onpointercancel.bind(this);
		this.ontouchstart = this.ontouchstart.bind(this);
		this.ontouchmove = this.ontouchmove.bind(this);
		this.ontouchend = this.ontouchend.bind(this);
		this.ontouchcancel = this.ontouchcancel.bind(this);
		this.swipe = new SwipeDismiss({
			enabled: () =>
				!this.opts.disabled.current && (!this.root.opts.open.current || this.swipeActive),
			directions: () => [this.resolvedSwipeDirection],
			element: () => this.opts.ref.current,
			trackDrag: false,
			onSwipeStart: () => {
				this.swipeActive = true;
				this.openedBySwipe = false;
			},
			onProgress: (_progress, details) => {
				if (
					!details ||
					!this.swipeActive ||
					details.direction !== this.resolvedSwipeDirection
				) {
					return;
				}

				const displacement = getDisplacement(
					this.resolvedSwipeDirection,
					details.deltaX,
					details.deltaY
				);

				if (displacement < 1 && !this.openedBySwipe) return;

				if (!this.openedBySwipe) {
					this.openedBySwipe = true;
					this.root.handleOpen();
				}

				this.applySwipeMovement(details.deltaX, details.deltaY);
			},
			onRelease: ({
				event,
				direction,
				deltaX,
				deltaY,
				releaseVelocityX,
				releaseVelocityY,
			}) => {
				const displacement = getDisplacement(this.resolvedSwipeDirection, deltaX, deltaY);
				const releaseVelocity = getDisplacement(
					this.resolvedSwipeDirection,
					releaseVelocityX,
					releaseVelocityY
				);
				const threshold = this.resolveSwipeOpenThreshold();
				const hasEnoughDistance = threshold != null && displacement >= threshold;
				const hasEnoughVelocity = releaseVelocity >= 0.1;

				const softCommitWhileDragging =
					this.openedBySwipe && threshold != null && displacement >= threshold * 0.5;
				const shouldOpen =
					threshold != null &&
					direction === this.resolvedSwipeDirection &&
					(hasEnoughDistance || hasEnoughVelocity || softCommitWhileDragging) &&
					!this.opts.disabled.current;

				if (shouldOpen) {
					if (!this.root.opts.open.current) {
						this.root.handleOpen();
					}
				} else if (this.openedBySwipe) {
					this.root.handleClose();
				}

				this.swipeActive = false;
				this.openedBySwipe = false;
				this.closedOffset = null;
				this.clearSwipeStyles();
				return false;
			},
		});
	}

	get resolvedSwipeDirection() {
		return (
			this.opts.swipeDirection.current ??
			oppositeSwipeDirection(this.root.opts.swipeDirection.current)
		);
	}

	resolvePopupSize() {
		const popupElement = this.root.popupNode;
		if (!popupElement) return null;
		const isHorizontal =
			this.root.opts.swipeDirection.current === "left" ||
			this.root.opts.swipeDirection.current === "right";
		const size = isHorizontal ? popupElement.offsetWidth : popupElement.offsetHeight;
		return size > 0 ? size : null;
	}

	resolveSwipeOpenThreshold() {
		const popupSize = this.resolvePopupSize();
		if (popupSize == null) return 40;
		return popupSize * 0.5;
	}

	applySwipeMovement(deltaX: number, deltaY: number) {
		if (!this.swipeActive) return;
		const popupElement = this.root.popupNode;
		if (!popupElement) return;
		if (!this.root.opts.open.current) return;

		if (this.closedOffset == null) {
			this.closedOffset = this.resolvePopupSize();
		}

		const closedOffset = this.closedOffset;
		if (!closedOffset || !Number.isFinite(closedOffset) || closedOffset <= 0) return;

		const displacement = getDisplacement(this.resolvedSwipeDirection, deltaX, deltaY);
		const clampedDisplacement = Math.max(0, displacement);
		const dampedDisplacement =
			clampedDisplacement > closedOffset
				? closedOffset + Math.sqrt(clampedDisplacement - closedOffset)
				: clampedDisplacement;
		const remaining = closedOffset - dampedDisplacement;
		const dismissDirection = oppositeSwipeDirection(this.resolvedSwipeDirection);
		const directionSign = dismissDirection === "left" || dismissDirection === "up" ? -1 : 1;
		const movement = remaining * directionSign;
		const isHorizontal = dismissDirection === "left" || dismissDirection === "right";
		const movementX = isHorizontal ? movement : 0;
		const movementY = isHorizontal ? 0 : movement;
		const openProgress = Math.max(0, Math.min(1, clampedDisplacement / closedOffset));
		const backdropProgress = Math.max(0, Math.min(1, 1 - openProgress));

		if (this.popupSwipeTransition === null) {
			this.popupSwipeTransition = popupElement.style.transition;
		}
		popupElement.style.transition = "none";

		popupElement.style.setProperty("--drawer-swipe-movement-x", `${movementX}px`);
		popupElement.style.setProperty("--drawer-swipe-movement-y", `${movementY}px`);
		popupElement.setAttribute("data-swiping", "");

		const backdropElement = this.root.backdropNode;
		this.root.backdropSwipeProgress = backdropProgress;
		if (backdropElement) {
			backdropElement.setAttribute("data-swiping", "");
			if (openProgress > 0 && this.root.frontmostHeight > 0) {
				backdropElement.style.setProperty(
					"--drawer-height",
					`${this.root.frontmostHeight}px`
				);
			} else {
				backdropElement.style.removeProperty("--drawer-height");
			}
		}

		this.root.provider?.setVisualState({
			swipeProgress: openProgress,
			frontmostHeight: openProgress > 0 ? this.root.frontmostHeight : 0,
		});
	}

	clearSwipeStyles() {
		const popupElement = this.root.popupNode;
		if (popupElement) {
			popupElement.style.setProperty("--drawer-swipe-movement-x", "0px");
			popupElement.style.setProperty("--drawer-swipe-movement-y", "0px");
			popupElement.removeAttribute("data-swiping");
			if (this.popupSwipeTransition !== null) {
				popupElement.style.transition = this.popupSwipeTransition;
				this.popupSwipeTransition = null;
			}
		}
		const backdropElement = this.root.backdropNode;
		if (backdropElement) {
			backdropElement.removeAttribute("data-swiping");
			backdropElement.style.removeProperty("--drawer-height");
		}
		this.root.backdropSwipeProgress = 0;
		this.root.provider?.setVisualState({ swipeProgress: 0, frontmostHeight: 0 });
	}

	onpointerdown(event: PointerEvent) {
		if (event.pointerType === "touch") return;
		this.swipe.onpointerdown(event);
		event.preventDefault();
	}

	onpointermove(event: PointerEvent) {
		if (event.pointerType === "touch") return;
		this.swipe.onpointermove(event);
	}

	onpointerup(event: PointerEvent) {
		if (event.pointerType === "touch") return;
		this.swipe.onpointerup(event);
	}

	onpointercancel(event: PointerEvent) {
		if (event.pointerType === "touch") return;
		this.swipe.onpointercancel(event);
		this.clearSwipeStyles();
	}

	ontouchstart(event: TouchEvent) {
		this.swipe.ontouchstart(event);
	}

	ontouchmove(event: TouchEvent) {
		this.swipe.ontouchmove(event);
	}

	ontouchend(event: TouchEvent) {
		this.swipe.ontouchend(event);
	}

	ontouchcancel(event: TouchEvent) {
		this.swipe.ontouchcancel(event);
		this.clearSwipeStyles();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "presentation",
				"aria-hidden": "true",
				[this.root.getBitsAttr("swipe-area")]: "",
				"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
				"data-swipe-direction": this.resolvedSwipeDirection,
				"data-swiping": boolToEmptyStrOrUndef(this.swipe.swiping),
				style: {
					pointerEvents:
						!this.opts.disabled.current &&
						(!this.root.opts.open.current || this.swipeActive)
							? undefined
							: "none",
					touchAction:
						this.resolvedSwipeDirection === "left" ||
						this.resolvedSwipeDirection === "right"
							? "pan-y"
							: "pan-x",
				},
				onpointerdown: this.onpointerdown,
				onpointermove: this.onpointermove,
				onpointerup: this.onpointerup,
				onpointercancel: this.onpointercancel,
				ontouchstart: this.ontouchstart,
				ontouchmove: this.ontouchmove,
				ontouchend: this.ontouchend,
				ontouchcancel: this.ontouchcancel,
				...this.root.sharedProps,
				...this.attachment,
			}) as const
	);
}

export class DrawerIndentState {
	static create(opts: WithRefOpts) {
		return new DrawerIndentState(opts);
	}

	readonly opts: WithRefOpts;
	readonly provider = DrawerProviderContext.getOr(null);
	readonly attachment: RefAttachment;

	constructor(opts: WithRefOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[drawerAttrs.getAttr("indent")]: "",
				"data-active": boolToEmptyStrOrUndef(this.provider?.active ?? false),
				"data-inactive": boolToEmptyStrOrUndef(!(this.provider?.active ?? false)),
				style: {
					"--drawer-swipe-progress": this.provider?.swipeProgress ?? 0,
					"--drawer-frontmost-height": `${this.provider?.frontmostHeight ?? 0}px`,
				},
				...this.attachment,
			}) as const
	);
}

export class DrawerIndentBackgroundState {
	static create(opts: WithRefOpts) {
		return new DrawerIndentBackgroundState(opts);
	}

	readonly opts: WithRefOpts;
	readonly provider = DrawerProviderContext.getOr(null);
	readonly attachment: RefAttachment;

	constructor(opts: WithRefOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[drawerAttrs.getAttr("indent-background")]: "",
				"data-active": boolToEmptyStrOrUndef(this.provider?.active ?? false),
				"data-inactive": boolToEmptyStrOrUndef(!(this.provider?.active ?? false)),
				...this.attachment,
			}) as const
	);
}
