import type { VirtualElement } from "@floating-ui/core";
import { getContext, setContext, untrack } from "svelte";
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
import {
	type Arrayable,
	type Box,
	type ReadonlyBox,
	type ReadonlyBoxedValues,
	boxedState,
	generateId,
	styleToString,
	useNodeById,
} from "$lib/internal/index.js";
import { useSize } from "$lib/internal/use-size.svelte.js";
import { useFloating } from "$lib/internal/floating-svelte/use-floating.svelte.js";
import type { UseFloatingReturn } from "$lib/internal/floating-svelte/types.js";
import type { StyleProperties, TextDirection } from "$lib/shared/index.js";

export const SIDE_OPTIONS = ["top", "right", "bottom", "left"] as const;
export const ALIGN_OPTIONS = ["start", "center", "end"] as const;

const ARROW_TRANSFORM = {
	bottom: "rotate(45deg)",
	left: "rotate(135deg)",
	top: "rotate(225deg)",
	right: "rotate(315deg)",
};

export type Side = (typeof SIDE_OPTIONS)[number];
export type Align = (typeof ALIGN_OPTIONS)[number];

export type Boundary = Element | null;

class FloatingRootState {
	wrapperId = boxedState(generateId());
	wrapperNode = undefined as unknown as Box<HTMLElement | null>;
	contentNode = undefined as unknown as Box<HTMLElement | null>;
	anchorNode = undefined as unknown as Box<HTMLElement | null>;
	arrowNode = boxedState<HTMLElement | null>(null);

	constructor() {
		this.wrapperNode = useNodeById(this.wrapperId);
	}

	createAnchor(props: FloatingAnchorStateProps) {
		return new FloatingAnchorState(props, this);
	}

	createContent(props: FloatingContentStateProps) {
		return new FloatingContentState(props, this);
	}

	createArrow(props: FloatingArrowStateProps) {
		return new FloatingArrowState(props, this);
	}
}

export type FloatingContentStateProps = ReadonlyBoxedValues<{
	id: string;
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
	dir: TextDirection;
	style: StyleProperties;
}>;

class FloatingContentState {
	root = undefined as unknown as FloatingRootState;
	id = undefined as unknown as FloatingContentStateProps["id"];
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
						"--bits-popper-available-width",
						`${availableWidth}px`
					);
					contentStyle.setProperty(
						"--bits-popper-available-height",
						`${availableHeight}px`
					);
					contentStyle.setProperty("--bits-popper-anchor-width", `${anchorWidth}px`);
					contentStyle.setProperty("--bits-popper-anchor-height", `${anchorHeight}px`);
				},
			}),
			this.root.arrowNode.value &&
				arrow({ element: this.root.arrowNode.value, padding: this.arrowPadding.value }),
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
	wrapperProps = $derived({
		id: this.root.wrapperId.value,
		"data-bits-floating-content-wrapper": "",
		style: styleToString({
			...this.floating.floatingStyles,
			// keep off page when measuring
			transform: this.floating.isPositioned
				? this.floating.floatingStyles.transform
				: "translate(0, -200%)",
			"min-width": "max-content",
			"z-index": this.contentZIndex,
			"--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
			// hide the content if using the hide middleware and should be hidden
			...(this.floating.middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				"pointer-events": "none",
			}),
		}),
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
			animation: !this.floating.isPositioned ? "none" : undefined,
		}),
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
		this.floating = useFloating({
			strategy: () => this.strategy?.value,
			placement: () => this.desiredPlacement,
			middleware: () => this.middleware,
			reference: () => this.root?.anchorNode?.value,
			whileElementsMounted: (...args) => {
				const cleanup = autoUpdate(...args, {
					animationFrame: this.updatePositionStrategy?.value === "always",
				});
				return cleanup;
			},
		});

		this.arrowSize = useSize(this.root.arrowNode);

		this.root.contentNode = useNodeById(this.id);

		$effect(() => {
			if (this.floating.isPositioned) {
				this.onPlaced?.value();
			}
		});

		$effect(() => {
			const contentNode = this.root.contentNode.value;
			if (!contentNode) return;

			untrack(() => {
				this.contentZIndex = window.getComputedStyle(contentNode).zIndex;
			});
		});

		$effect(() => {
			const f = untrack(() => this.floating);
			f.floating = this.root.wrapperNode;
		});
	}
}

type FloatingArrowStateProps = ReadonlyBoxedValues<{
	id: string;
	style: StyleProperties;
}>;

class FloatingArrowState {
	root = undefined as unknown as FloatingRootState;
	id = undefined as unknown as ReadonlyBox<string>;

	constructor(props: FloatingArrowStateProps, root: FloatingRootState) {
		this.id = props.id;
		this.root = root;
		this.root.arrowNode = useNodeById(this.id);
	}
}

type FloatingAnchorStateProps = ReadonlyBoxedValues<{
	id: string;
}>;

class FloatingAnchorState {
	constructor(props: FloatingAnchorStateProps, root: FloatingRootState) {
		root.anchorNode = useNodeById(props.id);
	}
}

//
// CONTEXT METHODS
//

const FLOATING_ROOT_KEY = Symbol("Popper.Root");

export function setFloatingRootState() {
	return setContext(FLOATING_ROOT_KEY, new FloatingRootState());
}

export function getFloatingRootState(): FloatingRootState {
	return getContext(FLOATING_ROOT_KEY);
}

export function setFloatingContentState(props: FloatingContentStateProps): FloatingContentState {
	return getFloatingRootState().createContent(props);
}

export function setFloatingArrowState(props: FloatingArrowStateProps): FloatingArrowState {
	return getFloatingRootState().createArrow(props);
}

export function setFloatingAnchorState(props: FloatingAnchorStateProps): FloatingAnchorState {
	return getFloatingRootState().createAnchor(props);
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
