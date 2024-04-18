import type { Snippet } from "svelte";
import type { VirtualElement } from "@floating-ui/core";
import type { Align, Boundary, Side } from "./floating.svelte.js";
import type { Arrayable } from "$lib/internal/types.js";
import type { Box } from "$lib/internal/box.svelte.js";

export type FloatingContentProps = {
	id: string;
	side?: Side;
	sideOffset?: number;
	align?: Align;
	alignOffset?: number;
	arrowPadding?: number;
	avoidCollisions?: boolean;
	collisionBoundary?: Arrayable<Boundary>;
	collisionPadding?: number | Partial<Record<Side, number>>;
	sticky?: "partial" | "always";
	hideWhenDetached?: boolean;
	updatePositionStrategy?: "optimized" | "always";
	onPlaced?: () => void;
	children?: Snippet;
	strategy?: "absolute" | "fixed";
};

export type FloatingArrowProps = {
	id: string;
	children?: Snippet;
};

export type FloatingAnchorProps = {
	node: Box<HTMLElement | VirtualElement | null>;
	children?: Snippet;
};
