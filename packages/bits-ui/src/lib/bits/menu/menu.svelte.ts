import {
	afterTick,
	mergeProps,
	onDestroyEffect,
	attachRef,
	DOMContext,
	getDocument,
	getWindow,
	type ReadableBoxedValues,
	type WritableBoxedValues,
	simpleBox,
	boxWith,
	type ReadableBox,
} from "svelte-toolbelt";
import { Context, watch } from "runed";
import {
	FIRST_LAST_KEYS,
	LAST_KEYS,
	SELECTION_KEYS,
	SUB_OPEN_KEYS,
	getCheckedState,
	isMouseEvent,
} from "./utils.js";
import { focusFirst } from "$lib/internal/focus.js";
import { CustomEventDispatcher } from "$lib/internal/events.js";
import type {
	AnyFn,
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	BitsPointerEvent,
	OnChangeFn,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import { isElement, isElementOrSVGElement, isHTMLElement } from "$lib/internal/is.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	createBitsAttrs,
	getAriaChecked,
	boolToStr,
	getDataOpenClosed,
	boolToEmptyStrOrUndef,
	getDataTransitionAttrs,
} from "$lib/internal/attrs.js";
import type { Direction } from "$lib/shared/index.js";
import { IsUsingKeyboard } from "$lib/bits/utilities/is-using-keyboard/is-using-keyboard.svelte.js";
import { getTabbableFrom } from "$lib/internal/tabbable.js";
import { isTabbable } from "tabbable";
import type { KeyboardEventHandler, PointerEventHandler, MouseEventHandler } from "svelte/elements";
import { DOMTypeahead } from "$lib/internal/dom-typeahead.svelte.js";
import { RovingFocusGroup } from "$lib/internal/roving-focus-group.js";
import { PresenceManager } from "$lib/internal/presence-manager.svelte.js";
import { arraysAreEqual } from "$lib/internal/arrays.js";

export const CONTEXT_MENU_TRIGGER_ATTR = "data-context-menu-trigger";
export const CONTEXT_MENU_CONTENT_ATTR = "data-context-menu-content";

const MenuRootContext = new Context<MenuRootState>("Menu.Root");
const MenuMenuContext = new Context<MenuMenuState>("Menu.Root | Menu.Sub");
const MenuContentContext = new Context<MenuContentState>("Menu.Content");
const MenuGroupContext = new Context<MenuGroupState | MenuRadioGroupState>(
	"Menu.Group | Menu.RadioGroup"
);
const MenuRadioGroupContext = new Context<MenuRadioGroupState>("Menu.RadioGroup");
export const MenuCheckboxGroupContext = new Context<MenuCheckboxGroupState>("Menu.CheckboxGroup");

type MenuVariant = "context-menu" | "dropdown-menu" | "menubar";

export interface MenuRootStateOpts
	extends ReadableBoxedValues<{
		dir: Direction;
		variant: MenuVariant;
		// debugMode: boolean;
	}> {
	onClose: AnyFn;
	/** When closing, if this returns true, exit animations are skipped (instant unmount). */
	shouldSkipExitAnimation?: () => boolean;
}

export const MenuOpenEvent = new CustomEventDispatcher("bitsmenuopen", {
	bubbles: false,
	cancelable: true,
});

export const menuAttrs = createBitsAttrs({
	component: "menu",
	parts: [
		"trigger",
		"content",
		"sub-trigger",
		"item",
		"group",
		"group-heading",
		"checkbox-group",
		"checkbox-item",
		"radio-group",
		"radio-item",
		"separator",
		"sub-content",
		"arrow",
	],
});

type PolygonSide = "top" | "bottom" | "left" | "right";
type IntentTarget = "trigger" | "content";
type Point = { x: number; y: number };
type Polygon = Point[];

// const SVG_NS = "http://www.w3.org/2000/svg";

interface MenuSubmenuIntentOptions {
	enabled: () => boolean;
	triggerNode: () => HTMLElement | null;
	contentNode: () => HTMLElement | null;
	parentContentNode: () => HTMLElement | null;
	subContentSelector: () => string;
	// debugMode: () => boolean;
	onIntentExit: (pointerPoint: Point | null) => void;
	setIsPointerInTransit: (value: boolean) => void;
}

/*
interface MenuIntentDebugSnapshot {
	active: boolean;
	target: IntentTarget | null;
	exitPoint: Point | null;
	pointerPoint: Point | null;
	corridor: Polygon | null;
	intentPolygon: Polygon | null;
}

class MenuIntentDebugOverlay {
	readonly #enabled: () => boolean;
	readonly #getDocument: () => Document | null;
	#root: HTMLDivElement | null = null;
	#corridorPolygon: SVGPolygonElement | null = null;
	#intentPolygon: SVGPolygonElement | null = null;
	#exitPoint: SVGCircleElement | null = null;
	#pointerPoint: SVGCircleElement | null = null;

	constructor(opts: { enabled: () => boolean; getDocument: () => Document | null }) {
		this.#enabled = opts.enabled;
		this.#getDocument = opts.getDocument;
	}

	update(state: MenuIntentDebugSnapshot) {
		if (!this.#enabled()) {
			this.#detach();
			return;
		}
		this.#ensureRoot();
		if (!this.#root) return;

		if (!state.active || !state.corridor || !state.intentPolygon || !state.exitPoint) {
			this.#root.style.display = "none";
			return;
		}

		const color = state.target === "trigger" ? "16 185 129" : "59 130 246";
		const strokeColor = `rgb(${color})`;
		const fillColor = `rgb(${color} / 0.18)`;
		const corridorFill = `rgb(${color} / 0.1)`;

		this.#root.style.display = "block";
		this.#setPolygon(this.#corridorPolygon, state.corridor, corridorFill, strokeColor, 1.5);
		this.#setPolygon(this.#intentPolygon, state.intentPolygon, fillColor, strokeColor, 2);
		this.#setPoint(this.#exitPoint, state.exitPoint, strokeColor, 5);
		this.#setPoint(
			this.#pointerPoint,
			state.pointerPoint,
			"rgb(15 23 42 / 0.9)",
			4,
			"rgb(255 255 255 / 0.95)"
		);
	}

	destroy() {
		this.#detach();
	}

	#setPolygon(
		node: SVGPolygonElement | null,
		points: Polygon | null,
		fill: string,
		stroke: string,
		strokeWidth: number
	) {
		if (!node || !points || points.length === 0) return;
		node.setAttribute("points", polygonToSvgPoints(points));
		node.setAttribute("fill", fill);
		node.setAttribute("stroke", stroke);
		node.setAttribute("stroke-width", `${strokeWidth}`);
		node.setAttribute("stroke-dasharray", "6 4");
	}

	#setPoint(
		node: SVGCircleElement | null,
		point: Point | null,
		fill: string,
		radius: number,
		stroke = "transparent"
	) {
		if (!node || !point) return;
		node.setAttribute("cx", `${point.x}`);
		node.setAttribute("cy", `${point.y}`);
		node.setAttribute("r", `${radius}`);
		node.setAttribute("fill", fill);
		node.setAttribute("stroke", stroke);
		node.setAttribute("stroke-width", "1.5");
	}

	#ensureRoot() {
		if (this.#root) return;
		const doc = this.#getDocument();
		if (!doc?.body) return;

		const root = doc.createElement("div");
		root.setAttribute("aria-hidden", "true");
		root.style.position = "fixed";
		root.style.inset = "0";
		root.style.pointerEvents = "none";
		root.style.zIndex = "2147483647";
		root.style.display = "none";

		const svg = doc.createElementNS(SVG_NS, "svg");
		svg.setAttribute("width", "100%");
		svg.setAttribute("height", "100%");
		svg.style.overflow = "visible";

		const corridorPolygon = doc.createElementNS(SVG_NS, "polygon");
		const intentPolygon = doc.createElementNS(SVG_NS, "polygon");
		const exitPoint = doc.createElementNS(SVG_NS, "circle");
		const pointerPoint = doc.createElementNS(SVG_NS, "circle");

		svg.append(corridorPolygon, intentPolygon, exitPoint, pointerPoint);
		root.append(svg);
		doc.body.append(root);

		this.#root = root;
		this.#corridorPolygon = corridorPolygon;
		this.#intentPolygon = intentPolygon;
		this.#exitPoint = exitPoint;
		this.#pointerPoint = pointerPoint;
	}

	#detach() {
		this.#root?.remove();
		this.#root = null;
		this.#corridorPolygon = null;
		this.#intentPolygon = null;
		this.#exitPoint = null;
		this.#pointerPoint = null;
	}
}
*/

