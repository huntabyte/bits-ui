import type { Transition } from "$lib/internal";
import type { FloatingContentProps } from "./index.js";

export type MenuContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<
	{
		sideOffset?: number;
	} & FloatingContentProps<T, In, Out>
>;
