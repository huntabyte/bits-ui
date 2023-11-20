import * as C from "@/content/constants.js";
import { enums, union } from "./helpers.js";

export const floatingPositioning = {
	side: {
		type: {
			type: C.ENUM,
			definition: enums("top", "right", "bottom", "left")
		},
		description:
			"The preferred side of the anchor to render against when open. Will be reversed when collisions occur."
	},
	sideOffset: {
		type: C.NUMBER,
		default: "0",
		description: "The amount of offset to apply to the menu's position on the x-axis."
	},
	align: {
		type: {
			type: C.ENUM,
			definition: enums("start", "center", "end")
		},
		description: "The preferred alignment of the anchor to render against when open."
	},
	alignOffset: {
		type: C.NUMBER,
		default: "0",
		description: "An offset in pixels from the 'start' or 'end' alignment options."
	},
	avoidCollisions: {
		type: C.BOOLEAN,
		default: C.TRUE,
		description:
			"When `true`, overrides the `side` and `align` options to prevent collisions with the boundary edges."
	},
	collisionBoundary: {
		type: {
			type: C.UNION,
			definition: union("'clippingAncestors'", "Element", "Array<Element>", "Rect")
		},
		description: "A boundary element or array of elements to check for collisions against."
	},
	collisionPadding: {
		type: C.NUMBER,
		default: "0",
		description:
			"The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision."
	},
	fitViewport: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "Whether the floating element should be constrained to the viewport."
	},
	sameWidth: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "Whether the content should be the same width as the trigger."
	}
};