class MenuSubmenuIntent {
	readonly #opts: MenuSubmenuIntentOptions;
	// readonly #debugOverlay: MenuIntentDebugOverlay;
	#cleanupDocMove: AnyFn | null = null;
	#fallbackTimer: ReturnType<typeof setTimeout> | null = null;
	#active = false;
	#target: IntentTarget | null = null;
	#apex: Point | null = null;
	#pointerPoint: Point | null = null;
	// #corridor: Polygon | null = null;
	// #intentPolygon: Polygon | null = null;
	#launchPoint: Point | null = null;

	constructor(opts: MenuSubmenuIntentOptions) {
		this.#opts = opts;
		// this.#debugOverlay = new MenuIntentDebugOverlay({
		// 	enabled: () => this.#opts.debugMode(),
		// 	getDocument: () => getDocument(this.#opts.triggerNode() ?? this.#opts.contentNode()),
		// });

		watch(
			[opts.triggerNode, opts.contentNode, opts.enabled],
			([triggerNode, contentNode, enabled]) => {
				this.#reset();
				if (!triggerNode || !contentNode || !enabled) return;

				const onTriggerMove = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					this.#launchPoint = { x: e.clientX, y: e.clientY };
					if (!this.#active) this.#preview(e, "content");
				};

				const onTriggerLeave = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					this.#engage(e, "content");
				};

				const onContentMove = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					if (!this.#active) this.#preview(e, "trigger");
				};

				const onContentLeave = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					if (isElement(e.relatedTarget)) {
						const selector = this.#opts.subContentSelector();
						const matchedSubContent = e.relatedTarget.closest(selector);
						if (
							matchedSubContent &&
							matchedSubContent !== contentNode &&
							matchedSubContent.id
						) {
							const isChild = !!contentNode.querySelector(
								`[aria-controls="${matchedSubContent.id}"]`
							);
							if (isChild) {
								return;
							}
						}
					}
					this.#engage(e, "trigger");
				};

				const onTriggerEnter = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					this.#disengage();
				};

				const onContentEnter = (e: PointerEvent) => {
					if (!isMouseEvent(e)) return;
					this.#disengage();
				};

				triggerNode.addEventListener("pointermove", onTriggerMove);
				triggerNode.addEventListener("pointerleave", onTriggerLeave);
				triggerNode.addEventListener("pointerenter", onTriggerEnter);
				contentNode.addEventListener("pointermove", onContentMove);
				contentNode.addEventListener("pointerleave", onContentLeave);
				contentNode.addEventListener("pointerenter", onContentEnter);

