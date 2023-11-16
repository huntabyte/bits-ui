/**
 * These types are shared between the various menu components,
 * such as `DropdownMenu`, `Menubar` & `ContextMenu`.
 */

import type { AsChild, Transition, TransitionProps } from "$lib/internal/index.js";

export type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<
	{
		sideOffset?: number;
	} & TransitionProps<T, In, Out> &
		AsChild
>;
