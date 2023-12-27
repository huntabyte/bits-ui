import type { HTMLDivAttributes, HTMLSpanAttributes } from "$lib/internal/index.js";
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
	Events as CalendarEvents,
	DayEvents,
	PrevButtonEvents,
	NextButtonEvents
} from "../calendar/types.js";
import type {
	TriggerProps,
	ContentProps,
	ArrowProps,
	CloseProps,
	CloseEvents,
	TriggerEvents
} from "../popover/types.js";
import type { SegmentEvents } from "../date-field/types.js";

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
	// Events
	//
	CloseEvents,
	TriggerEvents,
	CalendarEvents,
	DayEvents,
	PrevButtonEvents,
	NextButtonEvents,
	SegmentEvents
};