				return () => {
					triggerNode.removeEventListener("pointermove", onTriggerMove);
					triggerNode.removeEventListener("pointerleave", onTriggerLeave);
					triggerNode.removeEventListener("pointerenter", onTriggerEnter);
					contentNode.removeEventListener("pointermove", onContentMove);
					contentNode.removeEventListener("pointerleave", onContentLeave);
					contentNode.removeEventListener("pointerenter", onContentEnter);
					this.#reset();
				};
			}
		);

		onDestroyEffect(() => {
			this.#reset();
			// this.#debugOverlay.destroy();
		});
	}

	#parentTargetRect(): DOMRect | null {
		const parent = this.#opts.parentContentNode();
		if (parent) return parent.getBoundingClientRect();
		return this.#opts.triggerNode()?.getBoundingClientRect() ?? null;
	}

	#computePolygons(
		pointerPt: Point,
		target: IntentTarget
	): {
		corridor: Polygon;
		intent: Polygon;
		targetRect: DOMRect;
		side: PolygonSide;
	} | null {
		const triggerNode = this.#opts.triggerNode();
		const contentNode = this.#opts.contentNode();
		if (!triggerNode || !contentNode) return null;

		const triggerRect = triggerNode.getBoundingClientRect();
		const contentRect = contentNode.getBoundingClientRect();
		const side = getSide(triggerRect, contentRect);

		let apex: Point;
		let targetRect: DOMRect;

		let sourceRect: DOMRect | undefined;

		if (target === "content") {
			apex = this.#active ? (this.#apex ?? pointerPt) : pointerPt;
			targetRect = contentRect;
		} else {
			apex = this.#launchPoint ?? pointerPt;
			targetRect = this.#parentTargetRect() ?? triggerRect;
			sourceRect = contentRect;
		}

		this.#apex = apex;

		return {
			corridor: getCorridorPolygon(triggerRect, contentRect, side),
			intent: getIntentPolygon(apex, targetRect, side, target, sourceRect),
			targetRect,
			side,
		};
	}

	#isInSafeZone(pt: Point, corridor: Polygon, intent: Polygon): boolean {
		return isPointInPolygon(pt, corridor) || isPointInPolygon(pt, intent);
	}

	#preview(e: PointerEvent, target: IntentTarget) {
		const pt = { x: e.clientX, y: e.clientY };
		const geo = this.#computePolygons(pt, target);
		if (!geo) return;

		this.#target = target;
		this.#pointerPoint = pt;
		// this.#corridor = geo.corridor;
		// this.#intentPolygon = geo.intent;
		// this.#syncDebug();
	}

	#engage(e: PointerEvent, target: IntentTarget) {
		if (!this.#opts.enabled()) return;

		const triggerNode = this.#opts.triggerNode();
		const contentNode = this.#opts.contentNode();
		if (!triggerNode || !contentNode) return;

		const related = e.relatedTarget;
		if (isElement(related)) {
			if (target === "content" && contentNode.contains(related)) return;
			if (target === "trigger" && triggerNode.contains(related)) return;
		}

		const pt = { x: e.clientX, y: e.clientY };

		const geo = this.#computePolygons(pt, target);
		if (!geo) return;

		if (
			!isInsideRect(pt, geo.targetRect) &&
			!this.#isInSafeZone(pt, geo.corridor, geo.intent)
		) {
			this.#clearVisuals();
			return;
		}

		this.#active = true;
		this.#target = target;
		this.#pointerPoint = pt;
		// this.#corridor = geo.corridor;
		// this.#intentPolygon = geo.intent;

		this.#opts.setIsPointerInTransit(true);
		this.#attachDocMove();
		this.#startFallback();
		// this.#syncDebug();
	}

	#disengageTimer: ReturnType<typeof setTimeout> | null = null;

	#disengage() {
		if (!this.#active) return;
		const wasReturning = this.#target === "trigger";
		this.#detachDocMove();
		this.#clearFallback();
		this.#active = false;
		this.#clearVisuals();

		if (wasReturning) {
			this.#clearDisengageTimer();
			this.#disengageTimer = setTimeout(() => {
				this.#disengageTimer = null;
				this.#opts.setIsPointerInTransit(false);
			}, 100);
		} else {
			this.#opts.setIsPointerInTransit(false);
		}
	}

	#clearDisengageTimer() {
		if (this.#disengageTimer === null) return;
		clearTimeout(this.#disengageTimer);
		this.#disengageTimer = null;
	}

	#intentExit() {
		const pointerPoint = this.#pointerPoint;
		this.#detachDocMove();
		this.#clearFallback();
		this.#clearDisengageTimer();
		this.#active = false;
		this.#opts.setIsPointerInTransit(false);
		this.#clearVisuals();
		this.#opts.onIntentExit(pointerPoint);
	}

	#reset() {
		this.#detachDocMove();
		this.#clearFallback();
		this.#clearDisengageTimer();
		if (this.#active) this.#opts.setIsPointerInTransit(false);
		this.#active = false;
		this.#target = null;
		this.#apex = null;
		this.#pointerPoint = null;
		// this.#corridor = null;
		// this.#intentPolygon = null;
		this.#launchPoint = null;
		// this.#syncDebug();
	}

	#isPointerInDescendantSubContent(pt: Point): boolean {
		const contentNode = this.#opts.contentNode();
		if (!contentNode) return false;
		const doc = contentNode.ownerDocument;
		const el = doc.elementFromPoint(pt.x, pt.y);
		if (!el) return false;
		const selector = this.#opts.subContentSelector();
		const subContent = el.closest(selector);
		if (!subContent || subContent === contentNode) return false;
		if (subContent.id) return !!contentNode.querySelector(`[aria-controls="${subContent.id}"]`);
		return false;
	}

	#onDocMove = (e: PointerEvent) => {
		if (!this.#active || !this.#target) return;
		if (!isMouseEvent(e)) return;

		const triggerNode = this.#opts.triggerNode();
		const contentNode = this.#opts.contentNode();
		if (!triggerNode || !contentNode) {
			this.#intentExit();
			return;
		}

		this.#clearFallback();
		const pt = { x: e.clientX, y: e.clientY };
		this.#pointerPoint = pt;

		const triggerRect = triggerNode.getBoundingClientRect();
		const contentRect = contentNode.getBoundingClientRect();
		if (this.#target === "content" && isInsideRect(pt, contentRect)) {
			this.#disengage();
			return;
		}
		if (this.#target === "trigger" && isInsideInsetRect(pt, triggerRect, 4)) {
			this.#disengage();
			return;
		}

		if (this.#isPointerInDescendantSubContent(pt)) {
			this.#startFallback();
			return;
		}

		const geo = this.#computePolygons(pt, this.#target);
		if (!geo) {
			this.#intentExit();
			return;
		}

		// this.#corridor = geo.corridor;
		// this.#intentPolygon = geo.intent;
		// this.#syncDebug();

		if (this.#isInSafeZone(pt, geo.corridor, geo.intent)) {
			this.#startFallback();
			return;
		}

		this.#intentExit();
	};

	#attachDocMove() {
		if (this.#cleanupDocMove) return;
		const doc = getDocument(this.#opts.triggerNode() ?? this.#opts.contentNode());
		if (!doc) return;
		doc.addEventListener("pointermove", this.#onDocMove, true);
		this.#cleanupDocMove = () => {
			doc.removeEventListener("pointermove", this.#onDocMove, true);
			this.#cleanupDocMove = null;
		};
	}

	#detachDocMove() {
		this.#cleanupDocMove?.();
	}

	#startFallback() {
		this.#clearFallback();
		this.#fallbackTimer = setTimeout(() => {
			this.#fallbackTimer = null;
			if (this.#active) this.#intentExit();
		}, 500);
	}

	#clearFallback() {
		if (this.#fallbackTimer === null) return;
		clearTimeout(this.#fallbackTimer);
		this.#fallbackTimer = null;
	}

	#clearVisuals() {
		this.#target = null;
		this.#apex = null;
		this.#pointerPoint = null;
		// this.#corridor = null;
		// this.#intentPolygon = null;
		// this.#syncDebug();
	}

	/*
	#syncDebug() {
		this.#debugOverlay.update({
			active: this.#active || this.#corridor !== null,
			target: this.#target,
			exitPoint: this.#apex,
			pointerPoint: this.#pointerPoint,
			corridor: this.#corridor,
			intentPolygon: this.#intentPolygon,
		});
	}
	*/
}

/*
function polygonToSvgPoints(points: Polygon): string {
	return points.map((point) => `${point.x},${point.y}`).join(" ");
}
*/

function isPointInPolygon(point: Point, polygon: Polygon): boolean {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i]!.x;
		const yi = polygon[i]!.y;
		const xj = polygon[j]!.x;
		const yj = polygon[j]!.y;
		// prettier-ignore
		const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}
	return inside;
}

function isInsideRect(point: Point, rect: DOMRect): boolean {
	return (
		point.x >= rect.left &&
		point.x <= rect.right &&
		point.y >= rect.top &&
		point.y <= rect.bottom
	);
}

function isInsideInsetRect(point: Point, rect: DOMRect, inset: number): boolean {
	return (
		point.x >= rect.left + inset &&
		point.x <= rect.right - inset &&
		point.y >= rect.top + inset &&
		point.y <= rect.bottom - inset
	);
}

