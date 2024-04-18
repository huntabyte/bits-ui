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
	useNodeById,
} from "$lib/internal/index.js";
import { useSize } from "$lib/internal/use-size.svelte.js";

export const SIDE_OPTIONS = ["top", "right", "bottom", "left"] as const;
export const ALIGN_OPTIONS = ["start", "center", "end"] as const;

export type Side = (typeof SIDE_OPTIONS)[number];
export type Align = (typeof ALIGN_OPTIONS)[number];

export type Boundary = Element | null;

class PopperRootState {
	contentNode = undefined as unknown as Box<HTMLElement | null>;
	anchorNode = undefined as unknown as Box<HTMLElement | VirtualElement | null>;
	arrowNode = undefined as unknown as Box<HTMLElement | null>;

	createAnchor(props: PopperAnchorStateProps) {
		return new PopperAnchorState(props, this);
	}

	createContent(props: PopperContentStateProps) {
		return new PopperContentState(props, this);
	}

	createArrow(props: PopperArrowStateProps) {
		return new PopperArrowState(props, this);
	}
}

type PopperContentStateProps = ReadonlyBoxedValues<{
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
	onPlaced: () => void;
}>;

class PopperContentState {
	root = undefined as unknown as PopperRootState;
	id = undefined as unknown as PopperContentStateProps["id"];
	side = undefined as unknown as PopperContentStateProps["side"];
	sideOffset = undefined as unknown as PopperContentStateProps["sideOffset"];
	align = undefined as unknown as PopperContentStateProps["align"];
	alignOffset = undefined as unknown as PopperContentStateProps["alignOffset"];
	arrowPadding = undefined as unknown as PopperContentStateProps["arrowPadding"];
	avoidCollisions = undefined as unknown as PopperContentStateProps["avoidCollisions"];
	collisionBoundary = undefined as unknown as PopperContentStateProps["collisionBoundary"];
	collisionPadding = undefined as unknown as PopperContentStateProps["collisionPadding"];
	sticky = undefined as unknown as PopperContentStateProps["sticky"];
	hideWhenDetached = undefined as unknown as PopperContentStateProps["hideWhenDetached"];
	updatePositionStrategy =
		undefined as unknown as PopperContentStateProps["updatePositionStrategy"];
	onPlaced = undefined as unknown as PopperContentStateProps["onPlaced"];
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

	constructor(props: PopperContentStateProps, root: PopperRootState) {
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

		this.root = root;

		this.root.contentNode = useNodeById(this.id);
	}
}

type PopperArrowStateProps = ReadonlyBoxedValues<{
	id: string;
}>;

class PopperArrowState {
	root = undefined as unknown as PopperRootState;
	id = undefined as unknown as ReadonlyBox<string>;

	constructor(props: PopperArrowStateProps, root: PopperRootState) {
		this.id = props.id;
		this.root = root;
		this.root.arrowNode = useNodeById(this.id);
	}
}

type PopperAnchorStateProps = BoxedValues<{
	node: HTMLElement | VirtualElement | null;
}>;

class PopperAnchorState {
	constructor(props: PopperAnchorStateProps, root: PopperRootState) {
		root.anchorNode = props.node;
	}
}

//
// CONTEXT METHODS
//

const POPPER_ROOT_KEY = Symbol("Popper.Root");

export function setPopperRootState() {
	return setContext(POPPER_ROOT_KEY, new PopperRootState());
}

export function getPopperRootState(): PopperRootState {
	return getContext(POPPER_ROOT_KEY);
}

export function setPopperContentState(props: PopperContentStateProps) {
	return getPopperRootState().createContent(props);
}

export function setPopperArrowState(props: PopperArrowStateProps) {
	return getPopperRootState().createArrow(props);
}

export function setPopperAnchorState(props: PopperAnchorStateProps) {
	return getPopperRootState().createAnchor(props);
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
