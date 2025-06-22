import {
	type Getter,
	type WritableBox,
	executeCallbacks,
	getDocument,
	getWindow,
} from "svelte-toolbelt";
import { on } from "svelte/events";
import { watch } from "runed";
import { boxAutoReset } from "./box-auto-reset.svelte.js";
import { isElement, isHTMLElement } from "./is.js";
import type { Side } from "$lib/bits/utilities/floating-layer/use-floating-layer.svelte.js";

interface GraceAreaOptions {
	enabled: Getter<boolean>;
	triggerNode: Getter<HTMLElement | null>;
	contentNode: Getter<HTMLElement | null>;
	onPointerExit: () => void;
	setIsPointerInTransit?: (value: boolean) => void;
	transitTimeout?: number;
}

export class GraceArea {
	readonly #opts: GraceAreaOptions;
	readonly #enabled: boolean;
	readonly #isPointerInTransit: WritableBox<boolean>;
	#pointerGraceArea = $state<Polygon | null>(null);

	constructor(opts: GraceAreaOptions) {
		this.#opts = opts;
		this.#enabled = $derived(this.#opts.enabled());
		this.#isPointerInTransit = boxAutoReset(false as boolean, {
			afterMs: opts.transitTimeout ?? 300,
			onChange: (value) => {
				if (!this.#enabled) return;
				this.#opts.setIsPointerInTransit?.(value);
			},
			getWindow: () => getWindow(this.#opts.triggerNode()),
		});

		watch(
			[opts.triggerNode, opts.contentNode, opts.enabled],
			([triggerNode, contentNode, enabled]) => {
				if (!triggerNode || !contentNode || !enabled) return;
				const handleTriggerLeave = (e: PointerEvent) => {
					this.#createGraceArea(e, contentNode!);
				};

				const handleContentLeave = (e: PointerEvent) => {
					this.#createGraceArea(e, triggerNode!);
				};

				return executeCallbacks(
					on(triggerNode, "pointerleave", handleTriggerLeave),
					on(contentNode, "pointerleave", handleContentLeave)
				);
			}
		);

		watch(
			() => this.#pointerGraceArea,
			() => {
				const handleTrackPointerGrace = (e: PointerEvent) => {
					if (!this.#pointerGraceArea) return;
					const target = e.target;
					if (!isElement(target)) return;
					const pointerPosition = { x: e.clientX, y: e.clientY };
					const hasEnteredTarget =
						opts.triggerNode()?.contains(target) ||
						opts.contentNode()?.contains(target);
					const isPointerOutsideGraceArea = !isPointInPolygon(
						pointerPosition,
						this.#pointerGraceArea
					);

					if (hasEnteredTarget) {
						this.#removeGraceArea();
					} else if (isPointerOutsideGraceArea) {
						this.#removeGraceArea();
						opts.onPointerExit();
					}
				};
				const doc = getDocument(opts.triggerNode() ?? opts.contentNode());
				if (!doc) return;

				return on(doc, "pointermove", handleTrackPointerGrace);
			}
		);
	}

	#removeGraceArea() {
		this.#pointerGraceArea = null;
		this.#isPointerInTransit.current = false;
	}

	#createGraceArea(e: PointerEvent, hoverTarget: HTMLElement) {
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget)) return;
		const exitPoint = { x: e.clientX, y: e.clientY };
		const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
		const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
		const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
		const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
		this.#pointerGraceArea = graceArea;
		this.#isPointerInTransit.current = true;
	}
}

type Point = { x: number; y: number };
type Polygon = Point[];

function getExitSideFromRect(point: Point, rect: DOMRect): Side {
	const top = Math.abs(rect.top - point.y);
	const bottom = Math.abs(rect.bottom - point.y);
	const right = Math.abs(rect.right - point.x);
	const left = Math.abs(rect.left - point.x);

	switch (Math.min(top, bottom, right, left)) {
		case left:
			return "left";
		case right:
			return "right";
		case top:
			return "top";
		case bottom:
			return "bottom";
		default:
			throw new Error("unreachable");
	}
}

