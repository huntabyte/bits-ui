import { type Getter, getDocument } from "svelte-toolbelt";
import { on } from "svelte/events";
import { watch } from "runed";
import { isElement } from "./is.js";
import type { Side } from "$lib/bits/utilities/floating-layer/use-floating-layer.svelte.js";

type Point = [number, number];

function isPointInPolygon(point: Point, polygon: Point[]): boolean {
	const [x, y] = point;
	let isInside = false;
	const length = polygon.length;
	for (let i = 0, j = length - 1; i < length; j = i++) {
		const [xi, yi] = polygon[i] ?? [0, 0];
		const [xj, yj] = polygon[j] ?? [0, 0];
		const intersect = yi >= y !== yj >= y && x <= ((xj - xi) * (y - yi)) / (yj - yi) + xi;
		if (intersect) {
			isInside = !isInside;
		}
	}
	return isInside;
}

function isInsideRect(point: Point, rect: DOMRect): boolean {
	return (
		point[0] >= rect.left &&
		point[0] <= rect.right &&
		point[1] >= rect.top &&
		point[1] <= rect.bottom
	);
}

function getSide(triggerRect: DOMRect, contentRect: DOMRect): Side {
	// determine which side the content is on relative to trigger
	const triggerCenterX = triggerRect.left + triggerRect.width / 2;
	const triggerCenterY = triggerRect.top + triggerRect.height / 2;
	const contentCenterX = contentRect.left + contentRect.width / 2;
	const contentCenterY = contentRect.top + contentRect.height / 2;

	const deltaX = contentCenterX - triggerCenterX;
	const deltaY = contentCenterY - triggerCenterY;

	if (Math.abs(deltaX) > Math.abs(deltaY)) {
		return deltaX > 0 ? "right" : "left";
	}
	return deltaY > 0 ? "bottom" : "top";
}

export interface SafePolygonOptions {
	enabled: Getter<boolean>;
	triggerNode: Getter<HTMLElement | null>;
	contentNode: Getter<HTMLElement | null>;
	onPointerExit: () => void;
	buffer?: number;
	/** nodes that should not trigger a close when they become the relatedTarget on trigger leave (e.g. sibling triggers in singleton mode) */
	ignoredTargets?: Getter<HTMLElement[]>;
}

/**
 * Creates a safe polygon area that allows users to move their cursor between
 * the trigger and floating content without closing it.
 */
export class SafePolygon {
	readonly #opts: SafePolygonOptions;
	readonly #buffer: number;

	// tracks the cursor position when leaving trigger or content
	#exitPoint: Point | null = null;
	// tracks what we're moving toward: "content" when leaving trigger, "trigger" when leaving content
	#exitTarget: "trigger" | "content" | null = null;
	#leaveFallbackRafId: number | null = null;

	#cancelLeaveFallback() {
		if (this.#leaveFallbackRafId !== null) {
			cancelAnimationFrame(this.#leaveFallbackRafId);
			this.#leaveFallbackRafId = null;
		}
	}

