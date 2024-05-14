import { untrack } from "svelte";
import {
	type Middleware,
	type Placement,
	arrow,
	autoUpdate,
	flip,
	hide,
	limitShift,
	offset,
	shift,
	size,
} from "@floating-ui/dom";
import { type ReadableBox, type WritableBox, box } from "runed";
import {
	type Arrayable,
	type Box,
	type ReadableBoxedValues,
	styleToString,
	useNodeById,
} from "$lib/internal/index.js";
import { useSize } from "$lib/internal/useSize.svelte.js";
import { useFloating } from "$lib/internal/floating-svelte/useFloating.svelte.js";
import type { Measurable, UseFloatingReturn } from "$lib/internal/floating-svelte/types.js";
import type { Direction, StyleProperties } from "$lib/shared/index.js";
import { createContext } from "$lib/internal/createContext.js";

export const SIDE_OPTIONS = ["top", "right", "bottom", "left"] as const;
export const ALIGN_OPTIONS = ["start", "center", "end"] as const;

const OPPOSITE_SIDE: Record<Side, Side> = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right",
};

export type Side = (typeof SIDE_OPTIONS)[number];
export type Align = (typeof ALIGN_OPTIONS)[number];

export type Boundary = Element | null;

class FloatingRootState {
	anchorNode = undefined as unknown as ReadableBox<Measurable | HTMLElement | null>;

	createAnchor(props: FloatingAnchorStateProps) {
		return new FloatingAnchorState(props, this);
	}

	createContent(props: FloatingContentStateProps) {
		return new FloatingContentState(props, this);
	}
}

export type FloatingContentStateProps = ReadableBoxedValues<{
	id: string;
	wrapperId: string;
	side: Side;
	sideOffset: number;
	align: Align;
	alignOffset: number;
	arrowPadding: number;
	avoidCollisions: boolean;
	collisionBoundary: Arrayable<Boundary>;
	collisionPadding: number | Partial<Record<Side, number>>;
	sticky: "partial" | "always";
	hideWhenDetached: boolean;
	updatePositionStrategy: "optimized" | "always";
	strategy: "fixed" | "absolute";
	onPlaced: () => void;
	dir: Direction;
	style: StyleProperties;
	present: boolean;
}>;

class FloatingContentState {
	// state
	root = undefined as unknown as FloatingRootState;

	// nodes
	contentNode = undefined as unknown as Box<HTMLElement | null>;
	wrapperNode = undefined as unknown as Box<HTMLElement | null>;
	arrowNode = box<HTMLElement | null>(null);

	// ids
	arrowId = undefined as unknown as ReadableBox<string>;
	id = undefined as unknown as FloatingContentStateProps["id"];
	wrapperId = undefined as unknown as FloatingContentStateProps["wrapperId"];

