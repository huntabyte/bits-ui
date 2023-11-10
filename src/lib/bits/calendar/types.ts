import type { CreateCalendarProps } from "@melt-ui/svelte";
import type { DateValue } from "@internationalized/date";
import type { AsChild, HTMLDivAttributes, OnChangeFn } from "$lib/internal";
import type { HTMLButtonAttributes, HTMLTableAttributes } from "svelte/elements";

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

type ButtonProps = HTMLButtonAttributes & AsChild;

type PrevButtonProps = ButtonProps;
type NextButtonProps = ButtonProps;

type HeadingProps = HTMLDivAttributes & AsChild;

type MonthProps = HTMLTableAttributes & AsChild;

type CellProps = HTMLDivAttributes & AsChild;

export type {
	Props,
	PrevButtonProps,
	NextButtonProps,
	HeadingProps,
	MonthProps,
	CellProps,
	//
	Props as CalendarProps,
	PrevButtonProps as CalendarPrevButtonProps,
	NextButtonProps as CalendarNextButtonProps,
	HeadingProps as CalendarHeadingProps,
	MonthProps as CalendarMonthProps,
	CellProps as CalendarCellProps
};
