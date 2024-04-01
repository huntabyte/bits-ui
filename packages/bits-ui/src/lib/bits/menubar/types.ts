import type { Props as MenubarProps } from "./_types.js";
import type { HTMLDivAttributes } from "$lib/internal/index.js";

import type {
	ArrowProps,
	CheckboxIndicatorProps,
	CheckboxItemEvents,
	CheckboxItemProps,
	ContentEvents,
	ContentProps,
	GroupProps,
	ItemEvents,
	ItemProps,
	LabelProps,
	Props as MenuProps,
	RadioGroupProps,
	RadioIndicatorProps,
	RadioItemEvents,
	RadioItemProps,
	SeparatorProps,
	SubContentEvents,
	SubContentProps,
	SubProps,
	SubTriggerEvents,
	SubTriggerProps,
	MenubarTriggerEvents as TriggerEvents,
	MenubarTriggerProps as TriggerProps,
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
	CheckboxItemEvents,
};
