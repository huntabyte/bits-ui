/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { DOMElement, OnChangeFn } from "$lib/internal/index.js";
import type { DateValue } from "@internationalized/date";
import type { CreateCalendarProps } from "@melt-ui/svelte";

type OmitCalendarProps<T> = Omit<
	T,
	| "placeholder"
	| "defaultPlaceholder"
	| "value"
	| "defaultValue"
	| "onPlaceholderChange"
	| "onValueChange"
	| "ids"
>;

type Props<Multiple extends boolean = false> = Expand<
	OmitCalendarProps<CreateCalendarProps<Multiple>> & {
		/**
		 * The selected date value. This updates as the user selects
		 * date(s) in the calendar.
		 *
		 * You can bind this to a value to programmatically control the
		 * value state.
		 */
		value?: CreateCalendarProps<Multiple>["defaultValue"];

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<CreateCalendarProps<Multiple>["defaultValue"]>;

		/**
		 * The placeholder date, used to display the calendar when no
		 * date is selected. This updates as the user navigates
		 * the calendar.
		 *
		 * You can bind this to a value to programmatically control the
		 * placeholder state.
		 */
		placeholder?: DateValue;

		/**
		 * A callback function called when the placeholder changes.
		 */
		onPlaceholderChange?: OnChangeFn<DateValue>;

		/**
		 * If `true`, the calendar will focus the selected day,
		 * today, or the first day of the month in that order depending
		 * on what is visible when the calendar is mounted.
		 *
		 * @default false
		 */
		initialFocus?: boolean;
	} & DOMElement
>;

type PrevButtonProps = DOMElement<HTMLButtonElement>;

type NextButtonProps = DOMElement<HTMLButtonElement>;

type HeadingProps = DOMElement;

type HeaderProps = DOMElement<HTMLElement>;

type GridHeadProps = DOMElement<HTMLTableSectionElement>;

type HeadCellProps = DOMElement<HTMLTableCellElement>;

type GridProps = DOMElement<HTMLTableElement>;

type GridBodyProps = DOMElement<HTMLTableSectionElement>;

type GridRowProps = DOMElement<HTMLTableRowElement>;

type BaseDayProps = Expand<{
	/**
	 * The date value of the cell.
	 */
	date: DateValue;

	/**
	 * The month value that the cell belongs to.
	 */
	month: DateValue;
}>;

type CellProps = Expand<Omit<BaseDayProps, "month">> & DOMElement<HTMLTableCellElement>;

type DayProps = Expand<BaseDayProps & DOMElement>;

export type {
	Props,
	PrevButtonProps,
	NextButtonProps,
	HeadingProps,
	HeaderProps,
	GridProps,
	GridHeadProps,
	HeadCellProps,
	GridBodyProps,
	GridRowProps,
	CellProps,
	DayProps
};
