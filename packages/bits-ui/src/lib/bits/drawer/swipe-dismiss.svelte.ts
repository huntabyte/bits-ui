type ScrollAxis = "horizontal" | "vertical";

export type SwipeDirection = "up" | "down" | "left" | "right";

export type SwipeDismissNativeEvent = PointerEvent | TouchEvent;

export type SwipeProgressDetails = {
	deltaX: number;
	deltaY: number;
	direction: SwipeDirection | undefined;
};

const DEFAULT_SWIPE_THRESHOLD = 40;
const REVERSE_CANCEL_THRESHOLD = 10;
const MIN_DRAG_THRESHOLD = 1;
const MIN_VELOCITY_DURATION_MS = 50;
const MIN_RELEASE_VELOCITY_DURATION_MS = 16;
const MAX_RELEASE_VELOCITY_AGE_MS = 80;
const DEFAULT_IGNORE_SELECTOR = 'button,a,input,select,textarea,label,[role="button"]';
const TOUCH_INTENT_THRESHOLD_PX = 8;
const TOUCH_INTENT_AXIS_BIAS_PX = 2;

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

function getComputedStyleSafe(element: HTMLElement) {
	return (
		element.ownerDocument.defaultView?.getComputedStyle(element) ?? getComputedStyle(element)
	);
}

function isScrollable(element: HTMLElement, axis: ScrollAxis): boolean {
	const style = getComputedStyleSafe(element);

	if (axis === "vertical") {
		const overflowY = style.overflowY;
		return (
			(overflowY === "auto" || overflowY === "scroll") &&
			element.scrollHeight > element.clientHeight
		);
	}

	const overflowX = style.overflowX;
	return (
		(overflowX === "auto" || overflowX === "scroll") &&
		element.scrollWidth > element.clientWidth
	);
}

function hasScrollableAncestor(
	target: HTMLElement,
	root: HTMLElement,
	axes: ScrollAxis[]
): boolean {
	let node: HTMLElement | null = target;
	while (node && node !== root) {
		for (const axis of axes) {
			if (isScrollable(node, axis)) {
				return true;
			}
		}
		node = node.parentElement;
	}
	return false;
}

function findScrollableTouchTarget(
	target: EventTarget | null,
	root: HTMLElement,
	axis: ScrollAxis = "vertical"
): HTMLElement | null {
	let node = target instanceof HTMLElement ? target : null;
	while (node && node !== root) {
		if (isScrollable(node, axis)) return node;
		node = node.parentElement;
	}

	return isScrollable(root, axis) ? root : null;
}

function getElementAtPoint(doc: Document | null | undefined, x: number, y: number) {
	return typeof doc?.elementFromPoint === "function" ? doc.elementFromPoint(x, y) : null;
}

function getTarget(event: Event) {
	return event.target instanceof HTMLElement ? event.target : null;
}

function contains(parent: HTMLElement | null | undefined, child: HTMLElement | null | undefined) {
	return !!parent && !!child && (parent === child || parent.contains(child));
}

function getValidTimeStamp(timeStamp: number): number | null {
	return Number.isFinite(timeStamp) && timeStamp > 0 ? timeStamp : null;
}

function hasPrimaryMouseButton(buttons: number): boolean {
	return buttons % 2 === 1;
}

function safelyChangePointerCapture(
	element: HTMLElement,
	pointerId: number,
	method: "setPointerCapture" | "releasePointerCapture"
) {
	const pointerCaptureMethod = element[method];
	if (typeof pointerCaptureMethod !== "function") return;

	try {
		pointerCaptureMethod.call(element, pointerId);
	} catch (error) {
		if (
			error &&
			typeof error === "object" &&
			"name" in error &&
			error.name === "NotFoundError"
		) {
			return;
		}
	}
}

export function getDisplacement(direction: SwipeDirection, deltaX: number, deltaY: number) {
	switch (direction) {
		case "up":
			return -deltaY;
		case "down":
			return deltaY;
		case "left":
			return -deltaX;
		case "right":
			return deltaX;
		default:
			return 0;
	}
}

export function getElementTransform(element: HTMLElement) {
	const computedStyle = getComputedStyleSafe(element);
	const transform = computedStyle.transform;
	let translateX = 0;
	let translateY = 0;
	let scale = 1;

	if (transform && transform !== "none") {
		const matrix = transform.match(/matrix(?:3d)?\(([^)]+)\)/);
		if (matrix) {
			const values = matrix[1]?.split(", ").map(Number.parseFloat) ?? [];
			if (values.length === 6) {
				translateX = values[4] ?? 0;
				translateY = values[5] ?? 0;
				scale = Math.sqrt(
					(values[0] ?? 1) * (values[0] ?? 1) + (values[1] ?? 0) * (values[1] ?? 0)
				);
			} else if (values.length === 16) {
				translateX = values[12] ?? 0;
				translateY = values[13] ?? 0;
				scale = values[0] ?? 1;
			}
		}
	}

	return { x: translateX, y: translateY, scale };
}

