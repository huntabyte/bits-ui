import type { HTMLDivAttributes } from "$lib/internal/index.js";
import type { Props as MenubarProps } from "./_types.js";

import type {
	Props as MenuProps,
	SubProps,
	ItemProps,
	ArrowProps,
	GroupProps,
	LabelProps,
	MenubarTriggerProps as TriggerProps,
	ContentProps,
	RadioItemProps,
	SeparatorProps,
	RadioGroupProps,
	SubContentProps,
	SubTriggerProps,
	CheckboxItemProps,
	RadioIndicatorProps,
	CheckboxIndicatorProps,
	//
	MenubarTriggerEvents as TriggerEvents,
	ItemEvents,
	SubTriggerEvents,
	CheckboxItemEvents,
	RadioItemEvents,
	ContentEvents,
	SubContentEvents
} from "$lib/bits/menu/types.js";

type Props = MenubarProps & HTMLDivAttributes;

export type {
	Props,
	SubProps,
	MenuProps,
	ItemProps,
	ArrowProps,
	GroupProps,
	LabelProps,
	TriggerProps,
	ContentProps,
	RadioItemProps,
	SeparatorProps,
	RadioGroupProps,
	SubContentProps,
	SubTriggerProps,
	CheckboxItemProps,
	RadioIndicatorProps,
	CheckboxIndicatorProps,
	//
	ItemEvents,
	TriggerEvents,
	ContentEvents,
	RadioItemEvents,
	SubTriggerEvents,
	SubContentEvents,
	CheckboxItemEvents
};
