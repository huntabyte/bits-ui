import type { Snippet } from "svelte";
import type { VirtualElement } from "@floating-ui/core";
import type { Align, Boundary, Side } from "./popper.svelte.js";
import type { Arrayable } from "$lib/internal/types.js";
import type { Box } from "$lib/internal/box.svelte.js";

export type PopperContentProps = {
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
};

export type PopperArrowProps = {
	id: string;
	children?: Snippet;
};

export type PopperAnchorProps = {
	node: Box<HTMLElement | VirtualElement | null>;
	children?: Snippet;
};