function getSide(triggerRect: DOMRect, contentRect: DOMRect): PolygonSide {
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

function getCorridorPolygon(
	triggerRect: DOMRect,
	contentRect: DOMRect,
	side: PolygonSide
): Polygon {
	const buffer = 2;
	switch (side) {
		case "top":
			return [
				{ x: Math.min(triggerRect.left, contentRect.left) - buffer, y: triggerRect.top },
				{ x: Math.min(triggerRect.left, contentRect.left) - buffer, y: contentRect.bottom },
				{
					x: Math.max(triggerRect.right, contentRect.right) + buffer,
					y: contentRect.bottom,
				},
				{ x: Math.max(triggerRect.right, contentRect.right) + buffer, y: triggerRect.top },
			];
		case "bottom":
			return [
				{ x: Math.min(triggerRect.left, contentRect.left) - buffer, y: triggerRect.bottom },
				{ x: Math.min(triggerRect.left, contentRect.left) - buffer, y: contentRect.top },
				{ x: Math.max(triggerRect.right, contentRect.right) + buffer, y: contentRect.top },
				{
					x: Math.max(triggerRect.right, contentRect.right) + buffer,
					y: triggerRect.bottom,
				},
			];
		case "left":
			return [
				{ x: triggerRect.left, y: Math.min(triggerRect.top, contentRect.top) - buffer },
				{ x: contentRect.right, y: Math.min(triggerRect.top, contentRect.top) - buffer },
				{
					x: contentRect.right,
					y: Math.max(triggerRect.bottom, contentRect.bottom) + buffer,
				},
				{
					x: triggerRect.left,
					y: Math.max(triggerRect.bottom, contentRect.bottom) + buffer,
				},
			];
		case "right":
			return [
				{ x: triggerRect.right, y: Math.min(triggerRect.top, contentRect.top) - buffer },
				{ x: contentRect.left, y: Math.min(triggerRect.top, contentRect.top) - buffer },
				{
					x: contentRect.left,
					y: Math.max(triggerRect.bottom, contentRect.bottom) + buffer,
				},
				{
					x: triggerRect.right,
					y: Math.max(triggerRect.bottom, contentRect.bottom) + buffer,
				},
			];
	}
}

function getIntentPolygon(
	exitPoint: Point,
	targetRect: DOMRect,
	side: PolygonSide,
	target: IntentTarget,
	sourceRect?: DOMRect
): Polygon {
	const edgeBuffer = 8;
	const effectiveSide = target === "trigger" ? flipSide(side) : side;

	const top = sourceRect
		? Math.min(targetRect.top, sourceRect.top) - edgeBuffer
		: targetRect.top - edgeBuffer;
	const bottom = sourceRect
		? Math.max(targetRect.bottom, sourceRect.bottom) + edgeBuffer
		: targetRect.bottom + edgeBuffer;
	const left = sourceRect
		? Math.min(targetRect.left, sourceRect.left) - edgeBuffer
		: targetRect.left - edgeBuffer;
	const right = sourceRect
		? Math.max(targetRect.right, sourceRect.right) + edgeBuffer
		: targetRect.right + edgeBuffer;

	switch (effectiveSide) {
		case "right":
			return [exitPoint, { x: targetRect.left, y: top }, { x: targetRect.left, y: bottom }];
		case "left":
			return [exitPoint, { x: targetRect.right, y: top }, { x: targetRect.right, y: bottom }];
		case "bottom":
			return [exitPoint, { x: left, y: targetRect.top }, { x: right, y: targetRect.top }];
		case "top":
			return [
				exitPoint,
				{ x: left, y: targetRect.bottom },
				{ x: right, y: targetRect.bottom },
			];
	}
}

function flipSide(side: PolygonSide): PolygonSide {
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

export class MenuRootState {
	static create(opts: MenuRootStateOpts) {
		const root = new MenuRootState(opts);
		return MenuRootContext.set(root);
	}

	readonly opts: MenuRootStateOpts;
	readonly isUsingKeyboard = new IsUsingKeyboard();
	ignoreCloseAutoFocus = $state(false);
	isPointerInTransit = $state(false);

	constructor(opts: MenuRootStateOpts) {
		this.opts = opts;
	}

	getBitsAttr: typeof menuAttrs.getAttr = (part) => {
		return menuAttrs.getAttr(part, this.opts.variant.current);
	};
}

interface MenuMenuStateOpts
	extends WritableBoxedValues<{
			open: boolean;
		}>,
		ReadableBoxedValues<{
			onOpenChangeComplete: OnChangeFn<boolean>;
		}> {}

export class MenuMenuState {
	static create(opts: MenuMenuStateOpts, root: MenuRootState) {
		return MenuMenuContext.set(new MenuMenuState(opts, root, null));
	}

	readonly opts: MenuMenuStateOpts;
	readonly root: MenuRootState;
	readonly parentMenu: MenuMenuState | null;
	contentId = boxWith<string>(() => "");
	contentNode = $state<HTMLElement | null>(null);
	contentPresence: PresenceManager;
	triggerNode = $state<HTMLElement | null>(null);

	constructor(opts: MenuMenuStateOpts, root: MenuRootState, parentMenu: MenuMenuState | null) {
		this.opts = opts;
		this.root = root;
		this.parentMenu = parentMenu;

		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
			shouldSkipExitAnimation: () => {
				if (this.root.opts.variant.current !== "menubar" || this.parentMenu !== null) {
					return false;
				}
				return this.root.opts.shouldSkipExitAnimation?.() ?? false;
			},
		});

		if (parentMenu) {
			watch(
				() => parentMenu.opts.open.current,
				() => {
					if (parentMenu.opts.open.current) return;
					this.opts.open.current = false;
				}
			);
		}
	}

	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}

	onOpen() {
		this.opts.open.current = true;
	}

	onClose() {
		this.opts.open.current = false;
	}
}

interface MenuContentStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			loop: boolean;
			onCloseAutoFocus: (event: Event) => void;
		}> {
	isSub?: boolean;
}

export class MenuContentState {
	static create(opts: MenuContentStateOpts) {
		return MenuContentContext.set(new MenuContentState(opts, MenuMenuContext.get()));
	}

	readonly opts: MenuContentStateOpts;
	readonly parentMenu: MenuMenuState;
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly domContext: DOMContext;
	readonly attachment: RefAttachment;
	search = $state("");
	#timer = 0;
	#handleTypeaheadSearch: DOMTypeahead["handleTypeaheadSearch"];
	mounted = $state(false);
	#isSub: boolean;