	style = undefined as unknown as FloatingContentStateProps["style"];
	dir = undefined as unknown as FloatingContentStateProps["dir"];
	side = undefined as unknown as FloatingContentStateProps["side"];
	sideOffset = undefined as unknown as FloatingContentStateProps["sideOffset"];
	align = undefined as unknown as FloatingContentStateProps["align"];
	alignOffset = undefined as unknown as FloatingContentStateProps["alignOffset"];
	arrowPadding = undefined as unknown as FloatingContentStateProps["arrowPadding"];
	avoidCollisions = undefined as unknown as FloatingContentStateProps["avoidCollisions"];
	collisionBoundary = undefined as unknown as FloatingContentStateProps["collisionBoundary"];
	collisionPadding = undefined as unknown as FloatingContentStateProps["collisionPadding"];
	sticky = undefined as unknown as FloatingContentStateProps["sticky"];
	hideWhenDetached = undefined as unknown as FloatingContentStateProps["hideWhenDetached"];
	strategy = undefined as unknown as FloatingContentStateProps["strategy"];
	updatePositionStrategy =
		undefined as unknown as FloatingContentStateProps["updatePositionStrategy"];
	onPlaced = undefined as unknown as FloatingContentStateProps["onPlaced"];
	present = undefined as unknown as FloatingContentStateProps["present"];
	arrowSize: {
		readonly value:
			| {
					width: number;
					height: number;
			  }
			| undefined;
	} = { value: undefined };
	arrowWidth = $derived(this.arrowSize.value?.width ?? 0);
	arrowHeight = $derived(this.arrowSize.value?.height ?? 0);
	desiredPlacement = $derived(
		this.side?.value + (this.align.value !== "center" ? `-${this.align.value}` : "")
	) as Placement;
	boundary = $derived(
		Array.isArray(this.collisionBoundary.value)
			? this.collisionBoundary.value
			: [this.collisionBoundary.value]
	);
	hasExplicitBoundaries = $derived(this.boundary.length > 0);
	detectOverflowOptions = $derived({
		padding: this.collisionPadding.value,
		boundary: this.boundary.filter(isNotNull),
		altBoundary: this.hasExplicitBoundaries,
	});
	middleware: Middleware[] = $derived(
		[
			offset({
				mainAxis: this.sideOffset.value + this.arrowHeight,
				alignmentAxis: this.alignOffset.value,
			}),
			this.avoidCollisions &&
				shift({
					mainAxis: true,
					crossAxis: false,
					limiter: this.sticky.value === "partial" ? limitShift() : undefined,
					...this.detectOverflowOptions,
				}),
			this.avoidCollisions && flip({ ...this.detectOverflowOptions }),
			size({
				...this.detectOverflowOptions,
				apply: ({ elements, rects, availableWidth, availableHeight }) => {
					const { width: anchorWidth, height: anchorHeight } = rects.reference;
					const contentStyle = elements.floating.style;
					contentStyle.setProperty(
						"--bits-floating-available-width",
						`${availableWidth}px`
					);
					contentStyle.setProperty(
						"--bits-floating-available-height",
						`${availableHeight}px`
					);
					contentStyle.setProperty("--bits-floating-anchor-width", `${anchorWidth}px`);
					contentStyle.setProperty("--bits-floating-anchor-height", `${anchorHeight}px`);
				},
			}),
			this.arrowNode.value &&
				arrow({ element: this.arrowNode.value, padding: this.arrowPadding.value }),
			transformOrigin({ arrowWidth: this.arrowWidth, arrowHeight: this.arrowHeight }),
			this.hideWhenDetached.value &&
				hide({ strategy: "referenceHidden", ...this.detectOverflowOptions }),
		].filter(Boolean) as Middleware[]
	);
	floating = undefined as unknown as UseFloatingReturn;
	placedSide = $derived(getSideFromPlacement(this.floating.placement));
	placedAlign = $derived(getAlignFromPlacement(this.floating.placement));
	arrowX = $derived(this.floating.middlewareData.arrow?.x ?? 0);
	arrowY = $derived(this.floating.middlewareData.arrow?.y ?? 0);
	cannotCenterArrow = $derived(this.floating.middlewareData.arrow?.centerOffset !== 0);
	contentZIndex = $state<string>();
	arrowBaseSide = $derived(OPPOSITE_SIDE[this.placedSide]);
	wrapperProps = $derived({
		id: this.wrapperId.value,
		"data-bits-floating-content-wrapper": "",
		style: {
			...this.floating.floatingStyles,
			// keep off page when measuring
			transform: this.floating.isPositioned
				? this.floating.floatingStyles.transform
				: "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: this.contentZIndex,
			"--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
			// hide the content if using the hide middleware and should be hidden
			...(this.floating.middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				"pointer-events": "none",
			}),
		},
		// Floating UI calculates logical alignment based the `dir` attribute
		dir: this.dir.value,
	} as const);
	props = $derived({
		"data-side": this.placedSide,
		"data-align": this.placedAlign,
		style: styleToString({
			...this.style.value,
			// if the FloatingContent hasn't been placed yet (not all measurements done)
			// we prevent animations so that users's animation don't kick in too early referring wrong sides
			// animation: !this.floating.isPositioned ? "none" : undefined,
		}),
	} as const);

	arrowStyle = $derived({
		position: "absolute",
		left: this.arrowX ? `${this.arrowX}px` : undefined,
		top: this.arrowY ? `${this.arrowY}px` : undefined,
		[this.arrowBaseSide]: 0,
		"transform-origin": {
			top: "",
			right: "0 0",
			bottom: "center 0",
			left: "100% 0",
		}[this.placedSide],
		transform: {
			top: "translateY(100%)",
			right: "translateY(50%) rotate(90deg) translateX(-50%)",
			bottom: "rotate(180deg)",
			left: "translateY(50%) rotate(-90deg) translateX(50%)",
		}[this.placedSide],
		visibility: this.cannotCenterArrow ? "hidden" : undefined,
	});

	constructor(props: FloatingContentStateProps, root: FloatingRootState) {
		this.id = props.id;
		this.side = props.side;
		this.sideOffset = props.sideOffset;
		this.align = props.align;
		this.alignOffset = props.alignOffset;
		this.arrowPadding = props.arrowPadding;
		this.avoidCollisions = props.avoidCollisions;
		this.collisionBoundary = props.collisionBoundary;
		this.collisionPadding = props.collisionPadding;
		this.sticky = props.sticky;
		this.hideWhenDetached = props.hideWhenDetached;
		this.updatePositionStrategy = props.updatePositionStrategy;
		this.onPlaced = props.onPlaced;
		this.strategy = props.strategy;
		this.dir = props.dir;
		this.style = props.style;
		this.root = root;
		this.present = props.present;
		this.arrowSize = useSize(this.arrowNode);
		this.wrapperId = props.wrapperId;
		this.wrapperNode = useNodeById(this.wrapperId);
		this.contentNode = useNodeById(this.id);
		this.floating = useFloating({
			strategy: () => this.strategy.value,
			placement: () => this.desiredPlacement,
			middleware: () => this.middleware,
			reference: this.root.anchorNode,
			whileElementsMounted: (...args) => {
				const cleanup = autoUpdate(...args, {
					animationFrame: this.updatePositionStrategy?.value === "always",
				});
				return cleanup;
			},
			open: () => this.present.value,
		});

		$effect(() => {
			if (!this.floating.isPositioned) return;
			this.onPlaced?.value();
		});

		$effect(() => {
			const contentNode = this.contentNode.value;
			if (!contentNode) return;

			untrack(() => {
				this.contentZIndex = window.getComputedStyle(contentNode).zIndex;
			});
		});

		$effect(() => {
			this.floating.floating.value = this.wrapperNode.value;
		});
	}

	createArrow(props: FloatingArrowStateProps) {
		return new FloatingArrowState(props, this);
	}
}

