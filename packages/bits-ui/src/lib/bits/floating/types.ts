import type * as I from "./_types.js";
import type { HTMLDivAttributes, Transition } from "$lib/internal/index.js";

export type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = I.ContentProps<T, In, Out> & HTMLDivAttributes;
