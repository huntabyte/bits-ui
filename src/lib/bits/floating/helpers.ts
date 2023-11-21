import type { Writable } from "svelte/store";
import type { FloatingConfig } from "./floating-config";
import type { Boundary } from "./_types.js";

export type Side = "top" | "right" | "bottom" | "left";
export type Align = "start" | "center" | "end";

export type PositioningProps = {
	side?: Side;
	align?: Align;
	sideOffset?: number;
	alignOffset?: number;
	collisionPadding?: number;
	avoidCollisions?: boolean;
	sameWidth?: boolean;
	collisionBoundary?: Boundary;
	fitViewport?: boolean;
};

const defaultPositioningProps = {
	side: "bottom",
	align: "center",
	sideOffset: 0,
	alignOffset: 0,
	sameWidth: false,
	avoidCollisions: true,
	collisionPadding: 8,
	fitViewport: false
} satisfies PositioningProps;

export function getPositioningUpdater(store: Writable<FloatingConfig>) {
	return (props: PositioningProps = {}) => {
		return updatePositioning(store, props);
	};
}

export function updatePositioning(store: Writable<FloatingConfig>, props: PositioningProps) {
	const withDefaults = { ...defaultPositioningProps, ...props } satisfies PositioningProps;
	store.update((prev) => {
		return {
			...prev,
			placement: joinPlacement(withDefaults.side, withDefaults.align),
			offset: {
				mainAxis: withDefaults.sideOffset,
				crossAxis: withDefaults.alignOffset
			},
			gutter: undefined,
			sameWidth: withDefaults.sameWidth,
			flip: withDefaults.avoidCollisions,
			overflowPadding: withDefaults.collisionPadding,
			boundary: withDefaults.collisionBoundary
		};
	});
}

function joinPlacement(side: Side, align: Align): FloatingConfig["placement"] {
	if (align === "center") return side;
	return `${side}-${align}`;
}
