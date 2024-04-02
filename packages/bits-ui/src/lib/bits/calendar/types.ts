import type {
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLTableAttributes,
	HTMLTdAttributes,
	HTMLThAttributes,
} from "svelte/elements";
import type { DateValue } from "@internationalized/date";
import type { CreateCalendarProps as MeltCalendarProps } from "@melt-ui/svelte";
import type { DOMElement, HTMLDivAttributes, OnChangeFn } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

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

export type CalendarPropsWithoutHTML<Multiple extends boolean = false> = Expand<
	OmitCalendarProps<MeltCalendarProps<Multiple>> & {
		/**
		 * The selected date value. This updates as the user selects
		 * date(s) in the calendar.
		 *
		 * You can bind this to a value to programmatically control the
		 * value state.
		 */
		value?: MeltCalendarProps<Multiple>["defaultValue"];

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<MeltCalendarProps<Multiple>["defaultValue"]>;

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

export type CalendarPrevButtonPropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type CalendarNextButtonPropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type CalendarHeadingPropsWithoutHTML = DOMElement;

export type CalendarHeaderPropsWithoutHTML = DOMElement<HTMLElement>;

export type CalendarGridHeadPropsWithoutHTML = DOMElement<HTMLTableSectionElement>;

export type CalendarHeadCellPropsWithoutHTML = DOMElement<HTMLTableCellElement>;

export type CalendarGridPropsWithoutHTML = DOMElement<HTMLTableElement>;

export type CalendarGridBodyPropsWithoutHTML = DOMElement<HTMLTableSectionElement>;

export type CalendarGridRowPropsWithoutHTML = DOMElement<HTMLTableRowElement>;

export type CalendarBaseDayPropsWithoutHTML = Expand<{
	/**
	 * The date value of the cell.
	 */
	date: DateValue;

	/**
	 * The month value that the cell belongs to.
	 */
	month: DateValue;
}>;

export type CalendarCellPropsWithoutHTML = Expand<Omit<CalendarBaseDayPropsWithoutHTML, "month">> &
	DOMElement<HTMLTableCellElement>;

export type CalendarDayPropsWithoutHTML = Expand<CalendarBaseDayPropsWithoutHTML & DOMElement>;

export type CalendarProps<Multiple extends boolean = false> = CalendarPropsWithoutHTML<Multiple> &
	Omit<HTMLDivAttributes, "placeholder">;

export type CalendarPrevButtonProps = CalendarPrevButtonPropsWithoutHTML & HTMLButtonAttributes;

export type CalendarNextButtonProps = CalendarNextButtonPropsWithoutHTML & HTMLButtonAttributes;

export type CalendarHeadingProps = CalendarHeadingPropsWithoutHTML & HTMLDivAttributes;

export type CalendarHeaderProps = CalendarHeaderPropsWithoutHTML & HTMLDivAttributes;

export type CalendarGridProps = CalendarGridPropsWithoutHTML & HTMLTableAttributes;

export type CalendarGridHeadProps = CalendarGridHeadPropsWithoutHTML &
	HTMLAttributes<HTMLTableSectionElement>;

export type CalendarHeadCellProps = CalendarHeadCellPropsWithoutHTML & HTMLThAttributes;

export type CalendarGridBodyProps = CalendarGridBodyPropsWithoutHTML &
	HTMLAttributes<HTMLTableSectionElement>;

export type CalendarGridRowProps = CalendarGridRowPropsWithoutHTML &
	HTMLAttributes<HTMLTableRowElement>;

export type CalendarCellProps = CalendarCellPropsWithoutHTML & HTMLTdAttributes;

export type CalendarDayProps = CalendarDayPropsWithoutHTML & HTMLDivAttributes;

/**
 * Events
 */

type CalendarButtonEvents = {
	click: CustomEventHandler<MouseEvent, HTMLButtonElement>;
};

export type CalendarPrevButtonEvents = CalendarButtonEvents;

export type CalendarNextButtonEvents = CalendarButtonEvents;

export type CalendarDayEvents = {
	click: CustomEventHandler<MouseEvent, HTMLDivElement>;
};

export type CalendarEvents = {
	keydown: CustomEventHandler<KeyboardEvent, HTMLDivElement>;
};