type SwipeDismissOptions = {
	enabled: () => boolean;
	directions: () => SwipeDirection[];
	element: () => HTMLElement | null;
	swipeThreshold?:
		| number
		| ((details: { element: HTMLElement; direction: SwipeDirection }) => number);
	canStart?: (
		position: { x: number; y: number },
		details: { nativeEvent: SwipeDismissNativeEvent; direction: SwipeDirection | undefined }
	) => boolean;
	ignoreScrollableAncestors?: boolean;
	ignoreSelectorWhenTouch?: boolean;
	trackDrag?: boolean;
	onSwipeStart?: (event: SwipeDismissNativeEvent) => void;
	onProgress?: (progress: number, details?: SwipeProgressDetails) => void;
	onSwipingChange?: (swiping: boolean) => void;
	onRelease?: (details: {
		event: SwipeDismissNativeEvent;
		direction: SwipeDirection | undefined;
		deltaX: number;
		deltaY: number;
		velocityX: number;
		velocityY: number;
		releaseVelocityX: number;
		releaseVelocityY: number;
	}) => boolean | void;
	onDismiss?: (event: SwipeDismissNativeEvent, details: { direction: SwipeDirection }) => void;
};

export class SwipeDismiss {
	readonly #opts: SwipeDismissOptions;
	readonly ignoreSelector = DEFAULT_IGNORE_SELECTOR;

	swiping = $state(false);
	swipeDirection = $state<SwipeDirection | undefined>(undefined);
	dragDismissed = $state(false);
	isRealSwipe = $state(false);
	lockedDirection = $state<"horizontal" | "vertical" | null>(null);

	dragStartPos = { x: 0, y: 0 };
	dragOffset = { x: 0, y: 0 };
	lastMovePos: { x: number; y: number } | null = null;
	initialTransform = { x: 0, y: 0, scale: 1 };
	intendedSwipeDirection: SwipeDirection | undefined = undefined;
	maxSwipeDisplacement = 0;
	cancelledSwipe = false;
	swipeCancelBaseline = { x: 0, y: 0 };
	isFirstPointerMove = false;
	pendingSwipe = false;
	pendingSwipeStartPos: { x: number; y: number } | null = null;
	pendingTouchIntent = $state(false);
	swipeFromScrollable = false;
	sawPrimaryButtonsOnMove = false;
	elementSize = { width: 0, height: 0 };
	swipeProgress = 0;
	swipeThresholdValue = DEFAULT_SWIPE_THRESHOLD;
	swipeStartTime: number | null = null;
	lastDragSample: { x: number; y: number; time: number } | null = null;
	lastDragVelocity = { x: 0, y: 0 };
	lastProgressDetails: SwipeProgressDetails | null = null;

	constructor(opts: SwipeDismissOptions) {
		this.#opts = opts;

		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onpointercancel = this.onpointercancel.bind(this);
		this.ontouchstart = this.ontouchstart.bind(this);
		this.ontouchmove = this.ontouchmove.bind(this);
		this.ontouchend = this.ontouchend.bind(this);
		this.ontouchcancel = this.ontouchcancel.bind(this);
	}

	get directions() {
		return this.#opts.directions();
	}

	get enabled() {
		return this.#opts.enabled();
	}

	get element() {
		return this.#opts.element();
	}

	get primaryDirection() {
		return this.directions.length === 1 ? this.directions[0] : undefined;
	}

	get allowLeft() {
		return this.directions.includes("left");
	}

	get allowRight() {
		return this.directions.includes("right");
	}

	get allowUp() {
		return this.directions.includes("up");
	}

	get allowDown() {
		return this.directions.includes("down");
	}

	get hasHorizontal() {
		return this.allowLeft || this.allowRight;
	}

	get hasVertical() {
		return this.allowUp || this.allowDown;
	}

	get scrollAxes(): ScrollAxis[] {
		const axes: ScrollAxis[] = [];
		if (this.hasVertical) axes.push("vertical");
		if (this.hasHorizontal) axes.push("horizontal");
		return axes;
	}

	get shouldLockTouchMove() {
		return this.pendingTouchIntent;
	}

	isDirectionAllowed(direction: SwipeDirection): boolean {
		return (
			(direction === "left" && this.allowLeft) ||
			(direction === "right" && this.allowRight) ||
			(direction === "up" && this.allowUp) ||
			(direction === "down" && this.allowDown)
		);
	}

