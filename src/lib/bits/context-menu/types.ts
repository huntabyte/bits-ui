import type {
	ArrowProps,
	CheckboxItemProps,
	RadioGroupProps,
	RadioItemProps,
	GroupProps,
	SubContentProps,
	SubTriggerProps,
	ContextTriggerProps as TriggerProps,
	ItemProps,
	CheckboxIndicatorProps,
	SeparatorProps,
	SubProps,
	LabelProps,
	Props,
	RadioIndicatorProps,
	//
	ContentEvents,
	CheckboxItemEvents,
	ItemEvents,
	RadioItemEvents,
	SubTriggerEvents,
	ContextTriggerEvents as TriggerEvents,
	SubContentEvents
} from "$lib/bits/menu/index.js";
import type { HTMLDivAttributes, Transition } from "$lib/internal";
import type * as I from "./_types.js";

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes;

export type {
	Props,
	SubProps,
	ItemProps,
	ArrowProps,
	GroupProps,
	LabelProps,
	ContentProps,
	TriggerProps,
	RadioItemProps,
	SeparatorProps,
	RadioGroupProps,
	SubContentProps,
	SubTriggerProps,
	CheckboxItemProps,
	CheckboxIndicatorProps,
	RadioIndicatorProps,
	//,
	ItemEvents,
	TriggerEvents,
	ContentEvents,
	RadioItemEvents,
	SubContentEvents,
	SubTriggerEvents,
	CheckboxItemEvents
};
