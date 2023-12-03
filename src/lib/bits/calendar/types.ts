import type { HTMLDivAttributes } from "$lib/internal";
import type {
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLTableAttributes,
	HTMLTdAttributes,
	HTMLThAttributes
} from "svelte/elements";
import type * as I from "./_types.js";
import type { CustomEventHandler } from "$lib";

type Props<Multiple extends boolean = false> = I.Props<Multiple> &
	Omit<HTMLDivAttributes, "placeholder">;

type PrevButtonProps = I.PrevButtonProps & HTMLButtonAttributes;

type NextButtonProps = I.NextButtonProps & HTMLButtonAttributes;

type HeadingProps = I.HeadingProps & HTMLDivAttributes;

type HeaderProps = I.HeaderProps & HTMLDivAttributes;

type GridProps = I.GridProps & HTMLTableAttributes;

type GridHeadProps = I.GridHeadProps & HTMLAttributes<HTMLTableSectionElement>;

type HeadCellProps = I.HeadCellProps & HTMLThAttributes;

type GridBodyProps = I.GridBodyProps & HTMLAttributes<HTMLTableSectionElement>;

type GridRowProps = I.GridRowProps & HTMLAttributes<HTMLTableRowElement>;

type CellProps = I.CellProps & HTMLTdAttributes;

type DateProps = I.DateProps & HTMLDivAttributes;

/**
 * Events
 */

type ButtonEvents = {
	click: CustomEventHandler<MouseEvent, HTMLButtonElement>;
};

type PrevButtonEvents = ButtonEvents;

type NextButtonEvents = ButtonEvents;

type DateEvents = {
	click: CustomEventHandler<MouseEvent, HTMLDivElement>;
};

type Events = {
	keydown: CustomEventHandler<KeyboardEvent, HTMLDivElement>;
};

export type {
	Props,
	PrevButtonProps,
	NextButtonProps,
	HeadingProps,
	GridProps,
	CellProps,
	GridRowProps,
	GridBodyProps,
	HeadCellProps,
	GridHeadProps,
	HeaderProps,
	DateProps,
	//
	Props as CalendarProps,
	PrevButtonProps as CalendarPrevButtonProps,
	NextButtonProps as CalendarNextButtonProps,
	HeadingProps as CalendarHeadingProps,
	HeaderProps as CalendarHeaderProps,
	GridProps as CalendarGridProps,
	GridHeadProps as CalendarGridHeadProps,
	HeadCellProps as CalendarHeadCellProps,
	GridBodyProps as CalendarGridBodyProps,
	CellProps as CalendarCellProps,
	GridRowProps as CalendarGridRowProps,
	DateProps as CalendarDateProps,
	//
	// Events
	//
	Events,
	PrevButtonEvents,
	NextButtonEvents,
	DateEvents,
	//
	Events as CalendarEvents,
	PrevButtonEvents as CalendarPrevButtonEvents,
	NextButtonEvents as CalendarNextButtonEvents,
	DateEvents as CalendarDateEvents
};