	resolvePendingTouchIntentDirection(deltaX: number, deltaY: number): SwipeDirection | null {
		const absDeltaX = Math.abs(deltaX);
		const absDeltaY = Math.abs(deltaY);

		if (this.hasVertical && !this.hasHorizontal) {
			if (absDeltaY < TOUCH_INTENT_THRESHOLD_PX) return null;
			if (absDeltaY < absDeltaX + TOUCH_INTENT_AXIS_BIAS_PX) return null;
			return deltaY > 0 ? "down" : "up";
		}

		if (this.hasHorizontal && !this.hasVertical) {
			if (absDeltaX < TOUCH_INTENT_THRESHOLD_PX) return null;
			if (absDeltaX < absDeltaY + TOUCH_INTENT_AXIS_BIAS_PX) return null;
			return deltaX > 0 ? "right" : "left";
		}

		if (Math.max(absDeltaX, absDeltaY) < TOUCH_INTENT_THRESHOLD_PX) return null;
		if (absDeltaX >= absDeltaY) return deltaX > 0 ? "right" : "left";
		return deltaY > 0 ? "down" : "up";
	}

	resolvePendingTouchIntent(
		position: { x: number; y: number },
		nativeEvent: PointerEvent | TouchEvent,
		allowedToStart: boolean
	): { confirmed: boolean; direction: SwipeDirection | null; movementDistance: number } {
		if (!this.pendingSwipe || this.swiping || !this.isTouchLikeEvent(nativeEvent)) {
			this.pendingTouchIntent = false;
			return { confirmed: false, direction: null, movementDistance: 0 };
		}

		if (!allowedToStart || !this.pendingSwipeStartPos) {
			this.pendingTouchIntent = false;
			return { confirmed: false, direction: null, movementDistance: 0 };
		}

		const deltaX = position.x - this.pendingSwipeStartPos.x;
		const deltaY = position.y - this.pendingSwipeStartPos.y;
		const movementDistance = Math.hypot(deltaX, deltaY);
		const direction = this.resolvePendingTouchIntentDirection(deltaX, deltaY);
		const confirmed = !!direction && this.isDirectionAllowed(direction);
		this.pendingTouchIntent = confirmed;
		return { confirmed, direction, movementDistance };
	}

