import type { AsChild, Transition, TransitionProps } from "$lib/internal/index.js";

export type ArrowProps = Expand<
	{
		size?: number;
	} & AsChild
>;

export type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & AsChild>;
