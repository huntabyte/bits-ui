import type { DOMEl, HTMLDivAttributes, HTMLSpanAttributes } from "$lib/internal/index.js";
import type * as I from "./_types.js";
import type {
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
	NextButtonEvents,
	PrevButtonEvents,
	DayEvents,
	Events as CalendarEvents
} from "$lib/bits/range-calendar/types.js";
import type {
	TriggerProps,
	ContentProps,
	ArrowProps,
	CloseProps,
	CloseEvents,
	TriggerEvents
} from "$lib/bits/popover/types.js";
import type { SegmentEvents } from "$lib/bits/date-range-field/types.js";

type Props = I.Props;
type LabelProps = I.Props & HTMLSpanAttributes & DOMEl<HTMLSpanElement>;
type SegmentProps = I.SegmentProps & HTMLDivAttributes & DOMEl;
type InputProps = I.InputProps & HTMLDivAttributes & DOMEl;
type DescriptionProps = I.DescriptionProps & HTMLDivAttributes & DOMEl;
type CalendarProps = I.CalendarProps & HTMLDivAttributes & DOMEl;

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
	SegmentEvents
};