	constructor(opts: MenuContentStateOpts, parentMenu: MenuMenuState) {
		this.opts = opts;
		this.parentMenu = parentMenu;
		this.domContext = new DOMContext(opts.ref);
		this.attachment = attachRef(this.opts.ref, (v) => {
			if (this.parentMenu.contentNode !== v) {
				this.parentMenu.contentNode = v;
			}
		});

		parentMenu.contentId = opts.id;

		this.#isSub = opts.isSub ?? false;
		this.onkeydown = this.onkeydown.bind(this);
		this.onblur = this.onblur.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.handleInteractOutside = this.handleInteractOutside.bind(this);

		new MenuSubmenuIntent({
			contentNode: () => this.parentMenu.contentNode,
			triggerNode: () => this.parentMenu.triggerNode,
			parentContentNode: () => this.parentMenu.parentMenu?.contentNode ?? null,
			subContentSelector: () => `[${this.parentMenu.root.getBitsAttr("sub-content")}]`,
			// debugMode: () => this.parentMenu.root.opts.debugMode.current,
			enabled: () =>
				this.parentMenu.opts.open.current &&
				Boolean(
					this.parentMenu.triggerNode?.hasAttribute(
						this.parentMenu.root.getBitsAttr("sub-trigger")
					)
				),
			onIntentExit: (pointerPoint) => {
				this.parentMenu.opts.open.current = false;
				this.#dispatchPointerMoveToHoveredSubTrigger(pointerPoint);
			},
			setIsPointerInTransit: (value) => {
				this.parentMenu.root.isPointerInTransit = value;
			},
		});

		this.#handleTypeaheadSearch = new DOMTypeahead({
			getActiveElement: () => this.domContext.getActiveElement(),
			getWindow: () => this.domContext.getWindow(),
		}).handleTypeaheadSearch;
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNode: boxWith(() => this.parentMenu.contentNode),
			candidateAttr: this.parentMenu.root.getBitsAttr("item"),
			loop: this.opts.loop,
			orientation: boxWith(() => "vertical"),
		});

		watch(
			() => this.parentMenu.contentNode,
			(contentNode) => {
				if (!contentNode) return;
				const handler = () => {
					afterTick(() => {
						if (!this.parentMenu.root.isUsingKeyboard.current) return;
						this.rovingFocusGroup.focusFirstCandidate();
					});
				};
				return MenuOpenEvent.listen(contentNode, handler);
			}
		);

		$effect(() => {
			if (!this.parentMenu.opts.open.current) {
				this.domContext.getWindow().clearTimeout(this.#timer);
			}
		});
	}

	#getCandidateNodes() {
		const node = this.parentMenu.contentNode;
		if (!node) return [];
		const candidates = Array.from(
			node.querySelectorAll<HTMLElement>(
				`[${this.parentMenu.root.getBitsAttr("item")}]:not([data-disabled])`
			)
		);
		return candidates;
	}

	#isPointerMovingToSubmenu() {
		return this.parentMenu.root.isPointerInTransit;
	}

	#dispatchPointerMoveToHoveredSubTrigger(pointerPoint: Point | null) {
		if (!pointerPoint) return;
		const parentContentNode = this.parentMenu.parentMenu?.contentNode;
		if (!parentContentNode) return;
		const hoveredNode = this.domContext
			.getDocument()
			.elementFromPoint(pointerPoint.x, pointerPoint.y);
		if (!isElement(hoveredNode)) return;
		const hoveredSubTrigger = hoveredNode.closest<HTMLElement>(
			`[${this.parentMenu.root.getBitsAttr("sub-trigger")}]`
		);
		if (!hoveredSubTrigger || !parentContentNode.contains(hoveredSubTrigger)) return;
		if (hoveredSubTrigger === this.parentMenu.triggerNode) return;
		hoveredSubTrigger.dispatchEvent(
			new PointerEvent("pointermove", {
				bubbles: true,
				cancelable: true,
				pointerType: "mouse",
				clientX: pointerPoint.x,
				clientY: pointerPoint.y,
			})
		);
	}

	onCloseAutoFocus = (e: Event) => {
		this.opts.onCloseAutoFocus.current?.(e);
		if (e.defaultPrevented || this.#isSub) return;
		if (this.parentMenu.root.ignoreCloseAutoFocus) {
			e.preventDefault();
			return;
		}

		if (this.parentMenu.triggerNode && isTabbable(this.parentMenu.triggerNode)) {
			e.preventDefault();
			this.parentMenu.triggerNode.focus();
		}
	};

	handleTabKeyDown(e: BitsKeyboardEvent) {
		/**
		 * We locate the root `menu`'s trigger by going up the tree until
		 * we find a menu that has no parent. This will allow us to focus the next
		 * tabbable element before/after the root trigger.
		 */
		let rootMenu = this.parentMenu;
		while (rootMenu.parentMenu !== null) {
			rootMenu = rootMenu.parentMenu;
		}
		if (!rootMenu.triggerNode) return;
		e.preventDefault();
		const nodeToFocus = getTabbableFrom(rootMenu.triggerNode, e.shiftKey ? "prev" : "next");
		if (nodeToFocus) {
			/**
			 * We set a flag to ignore the `onCloseAutoFocus` event handler
			 * as well as the fallbacks inside the focus scope to prevent
			 * race conditions causing focus to fall back to the body even
			 * though we're trying to focus the next tabbable element.
			 */
			this.parentMenu.root.ignoreCloseAutoFocus = true;
			rootMenu.onClose();
			afterTick(() => {
				nodeToFocus.focus();
				afterTick(() => {
					this.parentMenu.root.ignoreCloseAutoFocus = false;
				});
			});
		} else {
			this.domContext.getDocument().body.focus();
		}
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.defaultPrevented) return;
		if (e.key === kbd.TAB) {
			this.handleTabKeyDown(e);
			return;
		}

		const target = e.target;
		const currentTarget = e.currentTarget;
		if (!isHTMLElement(target) || !isHTMLElement(currentTarget)) return;

		const isKeydownInside =
			target.closest(`[${this.parentMenu.root.getBitsAttr("content")}]`)?.id ===
			this.parentMenu.contentId.current;

		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;

		const kbdFocusedEl = this.rovingFocusGroup.handleKeydown(target, e);
		if (kbdFocusedEl) return;

		// prevent space from being considered with typeahead
		if (e.code === "Space") return;

		const candidateNodes = this.#getCandidateNodes();

		if (isKeydownInside) {
			if (!isModifierKey && isCharacterKey) {
				this.#handleTypeaheadSearch(e.key, candidateNodes);
			}
		}

		// focus first/last based on key pressed
		if ((e.target as HTMLElement)?.id !== this.parentMenu.contentId.current) return;

		if (!FIRST_LAST_KEYS.includes(e.key)) return;
		e.preventDefault();

		if (LAST_KEYS.includes(e.key)) {
			candidateNodes.reverse();
		}
		focusFirst(candidateNodes, { select: false }, () => this.domContext.getActiveElement());
	}

	onblur(e: BitsFocusEvent) {
		if (!isElement(e.currentTarget)) return;
		if (!isElement(e.target)) return;
		// clear search buffer when leaving the menu
		if (!e.currentTarget.contains?.(e.target)) {
			this.domContext.getWindow().clearTimeout(this.#timer);
			this.search = "";
		}
	}

	onfocus(_: BitsFocusEvent) {
		if (!this.parentMenu.root.isUsingKeyboard.current) return;
		afterTick(() => this.rovingFocusGroup.focusFirstCandidate());
	}

	onItemEnter() {
		return this.#isPointerMovingToSubmenu();
	}

	onItemLeave(e: BitsPointerEvent) {
		if (e.currentTarget.hasAttribute(this.parentMenu.root.getBitsAttr("sub-trigger"))) return;
		if (this.#isPointerMovingToSubmenu() || this.parentMenu.root.isUsingKeyboard.current)
			return;
		const contentNode = this.parentMenu.contentNode;
		contentNode?.focus({ preventScroll: true });
		this.rovingFocusGroup.setCurrentTabStopId("");
	}

	onTriggerLeave() {
		if (this.#isPointerMovingToSubmenu()) return true;
		return false;
	}

	handleInteractOutside(e: PointerEvent) {
		if (!isElementOrSVGElement(e.target)) return;
		const triggerId = this.parentMenu.triggerNode?.id;
		if (e.target.id === triggerId) {
			e.preventDefault();
			return;
		}
		if (e.target.closest(`#${triggerId}`)) {
			e.preventDefault();
			return;
		}
		/**
		 * when the menu closes due to an outside pointer interaction (for example,
		 * clicking another dropdown trigger), avoid focusing this menu's trigger
		 * to prevent stealing focus from the new interaction target.
		 */
		this.parentMenu.root.ignoreCloseAutoFocus = true;
		afterTick(() => {
			this.parentMenu.root.ignoreCloseAutoFocus = false;
		});
	}

	get shouldRender() {
		return this.parentMenu.contentPresence.shouldRender;
	}

	readonly snippetProps = $derived.by(() => ({ open: this.parentMenu.opts.open.current }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "menu",
				"aria-orientation": "vertical" as const,
				[this.parentMenu.root.getBitsAttr("content")]: "",
				"data-state": getDataOpenClosed(this.parentMenu.opts.open.current),
				...getDataTransitionAttrs(this.parentMenu.contentPresence.transitionStatus),
				onkeydown: this.onkeydown,
				onblur: this.onblur,
				onfocus: this.onfocus,
				dir: this.parentMenu.root.opts.dir.current,
				style: {
					pointerEvents: "auto",
					contain: "layout style",
				},
				...this.attachment,
			}) as const
	);

	readonly popperProps = {
		onCloseAutoFocus: (e: Event) => this.onCloseAutoFocus(e),
	};
}

interface MenuItemSharedStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {}

class MenuItemSharedState {
	readonly opts: MenuItemSharedStateOpts;
	readonly content: MenuContentState;
	readonly attachment: RefAttachment;
	#isFocused = $state(false);

	constructor(opts: MenuItemSharedStateOpts, content: MenuContentState) {
		this.opts = opts;
		this.content = content;
		this.attachment = attachRef(this.opts.ref);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.onblur = this.onblur.bind(this);
	}

	onpointermove(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;

		if (this.opts.disabled.current) {
			this.content.onItemLeave(e);
		} else {
			const defaultPrevented = this.content.onItemEnter();
			if (defaultPrevented) return;
			const item = e.currentTarget;
			if (!isHTMLElement(item)) return;
			item.focus({ preventScroll: true });
		}
	}

	onpointerleave(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;
		this.content.onItemLeave(e);
	}

	onfocus(e: BitsFocusEvent) {
		afterTick(() => {
			if (e.defaultPrevented || this.opts.disabled.current) return;
			this.#isFocused = true;
		});
	}

	onblur(e: BitsFocusEvent) {
		afterTick(() => {
			if (e.defaultPrevented) return;
			this.#isFocused = false;
		});
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				tabindex: -1,
				role: "menuitem",
				"aria-disabled": boolToStr(this.opts.disabled.current),
				"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
				"data-highlighted": this.#isFocused ? "" : undefined,
				[this.content.parentMenu.root.getBitsAttr("item")]: "",
				//
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				onfocus: this.onfocus,
				onblur: this.onblur,
				...this.attachment,
			}) as const
	);
}

