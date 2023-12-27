import type { HTMLDivAttributes, Transition } from "$lib/internal";
import type * as I from "./_types.js";

export type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes;
