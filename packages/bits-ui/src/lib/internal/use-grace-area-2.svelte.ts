import { type Getter, executeCallbacks } from "svelte-toolbelt";
import { on } from "svelte/events";
import { watch } from "runed";
import { isElement, isHTMLElement } from "./is.js";
import type { Side } from "$lib/bits/utilities/floating-layer/use-floating-layer.svelte.js";
import { boxAutoReset } from "./box-auto-reset.svelte.js";

interface UseGraceAreaOpts {
	enabled: Getter<boolean>;
	triggerNode: Getter<HTMLElement | null>;
	contentNode: Getter<HTMLElement | null>;
	onPointerExit: () => void;
	setIsPointerInTransit?: (value: boolean) => void;
}

export function useGraceArea(opts: UseGraceAreaOpts) {
	let pointerGraceArea: Polygon | null = null;

	const isPointerInTransit = boxAutoReset(false, 5000);
	let graceAreaElement: SVGPolygonElement | null = null;
	let svgContainer: SVGSVGElement | null = null; // The SVG container
	$effect(() => {
		console.log("is pointer in transit", isPointerInTransit);
	});

	function handleRemoveGraceArea() {
		pointerGraceArea = null;
		isPointerInTransit.current = false;
	}

	function handleCreateGraceArea(e: PointerEvent, hoverTarget: HTMLElement) {
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(currentTarget)) return;

		const exitPoint = { x: e.clientX, y: e.clientY };
		const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());

		const targetRect = hoverTarget.getBoundingClientRect();
		const contentSide = opts.contentNode()?.getAttribute("data-side") as Side;
		const targetEdgePoints = getEdgePointsFromRect(targetRect, oppositeSide(contentSide));

		const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);

		const graceArea = getHull([...paddedExitPoints, ...targetEdgePoints]);
		pointerGraceArea = graceArea;
		isPointerInTransit.current = true;
		// *** VISUALIZATION CODE START ***
		if (graceAreaElement) {
			graceAreaElement.remove(); // Remove previous visualization
		}

		if (!svgContainer) {
			// Create the SVG container if it doesn't exist
			svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svgContainer.style.position = "absolute"; // Or relative, depending on your needs
			svgContainer.style.top = "0";
			svgContainer.style.left = "0";
			svgContainer.style.width = "100%";
			svgContainer.style.height = "100%";
			svgContainer.style.pointerEvents = "none"; // VERY important!
			document.body.appendChild(svgContainer); // Append to the body (or a more appropriate container)
		}

		graceAreaElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		const pointsString = graceArea.map((p) => `${p.x},${p.y}`).join(" ");
		graceAreaElement.setAttribute("points", pointsString);
		graceAreaElement.setAttribute("fill", "rgba(255, 0, 0, 0.3)"); // Semi-transparent red
		graceAreaElement.setAttribute("stroke", "red");
		graceAreaElement.setAttribute("stroke-width", "1");
		graceAreaElement.style.pointerEvents = "none"; // Prevent it from interfering with mouse events

		svgContainer.appendChild(graceAreaElement); // Append to the SVG container!
		// *** VISUALIZATION CODE END ***
	}

	function oppositeSide(side: Side): Side {
		switch (side) {
			case "top":
				return "bottom";
			case "bottom":
				return "top";
			case "left":
				return "right";
			case "right":
				return "left";
			default:
				throw new Error("Invalid side");
		}
	}

	function getEdgePointsFromRect(rect: DOMRect, edge: Side): Point[] {
		const { top, right, bottom, left } = rect;
		switch (edge) {
			case "top":
				return [
					{ x: left, y: top },
					{ x: right, y: top },
				];
			case "bottom":
				return [
					{ x: left, y: bottom },
					{ x: right, y: bottom },
				];
			case "left":
				return [
					{ x: left, y: top },
					{ x: left, y: bottom },
				];
			case "right":
				return [
					{ x: right, y: top },
					{ x: right, y: bottom },
				];
			default:
				return [];
		}
	}

	watch([opts.triggerNode, opts.contentNode, opts.enabled], () => {
		const triggerNode = opts.triggerNode();
		const contentNode = opts.contentNode();
		const enabled = opts.enabled();
		if (!triggerNode || !contentNode || !enabled) {
			console.log("returning because triggerNode, contentNode, or enabled is falsy");
			return;
		}
		const handleTriggerLeave = (e: PointerEvent) => {
			handleCreateGraceArea(e, contentNode);
		};

		const handleContentLeave = (e: PointerEvent) => {
			handleCreateGraceArea(e, triggerNode);
		};

		return executeCallbacks(
			on(triggerNode, "pointerleave", handleTriggerLeave),
			on(contentNode, "pointerleave", handleContentLeave)
		);
	});

	const handleTrackPointerGrace = (e: PointerEvent) => {
		if (!pointerGraceArea) return;
		const target = e.target;
		if (!isElement(target)) return;
		const pointerPosition = { x: e.clientX, y: e.clientY };
		const hasEnteredTarget =
			opts.triggerNode()?.contains(target) || opts.contentNode()?.contains(target);
		const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);

		if (hasEnteredTarget) {
			handleRemoveGraceArea();
		} else if (isPointerOutsideGraceArea) {
			handleRemoveGraceArea();
			opts.onPointerExit();
		}
	};

	watch(opts.enabled, () => {
		return on(document, "pointermove", handleTrackPointerGrace);
	});

	return {
		get isPointerInTransit() {
			return isPointerInTransit.current;
		},
	};
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
	const paddedExitPoints: Point[] = [];
	switch (exitSide) {
		case "top":
			paddedExitPoints.push(
				{ x: exitPoint.x - padding, y: exitPoint.y + padding },
				{ x: exitPoint.x + padding, y: exitPoint.y + padding }
			);
			break;
		case "bottom":
			paddedExitPoints.push(
				{ x: exitPoint.x - padding, y: exitPoint.y - padding },
				{ x: exitPoint.x + padding, y: exitPoint.y - padding }
			);
			break;
		case "left":
			paddedExitPoints.push(
				{ x: exitPoint.x + padding, y: exitPoint.y - padding },
				{ x: exitPoint.x + padding, y: exitPoint.y + padding }
			);
			break;
		case "right":
			paddedExitPoints.push(
				{ x: exitPoint.x - padding, y: exitPoint.y - padding },
				{ x: exitPoint.x - padding, y: exitPoint.y + padding }
			);
			break;
	}
	return paddedExitPoints;
}

// Determine if a point is inside of a polygon.
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
