import type * as I from "./_types.js";
import type { HTMLDivAttributes, HTMLSpanAttributes } from "$lib/internal/index.js";
import type {
	Events as CalendarEvents,
	CellProps,
	DayEvents,
	DayProps,
	GridBodyProps,
	GridHeadProps,
	GridProps,
	GridRowProps,
	HeadCellProps,
	HeaderProps,
	HeadingProps,
	NextButtonEvents,
	NextButtonProps,
	PrevButtonEvents,
	PrevButtonProps,
} from "$lib/bits/range-calendar/types.js";
import type {
	ArrowProps,
	CloseEvents,
	CloseProps,
	ContentProps,
	TriggerEvents,
	TriggerProps,
} from "$lib/bits/popover/types.js";
import type { SegmentEvents } from "$lib/bits/date-range-field/types.js";

type Props = I.Props;
type LabelProps = I.LabelProps & HTMLSpanAttributes;
type SegmentProps = I.SegmentProps & HTMLDivAttributes;
type InputProps = I.InputProps & HTMLDivAttributes;
type DescriptionProps = I.DescriptionProps & HTMLDivAttributes;
type CalendarProps = I.CalendarProps & HTMLDivAttributes;

export type {
	Props,
	CalendarProps,
	LabelProps,
	DescriptionProps,
	InputProps,
	SegmentProps,
	CellProps,
	DayProps,
	GridBodyProps,
	GridHeadProps,
	GridRowProps,
	GridProps,
	HeadCellProps,
	HeaderProps,
	HeadingProps,
	NextButtonProps,
	PrevButtonProps,
	TriggerProps,
	ContentProps,
	ArrowProps,
	CloseProps,
	//
	CloseEvents,
	TriggerEvents,
	NextButtonEvents,
	PrevButtonEvents,
	DayEvents,
	CalendarEvents,
	SegmentEvents,
};
