import type { AsChild, Transition } from "$lib/internal";
import type { FloatingContentProps } from "./index.js";

export type MenuContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<
	{
		sideOffset?: number;
	} & FloatingContentProps<T, In, Out> &
		AsChild
>;

export type MenuSubTriggerProps = Expand<
	{
		/**
		 * Whether the subtrigger is disabled or not.
		 *
		 * @defaultValue false;
		 */
		disabled?: boolean;
	} & AsChild
>;
