import type { AsChild, Transition, TransitionProps } from "$lib/internal/index.js";

export type FloatingArrowProps = Expand<
	{
		size?: number;
	} & AsChild
>;

export type FloatingContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & AsChild>;