type FloatingArrowStateProps = ReadableBoxedValues<{
	id: string;
}>;

class FloatingArrowState {
	#content = undefined as unknown as FloatingContentState;
	#id = undefined as unknown as FloatingArrowStateProps["id"];

	props = $derived({
		id: this.#id.value,
		style: this.#content.arrowStyle,
	});

	constructor(props: FloatingArrowStateProps, content: FloatingContentState) {
		this.#content = content;
		this.#id = props.id;
		this.#content.arrowNode = useNodeById(this.#id);
	}
}

type FloatingAnchorStateProps = ReadableBoxedValues<{
	id: string;
	virtualEl?: Measurable;
}>;

class FloatingAnchorState {
	constructor(props: FloatingAnchorStateProps, root: FloatingRootState) {
		if (props.virtualEl && props.virtualEl.value) {
			root.anchorNode = box.from(props.virtualEl.value);
		} else {
			root.anchorNode = useNodeById(props.id);
		}
	}
}

//
// CONTEXT METHODS
//

const [setFloatingRootContext, getFloatingRootContext] =
	createContext<FloatingRootState>("Floating.Root");

const [setFloatingContentContext, getFloatingContentContext] =
	createContext<FloatingContentState>("Floating.Content");

export function useFloatingRootState() {
	return setFloatingRootContext(new FloatingRootState());
}

export function useFloatingContentState(props: FloatingContentStateProps): FloatingContentState {
	return setFloatingContentContext(getFloatingRootContext().createContent(props));
}

export function useFloatingArrowState(props: FloatingArrowStateProps): FloatingArrowState {
	return getFloatingContentContext().createArrow(props);
}

export function useFloatingAnchorState(props: FloatingAnchorStateProps): FloatingAnchorState {
	return getFloatingRootContext().createAnchor(props);
}

//
// HELPERS
//

function isNotNull<T>(value: T | null): value is T {
	return value !== null;
}

function transformOrigin(options: { arrowWidth: number; arrowHeight: number }): Middleware {
	return {
		name: "transformOrigin",
		options,
		fn(data) {
			const { placement, rects, middlewareData } = data;

			const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
			const isArrowHidden = cannotCenterArrow;
			const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
			const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;

			const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
			const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];

			const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
			const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;

			let x = "";
			let y = "";

			if (placedSide === "bottom") {
				x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
				y = `${-arrowHeight}px`;
			} else if (placedSide === "top") {
				x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
				y = `${rects.floating.height + arrowHeight}px`;
			} else if (placedSide === "right") {
				x = `${-arrowHeight}px`;
				y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
			} else if (placedSide === "left") {
				x = `${rects.floating.width + arrowHeight}px`;
				y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
			}
			return { data: { x, y } };
		},
	};
}

function getSideAndAlignFromPlacement(placement: Placement) {
	const [side, align = "center"] = placement.split("-");
	return [side as Side, align as Align] as const;
}

export function getSideFromPlacement(placement: Placement) {
	return getSideAndAlignFromPlacement(placement)[0];
}

export function getAlignFromPlacement(placement: Placement) {
	return getSideAndAlignFromPlacement(placement)[1];
}