function getPaddedExitPoints(exitPoint: Point, exitSide: Side, padding = 5) {
	// we extend the tip of the exit point to make it easier to navigate without
	// a minor jitter triggering a pointer exit
	const tipPadding = padding * 1.5;
	switch (exitSide) {
		case "top":
			return [
				{ x: exitPoint.x - padding, y: exitPoint.y + padding },
				{ x: exitPoint.x, y: exitPoint.y - tipPadding },
				{ x: exitPoint.x + padding, y: exitPoint.y + padding },
			];
		case "bottom":
			return [
				{ x: exitPoint.x - padding, y: exitPoint.y - padding },
				{ x: exitPoint.x, y: exitPoint.y + tipPadding },
				{ x: exitPoint.x + padding, y: exitPoint.y - padding },
			];
		case "left":
			return [
				{ x: exitPoint.x + padding, y: exitPoint.y - padding },
				{ x: exitPoint.x - tipPadding, y: exitPoint.y },
				{ x: exitPoint.x + padding, y: exitPoint.y + padding },
			];
		case "right":
			return [
				{ x: exitPoint.x - padding, y: exitPoint.y - padding },
				{ x: exitPoint.x + tipPadding, y: exitPoint.y },
				{ x: exitPoint.x - padding, y: exitPoint.y + padding },
			];
	}
}

function getPointsFromRect(rect: DOMRect) {
	const { top, right, bottom, left } = rect;
	return [
		{ x: left, y: top },
		{ x: right, y: top },
		{ x: right, y: bottom },
		{ x: left, y: bottom },
	];
}

// Determine if a point is inside of a polygon.
// Based on https://github.com/substack/point-in-polygon
function isPointInPolygon(point: Point, polygon: Polygon) {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i]!.x;
		const yi = polygon[i]!.y;
		const xj = polygon[j]!.x;
		const yj = polygon[j]!.y;

		// prettier-ignore
		const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
		if (intersect) inside = !inside;
	}

	return inside;
}

// Returns a new array of points representing the convex hull of the given set of points.
// https://www.nayuki.io/page/convex-hull-algorithm
function getHull<P extends Point>(points: Readonly<Array<P>>): Array<P> {
	const newPoints: Array<P> = points.slice();
	newPoints.sort((a: Point, b: Point) => {
		if (a.x < b.x) return -1;
		else if (a.x > b.x) return +1;
		else if (a.y < b.y) return -1;
		else if (a.y > b.y) return +1;
		else return 0;
	});
	return getHullPresorted(newPoints);
}

// Returns the convex hull, assuming that each points[i] <= points[i + 1]. Runs in O(n) time.
function getHullPresorted<P extends Point>(points: Readonly<Array<P>>): Array<P> {
	if (points.length <= 1) return points.slice();

	const upperHull: Array<P> = [];
	for (let i = 0; i < points.length; i++) {
		const p = points[i]!;
		while (upperHull.length >= 2) {
			const q = upperHull[upperHull.length - 1]!;
			const r = upperHull[upperHull.length - 2]!;
			if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
			else break;
		}
		upperHull.push(p);
	}
	upperHull.pop();

	const lowerHull: Array<P> = [];
	for (let i = points.length - 1; i >= 0; i--) {
		const p = points[i]!;
		while (lowerHull.length >= 2) {
			const q = lowerHull[lowerHull.length - 1]!;
			const r = lowerHull[lowerHull.length - 2]!;
			if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
			else break;
		}
		lowerHull.push(p);
	}
	lowerHull.pop();

	if (
		upperHull.length === 1 &&
		lowerHull.length === 1 &&
		upperHull[0]!.x === lowerHull[0]!.x &&
		upperHull[0]!.y === lowerHull[0]!.y
	)
		return upperHull;
	else return upperHull.concat(lowerHull);
}
