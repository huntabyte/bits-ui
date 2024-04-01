import { enums, seeFloating, union } from "./helpers.js";
import * as C from "$lib/content/constants.js";

export const floatingPositioning = {
	side: {
		type: {
			type: C.ENUM,
			definition: enums("top", "right", "bottom", "left"),
		},
		description: seeFloating(
			"The preferred side of the anchor to render against when open. Will be reversed when collisions occur.",
			"https://floating-ui.com/docs/computePosition#placement"
		),
	},
	sideOffset: {
		type: C.NUMBER,
		default: "0",
		description: seeFloating(
			"The amount of offset to apply to the menu's position on the x-axis.",
			"https://floating-ui.com/docs/offset#options"
		),
	},
	align: {
		type: {
			type: C.ENUM,
			definition: enums("start", "center", "end"),
		},
		description: seeFloating(
			"The preferred alignment of the anchor to render against when open.",
			"https://floating-ui.com/docs/computePosition#placement"
		),
	},
	alignOffset: {
		type: C.NUMBER,
		default: "0",
		description: seeFloating(
			"An offset in pixels from the 'start' or 'end' alignment options.",
			"https://floating-ui.com/docs/offset#options"
		),
	},
	avoidCollisions: {
		type: C.BOOLEAN,
		default: C.TRUE,
		description: seeFloating(
			"When `true`, overrides the `side` and `align` options to prevent collisions with the boundary edges.",
			"https://floating-ui.com/docs/flip"
		),
	},
	collisionBoundary: {
		type: {
			type: C.UNION,
			definition: union("'clippingAncestors'", "Element", "Array<Element>", "Rect"),
		},
		description: seeFloating(
			"A boundary element or array of elements to check for collisions against.",
			"https://floating-ui.com/docs/detectoverflow#boundary"
		),
	},
	collisionPadding: {
		type: C.NUMBER,
		default: "0",
		description: seeFloating(
			"The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.",
			"https://floating-ui.com/docs/detectOverflow#padding"
		),
	},
	fitViewport: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: seeFloating(
			"Whether the floating element should be constrained to the viewport.",
			"https://floating-ui.com/docs/size"
		),
	},
	sameWidth: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: seeFloating(
			"Whether the content should be the same width as the trigger.",
			"https://floating-ui.com/docs/size"
		),
	},
	strategy: {
		type: {
			type: C.ENUM,
			definition: enums("absolute", "fixed"),
		},
		default: "absolute",
		description: seeFloating(
			"The positioning strategy to use for the floating element.",
			"https://floating-ui.com/docs/computeposition#strategy"
		),
	},
	overlap: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: seeFloating(
			"Whether the floating element can overlap the reference element.",
			"https://floating-ui.com/docs/shift#options"
		),
	},
};
