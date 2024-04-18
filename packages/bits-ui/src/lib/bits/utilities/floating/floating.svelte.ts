import type { VirtualElement } from "@floating-ui/core";
import { getContext, setContext } from "svelte";
import {
	type Middleware,
	type Placement,
	arrow,
	autoUpdate,
	computePosition,
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
	type BoxedValues,
	type ReadonlyBox,
	type ReadonlyBoxedValues,
	isHTMLElement,
	useNodeById,
} from "$lib/internal/index.js";
import { useSize } from "$lib/internal/use-size.svelte.js";

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
	contentNode = undefined as unknown as Box<HTMLElement | null>;
	anchorNode = undefined as unknown as Box<HTMLElement | VirtualElement | null>;
	arrowNode = undefined as unknown as Box<HTMLElement | null>;

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

type FloatingContentStateProps = ReadonlyBoxedValues<{
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
}>;

class FloatingContentState {
	root = undefined as unknown as FloatingRootState;
	id = undefined as unknown as FloatingContentStateProps["id"];
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
	arrowSize = useSize(this.root.arrowNode);
	arrowWidth = $derived(this.arrowSize.value?.width ?? 0);
	arrowHeight = $derived(this.arrowSize.value?.height ?? 0);
	desiredPlacement = $derived(
		this.side.value + (this.align.value !== "center" ? `-${this.align.value}` : "")
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

	middleware = $derived([
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
				contentStyle.setProperty("--bits-popper-available-width", `${availableWidth}px`);
				contentStyle.setProperty("--bits-popper-available-height", `${availableHeight}px`);
				contentStyle.setProperty("--bits-popper-anchor-width", `${anchorWidth}px`);
				contentStyle.setProperty("--bits-popper-anchor-height", `${anchorHeight}px`);
			},
		}),
		this.root.arrowNode.value &&
			arrow({ element: this.root.arrowNode.value, padding: this.arrowPadding.value }),
		transformOrigin({ arrowWidth: this.arrowWidth, arrowHeight: this.arrowHeight }),
		this.hideWhenDetached.value &&
			hide({ strategy: "referenceHidden", ...this.detectOverflowOptions }),
	]);

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

		this.root = root;

		this.root.contentNode = useNodeById(this.id);
		const contentNode = this.root.contentNode.value;
		if (contentNode) {
			Object.assign(contentNode.style, {
				position: this.strategy.value,
			});
		}
	}

	compute() {
		if (!this.root.anchorNode.value || !this.root.contentNode.value) return;
		// if the reference is no longer in the DOM, ignore it
		if (
			isHTMLElement(this.root.anchorNode.value) &&
			!this.root.anchorNode.value.ownerDocument.documentElement.contains(
				this.root.anchorNode.value
			)
		)
			return;

		computePosition(this.root.anchorNode.value, this.root.contentNode.value, {
			placement: this.desiredPlacement,
			strategy: "fixed",
			middleware: this.middleware,
		}).then((data) => {
			const x = Math.round(data.x);
			const y = Math.round(data.y);
			const contentNode = this.root.contentNode.value;
			if (!contentNode) return;

			// get the chosen side and align from the placement
			const [side, align] = getSideAndAlignFromPlacement(data.placement);

			contentNode.setAttribute("data-side", side);
			contentNode.setAttribute("data-align", align);

			Object.assign(contentNode.style, {
				position: this.strategy.value,
				top: `${y}px`,
				left: `${x}px`,
			});

			const arrowNode = this.root.arrowNode.value;

			if (isHTMLElement(arrowNode) && data.middlewareData.arrow) {
				const { x, y } = data.middlewareData.arrow;

				const dir = data.placement.split("-")[0] as Side;

				arrowNode.setAttribute("data-side", dir);

				Object.assign(arrowNode.style, {
					position: "absolute",
					left: x != null ? `${x}px` : "",
					top: y != null ? `${y}px` : "",
					[dir]: `calc(100% - ${this.arrowPadding.value}px)`,
					transform: ARROW_TRANSFORM[dir],
					backgroundColor: "inherit",
					zIndex: "inherit",
				});
			}
			return data;
		});
	}
}

type FloatingArrowStateProps = ReadonlyBoxedValues<{
	id: string;
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

type FloatingAnchorStateProps = BoxedValues<{
	node: HTMLElement | VirtualElement | null;
}>;

class FloatingAnchorState {
	constructor(props: FloatingAnchorStateProps, root: FloatingRootState) {
		root.anchorNode = props.node;
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