type MenuItemCombinedProps = MenuItemSharedStateOpts & MenuItemStateOpts;

interface MenuItemStateOpts
	extends ReadableBoxedValues<{
		onSelect: AnyFn;
		closeOnSelect: boolean;
	}> {}

export class MenuItemState {
	static create(opts: MenuItemCombinedProps) {
		const item = new MenuItemSharedState(opts, MenuContentContext.get());
		return new MenuItemState(opts, item);
	}

	readonly opts: MenuItemStateOpts;
	readonly item: MenuItemSharedState;
	readonly root: MenuRootState;
	#isPointerDown = false;

	constructor(opts: MenuItemStateOpts, item: MenuItemSharedState) {
		this.opts = opts;
		this.item = item;
		this.root = item.content.parentMenu.root;

		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
	}

	#handleSelect() {
		if (this.item.opts.disabled.current) return;
		const selectEvent = new CustomEvent("menuitemselect", { bubbles: true, cancelable: true });
		this.opts.onSelect.current(selectEvent);
		if (selectEvent.defaultPrevented) {
			this.item.content.parentMenu.root.isUsingKeyboard.current = false;
			return;
		}
		if (this.opts.closeOnSelect.current) {
			this.item.content.parentMenu.root.opts.onClose();
		}
	}

	onkeydown(e: BitsKeyboardEvent) {
		const isTypingAhead = this.item.content.search !== "";
		if (this.item.opts.disabled.current || (isTypingAhead && e.key === kbd.SPACE)) return;
		if (SELECTION_KEYS.includes(e.key)) {
			if (!isHTMLElement(e.currentTarget)) return;
			e.currentTarget.click();
			/**
			 * We prevent default browser behavior for selection keys as they should trigger
			 * a selection only:
			 * - prevents space from scrolling the page.
			 * - if keydown causes focus to move, prevents keydown from firing on the new target.
			 */
			e.preventDefault();
		}
	}

	onclick(_: BitsMouseEvent) {
		if (this.item.opts.disabled.current) return;
		this.#handleSelect();
	}

	onpointerup(e: BitsPointerEvent) {
		if (e.defaultPrevented) return;
		if (!this.#isPointerDown) {
			if (!isHTMLElement(e.currentTarget)) return;
			e.currentTarget?.click();
		}
	}

	onpointerdown(_: BitsPointerEvent) {
		this.#isPointerDown = true;
	}

	readonly props = $derived.by(() =>
		mergeProps(this.item.props, {
			onclick: this.onclick,
			onpointerdown: this.onpointerdown,
			onpointerup: this.onpointerup,
			onkeydown: this.onkeydown,
		})
	);
}

interface MenuSubTriggerStateOpts
	extends MenuItemSharedStateOpts,
		Pick<MenuItemStateOpts, "onSelect"> {
	openDelay: ReadableBox<number>;
}

export class MenuSubTriggerState {
	static create(opts: MenuSubTriggerStateOpts) {
		const content = MenuContentContext.get();
		const item = new MenuItemSharedState(opts, content);
		const submenu = MenuMenuContext.get();
		return new MenuSubTriggerState(opts, item, content, submenu);
	}
	readonly opts: MenuSubTriggerStateOpts;
	readonly item: MenuItemSharedState;
	readonly content: MenuContentState;
	readonly submenu: MenuMenuState;
	readonly attachment: RefAttachment;
	#openTimer: number | null = null;

	constructor(
		opts: MenuSubTriggerStateOpts,
		item: MenuItemSharedState,
		content: MenuContentState,
		submenu: MenuMenuState
	) {
		this.opts = opts;
		this.item = item;
		this.content = content;
		this.submenu = submenu;
		this.attachment = attachRef(this.opts.ref, (v) => (this.submenu.triggerNode = v));
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);

		onDestroyEffect(() => {
			this.#clearOpenTimer();
		});
	}

	#clearOpenTimer() {
		if (this.#openTimer === null) return;
		this.content.domContext.getWindow().clearTimeout(this.#openTimer);
		this.#openTimer = null;
	}

	onpointermove(e: BitsPointerEvent) {
		if (!isMouseEvent(e)) return;
		if (this.submenu.root.isPointerInTransit) {
			if (this.#openTimer !== null) this.#clearOpenTimer();
			return;
		}

		if (
			!this.item.opts.disabled.current &&
			!this.submenu.opts.open.current &&
			!this.#openTimer
		) {
			const openDelay = this.opts.openDelay.current;

			if (openDelay <= 0) {
				this.submenu.onOpen();
				return;
			}

			this.#openTimer = this.content.domContext.setTimeout(() => {
				if (this.submenu.root.isPointerInTransit) {
					this.#clearOpenTimer();
					return;
				}

				this.submenu.onOpen();
				this.#clearOpenTimer();
			}, openDelay);
		}
	}

	onpointerleave(e: BitsPointerEvent) {
		if (!isMouseEvent(e)) return;
		this.#clearOpenTimer();
	}

	onkeydown(e: BitsKeyboardEvent) {
		const isTypingAhead = this.content.search !== "";
		if (this.item.opts.disabled.current || (isTypingAhead && e.key === kbd.SPACE)) return;

		if (SUB_OPEN_KEYS[this.submenu.root.opts.dir.current].includes(e.key)) {
			e.currentTarget.click();
			e.preventDefault();
		}
	}

	onclick(e: BitsMouseEvent) {
		if (this.item.opts.disabled.current) return;
		/**
		 * We manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
		 * and we rely heavily on `onFocusOutside` for submenus to close when switching
		 * between separate submenus.
		 */
		if (!isHTMLElement(e.currentTarget)) return;
		e.currentTarget.focus();
		const selectEvent = new CustomEvent("menusubtriggerselect", {
			bubbles: true,
			cancelable: true,
		});
		this.opts.onSelect.current(selectEvent);
		if (!this.submenu.opts.open.current) {
			this.submenu.onOpen();
			afterTick(() => {
				const contentNode = this.submenu.contentNode;
				if (!contentNode) return;
				MenuOpenEvent.dispatch(contentNode);
			});
		}
	}

	readonly props = $derived.by(() =>
		mergeProps(
			{
				"aria-haspopup": "menu",
				"aria-expanded": boolToStr(this.submenu.opts.open.current),
				"data-state": getDataOpenClosed(this.submenu.opts.open.current),
				"aria-controls": this.submenu.opts.open.current
					? this.submenu.contentId.current
					: undefined,
				[this.submenu.root.getBitsAttr("sub-trigger")]: "",
				onclick: this.onclick,
				onpointermove: this.onpointermove,
				onpointerleave: this.onpointerleave,
				onkeydown: this.onkeydown,
				...this.attachment,
			},
			this.item.props
		)
	);
}

