import type { Writable } from "svelte/store";
import type { FloatingConfig } from "./floating-config";
import type { FloatingProps } from "./_types.js";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

const defaultPositioningProps = {
	side: "bottom",
	align: "center",
	sideOffset: 0,
	alignOffset: 0,
	sameWidth: false,
	avoidCollisions: true,
	collisionPadding: 8,
	fitViewport: false
} satisfies FloatingProps;

export function getPositioningUpdater(store: Writable<FloatingConfig>) {
	return (props: FloatingProps = {}) => {
		return updatePositioning(store, props);
	};
}

export function updatePositioning(store: Writable<FloatingConfig>, props: FloatingProps) {
	const withDefaults = { ...defaultPositioningProps, ...props } satisfies FloatingProps;
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
