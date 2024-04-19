import type { Snippet } from "svelte";
import type { VirtualElement } from "@floating-ui/core";
import type { Align, Boundary, Side } from "./floating-layer.svelte.js";
import type { Arrayable } from "$lib/internal/types.js";
import type { Box, ReadonlyBox } from "$lib/internal/box.svelte.js";
import type { StyleProperties, TextDirection } from "$lib/shared/index.js";

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
	content?: Snippet<[{ props: Record<string, unknown> }]>;
	strategy?: "absolute" | "fixed";
	dir?: TextDirection;
	style?: StyleProperties;
};

export type FloatingArrowProps = {
	id: string;
	children?: Snippet;
	style: StyleProperties;
};

export type FloatingAnchorProps = {
	id: string;
	children?: Snippet;
};
