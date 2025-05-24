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
import { attachRef, box, cssToStyleObj, styleToString, type ReadableBox } from "svelte-toolbelt";
import { Context, ElementSize, watch } from "runed";
import type { Arrayable, WithRefProps } from "$lib/internal/types.js";
import { isNotNull } from "$lib/internal/is.js";
import { useId } from "$lib/internal/use-id.js";
import type { Box, ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import { useFloating } from "$lib/internal/floating-svelte/use-floating.svelte.js";
import type { Measurable, UseFloatingReturn } from "$lib/internal/floating-svelte/types.js";
import type { Direction, StyleProperties } from "$lib/shared/index.js";

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
	anchorNode = box<Measurable | HTMLElement | null>(null);
	customAnchorNode = box<Measurable | HTMLElement | null | string>(null);
	triggerNode: ReadableBox<Measurable | HTMLElement | null> = box(null);

	constructor() {
		$effect(() => {
			if (this.customAnchorNode.current) {
				if (typeof this.customAnchorNode.current === "string") {
					this.anchorNode.current = document.querySelector(this.customAnchorNode.current);
				} else {
					this.anchorNode.current = this.customAnchorNode.current;
				}
			} else {
				this.anchorNode.current = this.triggerNode.current;
			}
		});
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
	style: StyleProperties | null | undefined | string;
	enabled: boolean;
	customAnchor: string | HTMLElement | null | Measurable;
}>;

class FloatingContentState {
	readonly opts: FloatingContentStateProps;
	readonly root: FloatingRootState;

	// nodes
	contentRef = box<HTMLElement | null>(null);
	wrapperRef = box<HTMLElement | null>(null);
	arrowRef = box<HTMLElement | null>(null);

	// ids
	arrowId: Box<string> = box(useId());

	#transformedStyle = $derived.by(() => {
		if (typeof this.opts.style === "string") return cssToStyleObj(this.opts.style);
		if (!this.opts.style) return {};
	});

	#updatePositionStrategy =
		undefined as unknown as FloatingContentStateProps["updatePositionStrategy"];
	#arrowSize = new ElementSize(() => this.arrowRef.current ?? undefined);
	#arrowWidth = $derived(this.#arrowSize?.width ?? 0);
	#arrowHeight = $derived(this.#arrowSize?.height ?? 0);
	#desiredPlacement = $derived.by(
		() =>
			(this.opts.side?.current +
				(this.opts.align.current !== "center"
					? `-${this.opts.align.current}`
					: "")) as Placement
	);
	#boundary = $derived.by(() =>
		Array.isArray(this.opts.collisionBoundary.current)
			? this.opts.collisionBoundary.current
			: [this.opts.collisionBoundary.current]
	);
	hasExplicitBoundaries = $derived(this.#boundary.length > 0);
	detectOverflowOptions = $derived.by(() => ({
		padding: this.opts.collisionPadding.current,
		boundary: this.#boundary.filter(isNotNull),
		altBoundary: this.hasExplicitBoundaries,
	}));
	#availableWidth = $state<number | undefined>(undefined);
	#availableHeight = $state<number | undefined>(undefined);
	#anchorWidth = $state<number | undefined>(undefined);
	#anchorHeight = $state<number | undefined>(undefined);
	middleware: Middleware[] = $derived.by(
		() =>
			[
				offset({
					mainAxis: this.opts.sideOffset.current + this.#arrowHeight,
					alignmentAxis: this.opts.alignOffset.current,
				}),
				this.opts.avoidCollisions.current &&
					shift({
						mainAxis: true,
						crossAxis: false,
						limiter: this.opts.sticky.current === "partial" ? limitShift() : undefined,
						...this.detectOverflowOptions,
					}),
				this.opts.avoidCollisions.current && flip({ ...this.detectOverflowOptions }),
				size({
					...this.detectOverflowOptions,
					apply: ({ rects, availableWidth, availableHeight }) => {
						const { width: anchorWidth, height: anchorHeight } = rects.reference;
						this.#availableWidth = availableWidth;
						this.#availableHeight = availableHeight;
						this.#anchorWidth = anchorWidth;
						this.#anchorHeight = anchorHeight;
					},
				}),
				this.arrowRef.current &&
					arrow({
						element: this.arrowRef.current,
						padding: this.opts.arrowPadding.current,
					}),
				transformOrigin({ arrowWidth: this.#arrowWidth, arrowHeight: this.#arrowHeight }),
				this.opts.hideWhenDetached.current &&
					hide({ strategy: "referenceHidden", ...this.detectOverflowOptions }),
			].filter(Boolean) as Middleware[]
	);
	floating: UseFloatingReturn;
	placedSide = $derived.by(() => getSideFromPlacement(this.floating.placement));
	placedAlign = $derived.by(() => getAlignFromPlacement(this.floating.placement));
	arrowX = $derived.by(() => this.floating.middlewareData.arrow?.x ?? 0);
	arrowY = $derived.by(() => this.floating.middlewareData.arrow?.y ?? 0);
	cannotCenterArrow = $derived.by(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
	contentZIndex = $state<string>();
	arrowBaseSide = $derived(OPPOSITE_SIDE[this.placedSide]);
	wrapperProps = $derived.by(
		() =>
			({
				id: this.opts.wrapperId.current,
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
					"--bits-floating-available-width": `${this.#availableWidth}px`,
					"--bits-floating-available-height": `${this.#availableHeight}px`,
					"--bits-floating-anchor-width": `${this.#anchorWidth}px`,
					"--bits-floating-anchor-height": `${this.#anchorHeight}px`,
					// hide the content if using the hide middleware and should be hidden
					...(this.floating.middlewareData.hide?.referenceHidden && {
						visibility: "hidden",
						"pointer-events": "none",
					}),
					...this.#transformedStyle,
				},
				// Floating UI calculates logical alignment based the `dir` attribute
				dir: this.opts.dir.current,
				...attachRef(this.wrapperRef),
			}) as const
	);
	props = $derived.by(
		() =>
			({
				"data-side": this.placedSide,
				"data-align": this.placedAlign,
				style: styleToString({
					...this.#transformedStyle,
					// if the FloatingContent hasn't been placed yet (not all measurements done)
					// we prevent animations so that users's animation don't kick in too early referring wrong sides
					// animation: !this.floating.isPositioned ? "none" : undefined,
				}),
				...attachRef(this.contentRef),
			}) as const
	);

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

	constructor(opts: FloatingContentStateProps, root: FloatingRootState) {
		this.opts = opts;
		this.root = root;

		if (opts.customAnchor) {
			this.root.customAnchorNode.current = opts.customAnchor.current;
		}

		watch(
			() => opts.customAnchor.current,
			(customAnchor) => {
				this.root.customAnchorNode.current = customAnchor;
			}
		);

		this.floating = useFloating({
			strategy: () => this.opts.strategy.current,
			placement: () => this.#desiredPlacement,
			middleware: () => this.middleware,
			reference: this.root.anchorNode,
			whileElementsMounted: (...args) => {
				const cleanup = autoUpdate(...args, {
					animationFrame: this.#updatePositionStrategy?.current === "always",
				});
				return cleanup;
			},
			open: () => this.opts.enabled.current,
		});

		$effect(() => {
			if (!this.floating.isPositioned) return;
			this.opts.onPlaced?.current();
		});

		watch(
			() => this.contentRef.current,
			(contentNode) => {
				if (!contentNode) return;
				this.contentZIndex = window.getComputedStyle(contentNode).zIndex;
			}
		);

		$effect(() => {
			this.floating.floating.current = this.wrapperRef.current;
		});
	}
}

type FloatingArrowStateProps = WithRefProps;

class FloatingArrowState {
	readonly opts: FloatingArrowStateProps;
	readonly content: FloatingContentState;

	constructor(opts: FloatingArrowStateProps, content: FloatingContentState) {
		this.opts = opts;
		this.content = content;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: this.content.arrowStyle,
				"data-side": this.content.placedSide,
				...attachRef(this.content.arrowRef),
			}) as const
	);
}

