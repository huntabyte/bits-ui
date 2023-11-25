import type { HTMLDivAttributes } from "$lib/internal";
import type {
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLTableAttributes,
	HTMLTdAttributes,
	HTMLThAttributes
} from "svelte/elements";
import type * as I from "./_types.js";

type Props = I.Props & Omit<HTMLDivAttributes, "placeholder">;

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
	Props as RangeCalendarProps,
	PrevButtonProps as RangeCalendarPrevButtonProps,
	NextButtonProps as RangeCalendarNextButtonProps,
	HeadingProps as RangeCalendarHeadingProps,
	HeaderProps as RangeCalendarHeaderProps,
	GridProps as RangeCalendarGridProps,
	GridHeadProps as RangeCalendarGridHeadProps,
	HeadCellProps as RangeCalendarHeadCellProps,
	GridBodyProps as RangeCalendarGridBodyProps,
	CellProps as RangeCalendarCellProps,
	GridRowProps as RangeCalendarGridRowProps,
	DateProps as RangeCalendarDateProps
};
