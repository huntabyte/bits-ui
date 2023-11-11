import type { CreateCalendarProps } from "@melt-ui/svelte";
import type { DateValue } from "@internationalized/date";
import type { AsChild, HTMLDivAttributes, OnChangeFn } from "$lib/internal";
import type {
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLTableAttributes,
	HTMLTdAttributes,
	HTMLThAttributes
} from "svelte/elements";

type Props = Expand<
	Omit<
		CreateCalendarProps,
		| "placeholder"
		| "defaultPlaceholder"
		| "value"
		| "defaultValue"
		| "onPlaceholderChange"
		| "onValueChange"
	> & {
		placeholder?: DateValue;
		value?: DateValue;
		onPlaceholderChange?: OnChangeFn<DateValue>;
		onValueChange?: OnChangeFn<DateValue | undefined>;
		asChild?: boolean;
	}
> &
	Omit<HTMLDivAttributes, "placeholder">;

type ButtonProps = Expand<AsChild> & HTMLButtonAttributes;

type PrevButtonProps = ButtonProps;
type NextButtonProps = ButtonProps;

type HeadingProps = Expand<AsChild> & HTMLDivAttributes;

type HeaderProps = Expand<AsChild> & HTMLDivAttributes;

type GridProps = Expand<AsChild> & HTMLTableAttributes;

type GridHeadProps = Expand<AsChild> & HTMLAttributes<HTMLTableSectionElement>;

type GridHeadCellProps = Expand<AsChild> & HTMLThAttributes;

type GridBodyProps = Expand<AsChild> & HTMLAttributes<HTMLTableSectionElement>;

type GridRowProps = Expand<AsChild> & HTMLAttributes<HTMLTableRowElement>;

type BaseDateProps = Expand<
	{
		/**
		 * The date value of the cell.
		 */
		date: DateValue;

		/**
		 * The month value that the cell belongs to.
		 */
		month: DateValue;
	} & AsChild
>;

type GridBodyCellProps = Expand<Omit<BaseDateProps, "month">> & HTMLTdAttributes;
type DateProps = Expand<BaseDateProps> & HTMLDivAttributes;

export type {
	Props,
	PrevButtonProps,
	NextButtonProps,
	HeadingProps,
	GridProps,
	GridBodyCellProps,
	GridRowProps,
	GridBodyProps,
	GridHeadCellProps,
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
	GridHeadCellProps as CalendarGridHeadCellProps,
	GridBodyProps as CalendarGridBodyProps,
	GridBodyCellProps as CalendarGridBodyCellProps,
	GridRowProps as CalendarGridRowProps,
	DateProps as CalendarDateProps
};
