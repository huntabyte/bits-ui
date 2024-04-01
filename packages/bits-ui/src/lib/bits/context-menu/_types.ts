import type { DOMElement, Transition, TransitionProps } from "$lib/internal/index.js";
import type { FloatingProps } from "$lib/bits/floating/_types.js";

type ContextFloatingProps = Omit<FloatingProps, "sameWidth" | "side" | "sideOffset" | "align">;

export type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<ContextFloatingProps & TransitionProps<T, In, Out> & DOMElement>;
