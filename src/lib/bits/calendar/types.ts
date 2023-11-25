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
	DateProps as CalendarDateProps
};