type FloatingAnchorStateProps = ReadableBoxedValues<{
	id: string;
	virtualEl?: Measurable | null;
	ref: Measurable | HTMLElement | null;
}>;

class FloatingAnchorState {
	readonly opts: FloatingAnchorStateProps;
	readonly root: FloatingRootState;

	constructor(opts: FloatingAnchorStateProps, root: FloatingRootState) {
		this.opts = opts;
		this.root = root;

		if (opts.virtualEl && opts.virtualEl.current) {
			root.triggerNode = box.from(opts.virtualEl.current);
		} else {
			root.triggerNode = opts.ref;
		}
	}
}

const FloatingRootContext = new Context<FloatingRootState>("Floating.Root");
const FloatingContentContext = new Context<FloatingContentState>("Floating.Content");

export function useFloatingRootState() {
	return FloatingRootContext.set(new FloatingRootState());
}

export function useFloatingContentState(props: FloatingContentStateProps): FloatingContentState {
	return FloatingContentContext.set(new FloatingContentState(props, FloatingRootContext.get()));
}

export function useFloatingArrowState(props: FloatingArrowStateProps): FloatingArrowState {
	return new FloatingArrowState(props, FloatingContentContext.get());
}

export function useFloatingAnchorState(props: FloatingAnchorStateProps): FloatingAnchorState {
	return new FloatingAnchorState(props, FloatingRootContext.get());
}

//
// HELPERS
//

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