	refreshPendingTouchIntent(
		position: { x: number; y: number },
		nativeEvent: PointerEvent | TouchEvent
	) {
		const allowedToStart = this.#opts.canStart
			? this.#opts.canStart(position, {
					nativeEvent,
					direction: this.primaryDirection,
				})
			: true;
		return this.resolvePendingTouchIntent(position, nativeEvent, allowedToStart);
	}

	resolveSwipeThreshold(direction: SwipeDirection | undefined) {
		if (!direction) return;
		const swipeThreshold = this.#opts.swipeThreshold;
		if (typeof swipeThreshold !== "function") {
			this.swipeThresholdValue = Math.max(
				0,
				typeof swipeThreshold === "number" ? swipeThreshold : DEFAULT_SWIPE_THRESHOLD
			);
			return;
		}

		const element = this.element;
		if (!element) return;
		this.swipeThresholdValue = Math.max(0, swipeThreshold({ element, direction }));
	}

	updateSwipeProgress(progress: number, details?: SwipeProgressDetails) {
		const nextProgress = Number.isFinite(progress) ? clamp(progress, 0, 1) : 0;
		const progressChanged = nextProgress !== this.swipeProgress;
		const detailsChanged =
			!!details &&
			(!this.lastProgressDetails ||
				this.lastProgressDetails.deltaX !== details.deltaX ||
				this.lastProgressDetails.deltaY !== details.deltaY ||
				this.lastProgressDetails.direction !== details.direction);

		if (!progressChanged && !detailsChanged) return;

		this.swipeProgress = nextProgress;
		this.lastProgressDetails = details ?? null;
		this.#opts.onProgress?.(nextProgress, details);
	}

	recordDragSample(offset: { x: number; y: number }, timeStamp: number | null) {
		if (timeStamp === null) return;
		const lastSample = this.lastDragSample;
		if (lastSample && timeStamp > lastSample.time) {
			const durationMs = Math.max(
				timeStamp - lastSample.time,
				MIN_RELEASE_VELOCITY_DURATION_MS
			);
			this.lastDragVelocity = {
				x: (offset.x - lastSample.x) / durationMs,
				y: (offset.y - lastSample.y) / durationMs,
			};
		}
		this.lastDragSample = { x: offset.x, y: offset.y, time: timeStamp };
	}

	reset() {
		this.swipeDirection = undefined;
		this.swiping = false;
		this.isRealSwipe = false;
		this.dragDismissed = false;
		this.lockedDirection = null;
		this.updateSwipeProgress(0);
		this.swipeThresholdValue = DEFAULT_SWIPE_THRESHOLD;
		this.dragStartPos = { x: 0, y: 0 };
		this.dragOffset = { x: 0, y: 0 };
		this.initialTransform = { x: 0, y: 0, scale: 1 };
		this.intendedSwipeDirection = undefined;
		this.maxSwipeDisplacement = 0;
		this.cancelledSwipe = false;
		this.swipeCancelBaseline = { x: 0, y: 0 };
		this.isFirstPointerMove = false;
		this.lastMovePos = null;
		this.pendingSwipe = false;
		this.pendingSwipeStartPos = null;
		this.pendingTouchIntent = false;
		this.swipeFromScrollable = false;
		this.sawPrimaryButtonsOnMove = false;
		this.elementSize = { width: 0, height: 0 };
		this.swipeStartTime = null;
		this.lastDragSample = null;
		this.lastDragVelocity = { x: 0, y: 0 };
		this.lastProgressDetails = null;
	}

	getPrimaryPosition(event: PointerEvent | TouchEvent) {
		if (event instanceof TouchEvent) {
			const touch = event.touches[0] ?? event.changedTouches[0];
			return touch ? { x: touch.clientX, y: touch.clientY } : null;
		}

		return { x: event.clientX, y: event.clientY };
	}

	isTouchLikeEvent(event: PointerEvent | TouchEvent) {
		return event instanceof TouchEvent || event.pointerType === "touch";
	}

	getTargetAtPoint(position: { x: number; y: number }, nativeEvent: Event) {
		const element = this.element;
		const doc = element?.ownerDocument ?? document;
		return (getElementAtPoint(doc, position.x, position.y) ??
			getTarget(nativeEvent)) as HTMLElement | null;
	}

	findGestureScrollableTouchTarget(target: EventTarget | null, root: HTMLElement) {
		if (this.hasHorizontal && !this.hasVertical) {
			return findScrollableTouchTarget(target, root, "horizontal");
		}

		if (this.hasVertical && !this.hasHorizontal) {
			return findScrollableTouchTarget(target, root, "vertical");
		}

		return (
			findScrollableTouchTarget(target, root, "vertical") ??
			findScrollableTouchTarget(target, root, "horizontal")
		);
	}

	startSwipeAtPosition(
		event: PointerEvent | TouchEvent,
		position: { x: number; y: number },
		startOptions?: {
			ignoreScrollableTarget?: boolean;
			ignoreScrollableAncestors?: boolean;
		}
	) {
		this.swipeFromScrollable = false;
		const touchLike = this.isTouchLikeEvent(event);
		const target = this.getTargetAtPoint(position, event);
		const element = this.element;
		if (!element) return false;

		const body = element.ownerDocument.body;
		const scrollableTarget =
			touchLike && body ? this.findGestureScrollableTouchTarget(target, body) : null;
		const ignoreScrollableTarget = startOptions?.ignoreScrollableTarget ?? false;
		if (scrollableTarget && !ignoreScrollableTarget) {
			return false;
		}
		this.swipeFromScrollable = Boolean(scrollableTarget && ignoreScrollableTarget);

		const isInteractiveElement = target ? target.closest(this.ignoreSelector) : false;
		if (isInteractiveElement && (!touchLike || this.#opts.ignoreSelectorWhenTouch !== false)) {
			return false;
		}

		if (this.#opts.ignoreScrollableAncestors && target && this.scrollAxes.length > 0) {
			const ignoreAncestors = startOptions?.ignoreScrollableAncestors ?? false;
			if (!ignoreAncestors && hasScrollableAncestor(target, element, this.scrollAxes)) {
				return false;
			}
		}

		this.cancelledSwipe = false;
		this.intendedSwipeDirection = undefined;
		this.maxSwipeDisplacement = 0;
		this.dragStartPos = position;
		this.swipeStartTime = getValidTimeStamp(event.timeStamp);
		this.swipeCancelBaseline = position;
		this.lastMovePos = position;
		this.elementSize = { width: element.offsetWidth, height: element.offsetHeight };
		this.resolveSwipeThreshold(this.primaryDirection);
		const transform = getElementTransform(element);
		this.initialTransform = transform;
		this.dragOffset = { x: transform.x, y: transform.y };
		this.recordDragSample({ x: transform.x, y: transform.y }, this.swipeStartTime);

		if (event instanceof PointerEvent) {
			safelyChangePointerCapture(element, event.pointerId, "setPointerCapture");
		}

		this.#opts.onSwipeStart?.(event);
		this.setSwiping(true);
		this.isRealSwipe = false;
		this.lockedDirection = null;
		this.isFirstPointerMove = true;
		this.updateSwipeProgress(0);
		return true;
	}

	setSwiping(nextSwiping: boolean) {
		if (this.swiping === nextSwiping) return;
		this.swiping = nextSwiping;
		this.#opts.onSwipingChange?.(nextSwiping);
	}

	cancelSwipeInteraction(event: PointerEvent) {
		this.resetPendingSwipeState();
		if (!this.swiping) return;
		this.setSwiping(false);
		this.isRealSwipe = false;
		this.lockedDirection = null;
		this.dragOffset = { x: this.initialTransform.x, y: this.initialTransform.y };
		this.swipeDirection = undefined;
		this.sawPrimaryButtonsOnMove = false;
		const element = this.element;
		if (element) {
			safelyChangePointerCapture(element, event.pointerId, "releasePointerCapture");
		}
		this.updateSwipeProgress(0, {
			deltaX: 0,
			deltaY: 0,
			direction: undefined,
		});
	}

	applyDirectionalDamping(deltaX: number, deltaY: number) {
		const exponent = (value: number) => (value >= 0 ? value ** 0.5 : -(Math.abs(value) ** 0.5));
		const dampAxis = (delta: number, allowNegative: boolean, allowPositive: boolean) => {
			if (!allowNegative && delta < 0) return exponent(delta);
			if (!allowPositive && delta > 0) return exponent(delta);
			return delta;
		};

		const newDeltaX = this.hasHorizontal
			? dampAxis(deltaX, this.allowLeft, this.allowRight)
			: exponent(deltaX);
		const newDeltaY = this.hasVertical
			? dampAxis(deltaY, this.allowUp, this.allowDown)
			: exponent(deltaY);

		return { x: newDeltaX, y: newDeltaY };
	}

	canSwipeFromScrollEdgeOnPendingMove(scrollTarget: HTMLElement, deltaX: number, deltaY: number) {
		const absDeltaX = Math.abs(deltaX);
		const absDeltaY = Math.abs(deltaY);
		const useVerticalAxis =
			this.hasVertical && deltaY !== 0 && (!this.hasHorizontal || absDeltaY >= absDeltaX);

		if (useVerticalAxis) {
			const maxScrollTop = Math.max(0, scrollTarget.scrollHeight - scrollTarget.clientHeight);
			const atTop = scrollTarget.scrollTop <= 0;
			const atBottom = scrollTarget.scrollTop >= maxScrollTop;
			const movingDown = deltaY > 0;
			const movingUp = deltaY < 0;
			const canSwipeDown = movingDown && atTop && this.allowDown;
			const canSwipeUp = movingUp && atBottom && this.allowUp;
			return canSwipeDown || canSwipeUp;
		}

		const useHorizontalAxis =
			this.hasHorizontal && deltaX !== 0 && (!this.hasVertical || absDeltaX > absDeltaY);
		if (useHorizontalAxis) {
			const maxScrollLeft = Math.max(0, scrollTarget.scrollWidth - scrollTarget.clientWidth);
			const atLeft = scrollTarget.scrollLeft <= 0;
			const atRight = scrollTarget.scrollLeft >= maxScrollLeft;
			const movingRight = deltaX > 0;
			const movingLeft = deltaX < 0;
			const canSwipeRight = movingRight && atLeft && this.allowRight;
			const canSwipeLeft = movingLeft && atRight && this.allowLeft;
			return canSwipeRight || canSwipeLeft;
		}

		return null;
	}

	handleStart(event: PointerEvent | TouchEvent) {
		if (
			!this.enabled ||
			event.defaultPrevented ||
			(event instanceof PointerEvent && event.button !== 0)
		) {
			return;
		}

		const startPos = this.getPrimaryPosition(event);
		if (!startPos) return;

		this.pendingSwipe = true;
		this.pendingSwipeStartPos = startPos;
		this.pendingTouchIntent = false;
		this.swipeFromScrollable = false;
		this.sawPrimaryButtonsOnMove = false;
		const touchLike = this.isTouchLikeEvent(event);

		const allowedToStart = this.#opts.canStart
			? this.#opts.canStart(startPos, {
					nativeEvent: event,
					direction: this.primaryDirection,
				})
			: true;
		if (!allowedToStart || touchLike) return;

		const started = this.startSwipeAtPosition(event, startPos);
		if (started) {
			this.clearPendingSwipeStartState();
		}
	}

	handleMoveCore(
		event: PointerEvent | TouchEvent,
		position: { x: number; y: number },
		movement: { x: number; y: number }
	) {
		if (!this.enabled || !this.swiping) return;
		const target = getTarget(event);
		if (this.isTouchLikeEvent(event) && !this.swipeFromScrollable) {
			const boundaryElement = this.element;
			if (boundaryElement && this.findGestureScrollableTouchTarget(target, boundaryElement)) {
				return;
			}
		}

		if (event instanceof PointerEvent) {
			event.preventDefault();
		}

		if (this.isFirstPointerMove) {
			this.dragStartPos = position;
			const moveTime = getValidTimeStamp(event.timeStamp);
			if (moveTime !== null) {
				this.swipeStartTime = moveTime;
			}
			this.isFirstPointerMove = false;
		}

		const clientX = position.x;
		const clientY = position.y;
		const movementX = movement.x;
		const movementY = movement.y;

		if (
			(movementY < 0 && clientY > this.swipeCancelBaseline.y) ||
			(movementY > 0 && clientY < this.swipeCancelBaseline.y)
		) {
			this.swipeCancelBaseline = { x: this.swipeCancelBaseline.x, y: clientY };
		}
		if (
			(movementX < 0 && clientX > this.swipeCancelBaseline.x) ||
			(movementX > 0 && clientX < this.swipeCancelBaseline.x)
		) {
			this.swipeCancelBaseline = { x: clientX, y: this.swipeCancelBaseline.y };
		}

		const deltaX = clientX - this.dragStartPos.x;
		const deltaY = clientY - this.dragStartPos.y;
		const cancelDeltaX = clientX - this.swipeCancelBaseline.x;
		const cancelDeltaY = clientY - this.swipeCancelBaseline.y;

		if (!this.isRealSwipe) {
			const movementDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
			if (movementDistance >= MIN_DRAG_THRESHOLD) {
				this.isRealSwipe = true;
				if (this.lockedDirection === null && this.hasHorizontal && this.hasVertical) {
					const absX = Math.abs(deltaX);
					const absY = Math.abs(deltaY);
					this.lockedDirection = absX > absY ? "horizontal" : "vertical";
				}
			}
		}

		let candidate: SwipeDirection | undefined;
		if (!this.intendedSwipeDirection) {
			if (this.lockedDirection === "vertical") {
				if (deltaY > 0) candidate = "down";
				else if (deltaY < 0) candidate = "up";
			} else if (this.lockedDirection === "horizontal") {
				if (deltaX > 0) candidate = "right";
				else if (deltaX < 0) candidate = "left";
			} else if (Math.abs(deltaX) >= Math.abs(deltaY)) {
				candidate = deltaX > 0 ? "right" : "left";
			} else {
				candidate = deltaY > 0 ? "down" : "up";
			}

			if (candidate) {
				const isAllowed =
					(candidate === "left" && this.allowLeft) ||
					(candidate === "right" && this.allowRight) ||
					(candidate === "up" && this.allowUp) ||
					(candidate === "down" && this.allowDown);
				if (isAllowed) {
					this.intendedSwipeDirection = candidate;
					this.maxSwipeDisplacement = getDisplacement(candidate, deltaX, deltaY);
					this.swipeDirection = candidate;
					this.resolveSwipeThreshold(candidate);
				}
			}
		} else {
			const direction = this.intendedSwipeDirection;
			const currentDisplacement = getDisplacement(direction, cancelDeltaX, cancelDeltaY);
			if (currentDisplacement > this.swipeThresholdValue) {
				this.cancelledSwipe = false;
				this.swipeDirection = direction;
			} else if (
				!(this.allowLeft && this.allowRight) &&
				!(this.allowUp && this.allowDown) &&
				this.maxSwipeDisplacement - currentDisplacement >= REVERSE_CANCEL_THRESHOLD
			) {
				this.cancelledSwipe = true;
			}
		}

		const dampedDelta = this.applyDirectionalDamping(deltaX, deltaY);
		let newOffsetX = this.initialTransform.x;
		let newOffsetY = this.initialTransform.y;

		if (this.lockedDirection === "horizontal") {
			if (this.hasHorizontal) newOffsetX += dampedDelta.x;
		} else if (this.lockedDirection === "vertical") {
			if (this.hasVertical) newOffsetY += dampedDelta.y;
		} else {
			if (this.hasHorizontal) newOffsetX += dampedDelta.x;
			if (this.hasVertical) newOffsetY += dampedDelta.y;
		}

		this.dragOffset = { x: newOffsetX, y: newOffsetY };
		this.recordDragSample({ x: newOffsetX, y: newOffsetY }, getValidTimeStamp(event.timeStamp));
		const dragDeltaX = newOffsetX - this.initialTransform.x;
		const dragDeltaY = newOffsetY - this.initialTransform.y;
		const swipeDirectionDetails = this.intendedSwipeDirection;
		const progressDirection = this.primaryDirection ?? this.intendedSwipeDirection;
		if (!progressDirection) {
			this.updateSwipeProgress(0, {
				deltaX: dragDeltaX,
				deltaY: dragDeltaY,
				direction: swipeDirectionDetails,
			});
			return;
		}

		const size =
			progressDirection === "left" || progressDirection === "right"
				? this.elementSize.width
				: this.elementSize.height;
		const scale = this.initialTransform.scale || 1;
		if (size <= 0 || scale <= 0) {
			this.updateSwipeProgress(0, {
				deltaX: dragDeltaX,
				deltaY: dragDeltaY,
				direction: swipeDirectionDetails,
			});
			return;
		}

		const progressDisplacement = getDisplacement(
			progressDirection,
			newOffsetX - this.initialTransform.x,
			newOffsetY - this.initialTransform.y
		);
		if (progressDisplacement <= 0) {
			this.updateSwipeProgress(0, {
				deltaX: dragDeltaX,
				deltaY: dragDeltaY,
				direction: swipeDirectionDetails,
			});
			return;
		}

		this.updateSwipeProgress(progressDisplacement / (size * scale), {
			deltaX: dragDeltaX,
			deltaY: dragDeltaY,
			direction: swipeDirectionDetails,
		});
	}

	handleMove(event: PointerEvent | TouchEvent) {
		const currentPos = this.getPrimaryPosition(event);
		if (!currentPos) return;

		if (event instanceof PointerEvent) {
			const hasPrimaryButton = hasPrimaryMouseButton(event.buttons);
			if (hasPrimaryButton) {
				this.sawPrimaryButtonsOnMove = true;
			}
			const lostPrimaryButtonDuringSwipe =
				event.buttons === 0 && this.sawPrimaryButtonsOnMove;
			if ((event.buttons !== 0 && !hasPrimaryButton) || lostPrimaryButtonDuringSwipe) {
				this.cancelSwipeInteraction(event);
				return;
			}
		}

		if (!this.swiping && this.pendingSwipe) {
			const allowedToStart = this.#opts.canStart
				? this.#opts.canStart(currentPos, {
						nativeEvent: event,
						direction: this.primaryDirection,
					})
				: true;
			const touchLike = this.isTouchLikeEvent(event);
			const pendingTouchIntent = touchLike
				? this.resolvePendingTouchIntent(currentPos, event, allowedToStart)
				: { confirmed: false, direction: null, movementDistance: 0 };

			if (!allowedToStart) return;
			if (touchLike && !pendingTouchIntent.confirmed) return;

			const pendingStartPos = this.pendingSwipeStartPos;
			let ignoreScrollableOnStart = false;

			if (touchLike) {
				const element = this.element;
				if (pendingStartPos && element) {
					const target = this.getTargetAtPoint(currentPos, event);
					const body = element.ownerDocument.body;
					const scrollTarget = body
						? this.findGestureScrollableTouchTarget(target, body)
						: null;

					if (
						scrollTarget &&
						(contains(element, scrollTarget) || contains(scrollTarget, element))
					) {
						const deltaX = currentPos.x - pendingStartPos.x;
						const deltaY = currentPos.y - pendingStartPos.y;
						const canSwipeFromEdge = this.canSwipeFromScrollEdgeOnPendingMove(
							scrollTarget,
							deltaX,
							deltaY
						);

						if (canSwipeFromEdge === false) {
							this.pendingTouchIntent = false;
							return;
						}
						if (canSwipeFromEdge === true) ignoreScrollableOnStart = true;
					}
				}
			}

			const started = this.startSwipeAtPosition(event, currentPos, {
				ignoreScrollableTarget: ignoreScrollableOnStart,
				ignoreScrollableAncestors: ignoreScrollableOnStart,
			});

			if (started) {
				if (pendingStartPos && ignoreScrollableOnStart) {
					this.clearPendingSwipeStartState();
					this.dragStartPos = pendingStartPos;
					this.swipeCancelBaseline = pendingStartPos;
					this.lastMovePos = pendingStartPos;
					this.isFirstPointerMove = false;
				} else {
					this.clearPendingSwipeStartState();
					this.swipeFromScrollable = false;
				}
			} else {
				this.pendingTouchIntent = false;
			}
		}

		const previousPos = this.lastMovePos;
		const movement =
			previousPos === null
				? { x: 0, y: 0 }
				: { x: currentPos.x - previousPos.x, y: currentPos.y - previousPos.y };

		this.lastMovePos = currentPos;
		this.handleMoveCore(event, currentPos, movement);
	}

	handleEnd(event: PointerEvent | TouchEvent) {
		if (!this.enabled) return;
		const resolvedDragOffset = this.dragOffset;
		const resolvedInitialTransform = this.initialTransform;
		const releaseDeltaX = resolvedDragOffset.x - resolvedInitialTransform.x;
		const releaseDeltaY = resolvedDragOffset.y - resolvedInitialTransform.y;
		const progressDetails: SwipeProgressDetails = {
			deltaX: releaseDeltaX,
			deltaY: releaseDeltaY,
			direction: this.swipeDirection ?? this.intendedSwipeDirection,
		};

		if (!this.swiping) {
			this.resetPendingSwipeState();
			this.updateSwipeProgress(0, progressDetails);
			return;
		}

		this.setSwiping(false);
		this.isRealSwipe = false;
		this.lockedDirection = null;
		this.resetPendingSwipeState();
		this.sawPrimaryButtonsOnMove = false;

		const element = this.element;
		if (element && event instanceof PointerEvent) {
			safelyChangePointerCapture(element, event.pointerId, "releasePointerCapture");
		}

		const deltaX = releaseDeltaX;
		const deltaY = releaseDeltaY;
		const startTime = this.swipeStartTime;
		const endTime = getValidTimeStamp(event.timeStamp);
		const durationMs =
			startTime !== null && endTime !== null && endTime > startTime ? endTime - startTime : 0;
		const velocityDurationMs =
			durationMs > 0 ? Math.max(durationMs, MIN_VELOCITY_DURATION_MS) : 0;
		const velocityX = velocityDurationMs > 0 ? deltaX / velocityDurationMs : 0;
		const velocityY = velocityDurationMs > 0 ? deltaY / velocityDurationMs : 0;
		let releaseVelocityX = this.lastDragVelocity.x;
		let releaseVelocityY = this.lastDragVelocity.y;
		const lastSample = this.lastDragSample;
		if (lastSample && endTime !== null && endTime >= lastSample.time) {
			const ageMs = endTime - lastSample.time;
			if (ageMs <= MAX_RELEASE_VELOCITY_AGE_MS) {
				const sampleDurationMs = Math.max(ageMs, MIN_RELEASE_VELOCITY_DURATION_MS);
				const deltaFromLastSampleX = resolvedDragOffset.x - lastSample.x;
				const deltaFromLastSampleY = resolvedDragOffset.y - lastSample.y;
				const sampleVelocityX = deltaFromLastSampleX / sampleDurationMs;
				const sampleVelocityY = deltaFromLastSampleY / sampleDurationMs;
				if (sampleVelocityX !== 0) releaseVelocityX = sampleVelocityX;
				if (sampleVelocityY !== 0) releaseVelocityY = sampleVelocityY;
			} else {
				releaseVelocityX = 0;
				releaseVelocityY = 0;
			}
		}

		const releaseDecision = this.#opts.onRelease?.({
			event,
			direction: this.swipeDirection ?? this.intendedSwipeDirection,
			deltaX,
			deltaY,
			velocityX,
			velocityY,
			releaseVelocityX,
			releaseVelocityY,
		});
		const hasReleaseDecision = typeof releaseDecision === "boolean";

		if (this.cancelledSwipe && !hasReleaseDecision) {
			this.dragOffset = { x: resolvedInitialTransform.x, y: resolvedInitialTransform.y };
			this.swipeDirection = undefined;
			this.updateSwipeProgress(0, progressDetails);
			return;
		}

		let shouldClose = false;
		let dismissDirection: SwipeDirection | undefined;

		if (hasReleaseDecision) {
			shouldClose = releaseDecision;
			dismissDirection =
				this.swipeDirection ?? this.intendedSwipeDirection ?? this.primaryDirection;
		} else {
			for (const direction of this.directions) {
				switch (direction) {
					case "right":
						if (deltaX > this.swipeThresholdValue) {
							shouldClose = true;
							dismissDirection = "right";
						}
						break;
					case "left":
						if (deltaX < -this.swipeThresholdValue) {
							shouldClose = true;
							dismissDirection = "left";
						}
						break;
					case "down":
						if (deltaY > this.swipeThresholdValue) {
							shouldClose = true;
							dismissDirection = "down";
						}
						break;
					case "up":
						if (deltaY < -this.swipeThresholdValue) {
							shouldClose = true;
							dismissDirection = "up";
						}
						break;
				}
				if (shouldClose) break;
			}
		}

		if (shouldClose && dismissDirection) {
			this.swipeDirection = dismissDirection;
			this.dragDismissed = true;
			this.#opts.onDismiss?.(event, { direction: dismissDirection });
		} else {
			this.dragOffset = { x: resolvedInitialTransform.x, y: resolvedInitialTransform.y };
			this.swipeDirection = undefined;
			this.updateSwipeProgress(0, progressDetails);
		}
	}

	clearPendingSwipeStartState() {
		this.pendingSwipe = false;
		this.pendingSwipeStartPos = null;
		this.pendingTouchIntent = false;
	}

	resetPendingSwipeState() {
		this.clearPendingSwipeStartState();
		this.swipeFromScrollable = false;
		this.lastMovePos = null;
	}

	onpointerdown(event: PointerEvent) {
		this.handleStart(event);
	}

	onpointermove(event: PointerEvent) {
		this.handleMove(event);
	}

	onpointerup(event: PointerEvent) {
		this.handleEnd(event);
	}

	onpointercancel(event: PointerEvent) {
		this.handleEnd(event);
	}

	ontouchstart(event: TouchEvent) {
		this.handleStart(event);
	}

	ontouchmove(event: TouchEvent) {
		this.handleMove(event);
	}

	ontouchend(event: TouchEvent) {
		this.handleEnd(event);
	}

	ontouchcancel(event: TouchEvent) {
		this.handleEnd(event);
	}
}