interface MenuCheckboxItemStateOpts
	extends WritableBoxedValues<{
			checked: boolean;
			indeterminate: boolean;
		}>,
		ReadableBoxedValues<{
			value: string;
		}> {}

export class MenuCheckboxItemState {
	static create(
		opts: MenuItemCombinedProps & MenuCheckboxItemStateOpts,
		checkboxGroup: MenuCheckboxGroupState | null
	) {
		const item = new MenuItemState(
			opts,
			new MenuItemSharedState(opts, MenuContentContext.get())
		);
		return new MenuCheckboxItemState(opts, item, checkboxGroup);
	}

	readonly opts: MenuCheckboxItemStateOpts;
	readonly item: MenuItemState;
	readonly group: MenuCheckboxGroupState | null;

	constructor(
		opts: MenuCheckboxItemStateOpts,
		item: MenuItemState,
		group: MenuCheckboxGroupState | null = null
	) {
		this.opts = opts;
		this.item = item;
		this.group = group;

		// Watch for value changes in the group if we're part of one
		if (this.group) {
			watch(
				() => this.group!.opts.value.current,
				(groupValues) => {
					this.opts.checked.current = groupValues.includes(this.opts.value.current);
				}
			);

			// Watch for checked state changes and sync with group
			watch(
				() => this.opts.checked.current,
				(checked) => {
					if (checked) {
						this.group!.addValue(this.opts.value.current);
					} else {
						this.group!.removeValue(this.opts.value.current);
					}
				}
			);
		}
	}

	toggleChecked() {
		if (this.opts.indeterminate.current) {
			this.opts.indeterminate.current = false;
			this.opts.checked.current = true;
		} else {
			this.opts.checked.current = !this.opts.checked.current;
		}
	}

	readonly snippetProps = $derived.by(() => ({
		checked: this.opts.checked.current,
		indeterminate: this.opts.indeterminate.current,
	}));

	readonly props = $derived.by(
		() =>
			({
				...this.item.props,
				role: "menuitemcheckbox",
				"aria-checked": getAriaChecked(
					this.opts.checked.current,
					this.opts.indeterminate.current
				),
				"data-state": getCheckedState(this.opts.checked.current),
				[this.item.root.getBitsAttr("checkbox-item")]: "",
			}) as const
	);
}

interface MenuGroupStateOpts extends WithRefOpts {}

export class MenuGroupState {
	static create(opts: MenuGroupStateOpts) {
		return MenuGroupContext.set(new MenuGroupState(opts, MenuRootContext.get()));
	}

	readonly opts: MenuGroupStateOpts;
	readonly root: MenuRootState;
	readonly attachment: RefAttachment;
	groupHeadingId = $state<string | undefined>(undefined);

	constructor(opts: MenuGroupStateOpts, root: MenuRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				"aria-labelledby": this.groupHeadingId,
				[this.root.getBitsAttr("group")]: "",
				...this.attachment,
			}) as const
	);
}

interface MenuGroupHeadingStateOpts extends WithRefOpts {}

export class MenuGroupHeadingState {
	static create(opts: MenuGroupHeadingStateOpts) {
		// Try to get checkbox group first, then radio group, then regular group
		const checkboxGroup = MenuCheckboxGroupContext.getOr(null);
		if (checkboxGroup) return new MenuGroupHeadingState(opts, checkboxGroup);

		const radioGroup = MenuRadioGroupContext.getOr(null);
		if (radioGroup) return new MenuGroupHeadingState(opts, radioGroup);

		return new MenuGroupHeadingState(opts, MenuGroupContext.get());
	}
	readonly opts: MenuGroupHeadingStateOpts;
	readonly group: MenuGroupState | MenuRadioGroupState | MenuCheckboxGroupState;
	readonly attachment: RefAttachment;

	constructor(
		opts: MenuGroupHeadingStateOpts,
		group: MenuGroupState | MenuRadioGroupState | MenuCheckboxGroupState
	) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef(this.opts.ref, (v) => (this.group.groupHeadingId = v?.id));
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				[this.group.root.getBitsAttr("group-heading")]: "",
				...this.attachment,
			}) as const
	);
}

interface MenuSeparatorStateOpts extends WithRefOpts {}

export class MenuSeparatorState {
	static create(opts: MenuSeparatorStateOpts) {
		return new MenuSeparatorState(opts, MenuRootContext.get());
	}

	readonly opts: MenuSeparatorStateOpts;
	readonly root: MenuRootState;
	readonly attachment: RefAttachment;

	constructor(opts: MenuSeparatorStateOpts, root: MenuRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				[this.root.getBitsAttr("separator")]: "",
				...this.attachment,
			}) as const
	);
}

export class MenuArrowState {
	static create() {
		return new MenuArrowState(MenuRootContext.get());
	}

	readonly root: MenuRootState;

	constructor(root: MenuRootState) {
		this.root = root;
	}

	readonly props = $derived.by(
		() =>
			({
				[this.root.getBitsAttr("arrow")]: "",
			}) as const
	);
}

interface MenuRadioGroupStateOpts
	extends WithRefOpts,
		WritableBoxedValues<{
			value: string;
		}> {}

export class MenuRadioGroupState {
	static create(opts: MenuRadioGroupStateOpts) {
		return MenuGroupContext.set(
			MenuRadioGroupContext.set(new MenuRadioGroupState(opts, MenuContentContext.get()))
		);
	}
	readonly opts: MenuRadioGroupStateOpts;
	readonly content: MenuContentState;
	readonly attachment: RefAttachment;
	groupHeadingId = $state<string | null>(null);
	root: MenuRootState;

	constructor(opts: MenuRadioGroupStateOpts, content: MenuContentState) {
		this.opts = opts;
		this.content = content;
		this.root = content.parentMenu.root;
		this.attachment = attachRef(this.opts.ref);
	}

	setValue(v: string) {
		this.opts.value.current = v;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr("radio-group")]: "",
				role: "group",
				"aria-labelledby": this.groupHeadingId,
				...this.attachment,
			}) as const
	);
}

interface MenuRadioItemStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			value: string;
			closeOnSelect: boolean;
		}> {}

export class MenuRadioItemState {
	static create(opts: MenuRadioItemStateOpts & MenuItemCombinedProps) {
		const radioGroup = MenuRadioGroupContext.get();
		const sharedItem = new MenuItemSharedState(opts, radioGroup.content);
		const item = new MenuItemState(opts, sharedItem);
		return new MenuRadioItemState(opts, item, radioGroup);
	}
	readonly opts: MenuRadioItemStateOpts;
	readonly item: MenuItemState;
	readonly group: MenuRadioGroupState;
	readonly attachment: RefAttachment;
	readonly isChecked = $derived.by(
		() => this.group.opts.value.current === this.opts.value.current
	);

	constructor(opts: MenuRadioItemStateOpts, item: MenuItemState, group: MenuRadioGroupState) {
		this.opts = opts;
		this.item = item;
		this.group = group;
		this.attachment = attachRef(this.opts.ref);
	}

	selectValue() {
		this.group.setValue(this.opts.value.current);
	}

	readonly props = $derived.by(
		() =>
			({
				[this.group.root.getBitsAttr("radio-item")]: "",
				...this.item.props,
				role: "menuitemradio",
				"aria-checked": getAriaChecked(this.isChecked, false),
				"data-state": getCheckedState(this.isChecked),
				...this.attachment,
			}) as const
	);
}

//
// DROPDOWN MENU TRIGGER
//

interface DropdownMenuTriggerStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {}