	#scheduleLeaveFallback() {
		this.#cancelLeaveFallback();
		this.#leaveFallbackRafId = requestAnimationFrame(() => {
			this.#leaveFallbackRafId = null;
			if (!this.#exitPoint || !this.#exitTarget) return;
			this.#clearTracking();
			this.#opts.onPointerExit();
		});
	}

	constructor(opts: SafePolygonOptions) {
		this.#opts = opts;
		this.#buffer = opts.buffer ?? 1;

		watch(
			[opts.triggerNode, opts.contentNode, opts.enabled],
			([triggerNode, contentNode, enabled]) => {
				if (!triggerNode || !contentNode || !enabled) {
					this.#clearTracking();
					return;
				}

				const doc = getDocument(triggerNode);

				const handlePointerMove = (e: PointerEvent) => {
					this.#onPointerMove([e.clientX, e.clientY], triggerNode, contentNode);
				};

				const handleTriggerLeave = (e: PointerEvent) => {
					// when leaving trigger toward content, record exit point
					const target = e.relatedTarget;
					// if going directly to content, no need for polygon tracking
					if (isElement(target) && contentNode.contains(target)) {
						return;
					}
					// if moving to an ignored target (e.g. a sibling trigger), don't close —
					// the sibling's enter handler will take over
					const ignoredTargets = this.#opts.ignoredTargets?.() ?? [];
					if (
						isElement(target) &&
						ignoredTargets.some((n) => n === target || n.contains(target))
					) {
						return;
					}
					// if relatedTarget is completely unrelated to the floating tree
					// (not an ancestor of content, not inside content/trigger), close now
					if (
						isElement(target) &&
						!triggerNode.contains(target) &&
						!contentNode.contains(target) &&
						!target.contains(contentNode)
					) {
						this.#clearTracking();
						this.#opts.onPointerExit();
						return;
					}
					this.#exitPoint = [e.clientX, e.clientY];
					this.#exitTarget = "content";
					this.#scheduleLeaveFallback();
				};

				const handleTriggerEnter = () => {
					// reached trigger, clear tracking
					this.#clearTracking();
				};

				const handleContentEnter = () => {
					// reached content, clear tracking
					this.#clearTracking();
				};

				const handleContentLeave = (e: PointerEvent) => {
					// when leaving content, check if going directly back to trigger
					const target = e.relatedTarget;
					if (isElement(target) && triggerNode.contains(target)) {
						// going directly to trigger, no polygon tracking needed
						return;
					}
					// set up polygon tracking toward trigger — pointermove decides whether to close
					this.#exitPoint = [e.clientX, e.clientY];
					this.#exitTarget = "trigger";
					this.#scheduleLeaveFallback();
				};

				return [
					on(doc, "pointermove", handlePointerMove),
					on(triggerNode, "pointerleave", handleTriggerLeave),
					on(triggerNode, "pointerenter", handleTriggerEnter),
					on(contentNode, "pointerenter", handleContentEnter),
					on(contentNode, "pointerleave", handleContentLeave),
				].reduce(
					(acc, cleanup) => () => {
						acc();
						cleanup();
					},
					() => {}
				);
			}
		);
	}

	#onPointerMove(clientPoint: Point, triggerNode: HTMLElement, contentNode: HTMLElement): void {
		// if no exit point recorded, nothing to check
		if (!this.#exitPoint || !this.#exitTarget) return;
		this.#cancelLeaveFallback();

		const triggerRect = triggerNode.getBoundingClientRect();
		const contentRect = contentNode.getBoundingClientRect();

		// check if pointer reached the target
		if (this.#exitTarget === "content" && isInsideRect(clientPoint, contentRect)) {
			this.#clearTracking();
			return;
		}
		if (this.#exitTarget === "trigger" && isInsideRect(clientPoint, triggerRect)) {
			this.#clearTracking();
			return;
		}

		// check if pointer is in the rectangular corridor between trigger and content
		const side = getSide(triggerRect, contentRect);
		const corridorPoly = this.#getCorridorPolygon(triggerRect, contentRect, side);
		if (corridorPoly && isPointInPolygon(clientPoint, corridorPoly)) {
			return;
		}

		// check if pointer is within the safe polygon from exit point to target
		const targetRect = this.#exitTarget === "content" ? contentRect : triggerRect;
		const safePoly = this.#getSafePolygon(this.#exitPoint, targetRect, side, this.#exitTarget);
		if (isPointInPolygon(clientPoint, safePoly)) {
			return;
		}

		// pointer is outside all safe zones - close
		this.#clearTracking();
		this.#opts.onPointerExit();
	}

	#clearTracking() {
		this.#exitPoint = null;
		this.#exitTarget = null;
		this.#cancelLeaveFallback();
	}

	/**
	 * Creates a rectangular corridor between trigger and content
	 * This prevents closing when cursor is in the gap between them
	 */
	#getCorridorPolygon(triggerRect: DOMRect, contentRect: DOMRect, side: Side): Point[] | null {
		const buffer = this.#buffer;

		switch (side) {
			case "top":
				return [
					[Math.min(triggerRect.left, contentRect.left) - buffer, triggerRect.top],
					[Math.min(triggerRect.left, contentRect.left) - buffer, contentRect.bottom],
					[Math.max(triggerRect.right, contentRect.right) + buffer, contentRect.bottom],
					[Math.max(triggerRect.right, contentRect.right) + buffer, triggerRect.top],
				];
			case "bottom":
				return [
					[Math.min(triggerRect.left, contentRect.left) - buffer, triggerRect.bottom],
					[Math.min(triggerRect.left, contentRect.left) - buffer, contentRect.top],
					[Math.max(triggerRect.right, contentRect.right) + buffer, contentRect.top],
					[Math.max(triggerRect.right, contentRect.right) + buffer, triggerRect.bottom],
				];
			case "left":
				return [
					[triggerRect.left, Math.min(triggerRect.top, contentRect.top) - buffer],
					[contentRect.right, Math.min(triggerRect.top, contentRect.top) - buffer],
					[contentRect.right, Math.max(triggerRect.bottom, contentRect.bottom) + buffer],
					[triggerRect.left, Math.max(triggerRect.bottom, contentRect.bottom) + buffer],
				];
			case "right":
				return [
					[triggerRect.right, Math.min(triggerRect.top, contentRect.top) - buffer],
					[contentRect.left, Math.min(triggerRect.top, contentRect.top) - buffer],
					[contentRect.left, Math.max(triggerRect.bottom, contentRect.bottom) + buffer],
					[triggerRect.right, Math.max(triggerRect.bottom, contentRect.bottom) + buffer],
				];
		}
	}

	/**
	 * Creates a triangular/trapezoidal safe zone from the exit point to the target
	 */
	#getSafePolygon(
		exitPoint: Point,
		targetRect: DOMRect,
		side: Side,
		exitTarget: "trigger" | "content"
	): Point[] {
		const buffer = this.#buffer * 4;
		const [x, y] = exitPoint;

		// when going back to trigger, we need to flip the side
		const effectiveSide = exitTarget === "trigger" ? this.#flipSide(side) : side;

		// create polygon points from cursor to target edges
		switch (effectiveSide) {
			case "top":
				return [
					[x - buffer, y + buffer],
					[x + buffer, y + buffer],
					[targetRect.right + buffer, targetRect.bottom],
					[targetRect.right + buffer, targetRect.top],
					[targetRect.left - buffer, targetRect.top],
					[targetRect.left - buffer, targetRect.bottom],
				];
			case "bottom":
				return [
					[x - buffer, y - buffer],
					[x + buffer, y - buffer],
					[targetRect.right + buffer, targetRect.top],
					[targetRect.right + buffer, targetRect.bottom],
					[targetRect.left - buffer, targetRect.bottom],
					[targetRect.left - buffer, targetRect.top],
				];
			case "left":
				return [
					[x + buffer, y - buffer],
					[x + buffer, y + buffer],
					[targetRect.right, targetRect.bottom + buffer],
					[targetRect.left, targetRect.bottom + buffer],
					[targetRect.left, targetRect.top - buffer],
					[targetRect.right, targetRect.top - buffer],
				];
			case "right":
				return [
					[x - buffer, y - buffer],
					[x - buffer, y + buffer],
					[targetRect.left, targetRect.bottom + buffer],
					[targetRect.right, targetRect.bottom + buffer],
					[targetRect.right, targetRect.top - buffer],
					[targetRect.left, targetRect.top - buffer],
				];
		}
	}

	#flipSide(side: Side): Side {
		switch (side) {
			case "top":
				return "bottom";
			case "bottom":
				return "top";
			case "left":
				return "right";
			case "right":
				return "left";
		}
	}
}