export class DropdownMenuTriggerState {
	static create(opts: DropdownMenuTriggerStateOpts) {
		return new DropdownMenuTriggerState(opts, MenuMenuContext.get());
	}

	readonly opts: DropdownMenuTriggerStateOpts;
	readonly parentMenu: MenuMenuState;
	readonly attachment: RefAttachment;

	constructor(opts: DropdownMenuTriggerStateOpts, parentMenu: MenuMenuState) {
		this.opts = opts;
		this.parentMenu = parentMenu;
		this.attachment = attachRef(this.opts.ref, (v) => (this.parentMenu.triggerNode = v));
	}

	onclick: MouseEventHandler<HTMLElement> = (e) => {
		/**
		 * MacOS VoiceOver sends a click in Safari/Firefox bypassing the keydown event
		 * when V0+Space is pressed. Since we already handle the keydown event and the
		 * pointerdown events separately, we ignore it if the detail is not 0.
		 */
		if (this.opts.disabled.current || e.detail !== 0) return;
		this.parentMenu.toggleOpen();
		e.preventDefault();
	};

	onpointerdown: PointerEventHandler<HTMLElement> = (e) => {
		if (this.opts.disabled.current) return;
		if (e.pointerType === "touch") return e.preventDefault();

		if (e.button === 0 && e.ctrlKey === false) {
			this.parentMenu.toggleOpen();
			// prevent trigger focusing when opening to allow
			// the content to be given focus without competition
			if (!this.parentMenu.opts.open.current) e.preventDefault();
		}
	};

	onpointerup: PointerEventHandler<HTMLElement> = (e) => {
		if (this.opts.disabled.current) return;
		if (e.pointerType === "touch") {
			e.preventDefault();
			this.parentMenu.toggleOpen();
		}
	};

	onkeydown: KeyboardEventHandler<HTMLElement> = (e) => {
		if (this.opts.disabled.current) return;
		if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
			this.parentMenu.toggleOpen();
			e.preventDefault();
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			this.parentMenu.onOpen();
			e.preventDefault();
		}
	};

	readonly #ariaControls = $derived.by(() => {
		if (this.parentMenu.opts.open.current && this.parentMenu.contentId.current)
			return this.parentMenu.contentId.current;
		return undefined;
	});

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.opts.disabled.current,
				"aria-haspopup": "menu",
				"aria-expanded": boolToStr(this.parentMenu.opts.open.current),
				"aria-controls": this.#ariaControls,
				"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
				"data-state": getDataOpenClosed(this.parentMenu.opts.open.current),
				[this.parentMenu.root.getBitsAttr("trigger")]: "",
				//
				onclick: this.onclick,
				onpointerdown: this.onpointerdown,
				onpointerup: this.onpointerup,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const
	);
}

interface ContextMenuTriggerStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
		}> {}

export class ContextMenuTriggerState {
	static create(opts: ContextMenuTriggerStateOpts) {
		return new ContextMenuTriggerState(opts, MenuMenuContext.get());
	}

	readonly opts: ContextMenuTriggerStateOpts;
	readonly parentMenu: MenuMenuState;
	readonly attachment: RefAttachment;
	#point = $state({ x: 0, y: 0 });

	virtualElement = simpleBox({
		getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...this.#point }),
	});
	#longPressTimer: number | null = null;

	constructor(opts: ContextMenuTriggerStateOpts, parentMenu: MenuMenuState) {
		this.opts = opts;
		this.parentMenu = parentMenu;
		this.attachment = attachRef(this.opts.ref, (v) => (this.parentMenu.triggerNode = v));
		this.oncontextmenu = this.oncontextmenu.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointercancel = this.onpointercancel.bind(this);
		this.onpointerup = this.onpointerup.bind(this);

		watch(
			() => this.#point,
			(point) => {
				this.virtualElement.current = {
					getBoundingClientRect: () =>
						DOMRect.fromRect({ width: 0, height: 0, ...point }),
				};
			}
		);

		watch(
			() => this.opts.disabled.current,
			(isDisabled) => {
				if (isDisabled) {
					this.#clearLongPressTimer();
				}
			}
		);

		onDestroyEffect(() => this.#clearLongPressTimer());
	}

	#clearLongPressTimer() {
		if (this.#longPressTimer === null) return;
		getWindow(this.opts.ref.current).clearTimeout(this.#longPressTimer);
	}

	#handleOpen(e: BitsMouseEvent | BitsPointerEvent) {
		this.#point = { x: e.clientX, y: e.clientY };
		this.parentMenu.onOpen();
	}

	oncontextmenu(e: BitsMouseEvent) {
		if (e.defaultPrevented || this.opts.disabled.current) return;

		this.#clearLongPressTimer();
		this.#handleOpen(e);
		e.preventDefault();
		this.parentMenu.contentNode?.focus();
	}

	onpointerdown(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
		this.#longPressTimer = getWindow(this.opts.ref.current).setTimeout(
			() => this.#handleOpen(e),
			700
		);
	}

	onpointermove(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	onpointercancel(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	onpointerup(e: BitsPointerEvent) {
		if (this.opts.disabled.current || isMouseEvent(e)) return;
		this.#clearLongPressTimer();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.opts.disabled.current,
				"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
				"data-state": getDataOpenClosed(this.parentMenu.opts.open.current),
				[CONTEXT_MENU_TRIGGER_ATTR]: "",
				tabindex: -1,
				onpointerdown: this.onpointerdown,
				onpointermove: this.onpointermove,
				onpointercancel: this.onpointercancel,
				onpointerup: this.onpointerup,
				oncontextmenu: this.oncontextmenu,
				...this.attachment,
			}) as const
	);
}

interface MenuCheckboxGroupStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			onValueChange: (value: string[]) => void;
		}>,
		WritableBoxedValues<{
			value: string[];
		}> {}

export class MenuCheckboxGroupState {
	static create(opts: MenuCheckboxGroupStateOpts) {
		return MenuCheckboxGroupContext.set(
			new MenuCheckboxGroupState(opts, MenuContentContext.get())
		);
	}

	readonly opts: MenuCheckboxGroupStateOpts;
	readonly content: MenuContentState;
	readonly root: MenuRootState;
	readonly attachment: RefAttachment;
	groupHeadingId = $state<string | null>(null);

	constructor(opts: MenuCheckboxGroupStateOpts, content: MenuContentState) {
		this.opts = opts;
		this.content = content;
		this.root = content.parentMenu.root;
		this.attachment = attachRef(this.opts.ref);
	}

	addValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		if (!this.opts.value.current.includes(checkboxValue)) {
			const newValue = [...$state.snapshot(this.opts.value.current), checkboxValue];
			this.opts.value.current = newValue;
			if (arraysAreEqual(this.opts.value.current, newValue)) return;
			this.opts.onValueChange.current(newValue);
		}
	}

	removeValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		const index = this.opts.value.current.indexOf(checkboxValue);
		if (index === -1) return;
		const newValue = this.opts.value.current.filter((v) => v !== checkboxValue);
		this.opts.value.current = newValue;
		if (arraysAreEqual(this.opts.value.current, newValue)) return;
		this.opts.onValueChange.current(newValue);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[this.root.getBitsAttr("checkbox-group")]: "",
				role: "group",
				"aria-labelledby": this.groupHeadingId,
				...this.attachment,
			}) as const
	);
}

export class MenuSubmenuState {
	static create(opts: MenuMenuStateOpts) {
		const menu = MenuMenuContext.get();
		return MenuMenuContext.set(new MenuMenuState(opts, menu.root, menu));
	}
}
