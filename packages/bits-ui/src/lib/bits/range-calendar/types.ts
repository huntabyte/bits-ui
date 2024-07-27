import type {
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLTableAttributes,
	HTMLTdAttributes,
	HTMLThAttributes,
} from "svelte/elements";
import type { DateValue } from "@internationalized/date";
import type { CreateRangeCalendarProps as MeltRangeCalendarProps } from "@melt-ui/svelte";
import type { DOMElement, HTMLDivAttributes, OnChangeFn } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

import type { DateRange } from "$lib/shared/index.js";

export type RangeCalendarPropsWithoutHTML = Expand<
	Omit<
		MeltRangeCalendarProps,
		| "placeholder"
		| "defaultPlaceholder"
		| "value"
		| "defaultValue"
		| "onPlaceholderChange"
		| "onValueChange"
		| "ids"
	> & {
		/**
		 * The selected date range. This updates as the user selects
		 * date ranges in the calendar.
		 *
		 * You can bind this to a value to programmatically control the
		 * value state.
		 */
		value?: DateRange | undefined;

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<DateRange> | undefined;

		/**
		 * The placeholder date, used to display the calendar when no
		 * date is selected. This updates as the user navigates
		 * the calendar.
		 *
		 * You can bind this to a value to programmatically control the
		 * placeholder state.
		 */
		placeholder?: DateValue | undefined;

		/**
		 * A callback function called when the placeholder changes.
		 */
		onPlaceholderChange?: OnChangeFn<DateValue> | undefined;

		/**
		 * If `true`, the calendar will focus the selected day,
		 * today, or the first day of the month in that order depending
		 * on what is visible when the calendar is mounted.
		 *
		 * @default false
		 */
		initialFocus?: boolean | undefined;

		/**
		 * The `start` value of the date range, which can exist prior
		 * to the `value` being set. The `value` is only set once a `start`
		 * and `end` value are selected.
		 *
		 * You can `bind:startValue` to a value to receive updates outside
		 * this component when the user selects a `start` value.
		 *
		 * Modifying this value outside the component will have no effect.
		 * To programmatically control the `start` value, use `bind:value`
		 * and update the `start` property of the `DateRange` object.
		 *
		 * This is provided as a convenience for use cases where you want
		 * to display the selected `start` value outside the component before
		 * the `value` is set.
		 */
		startValue?: DateValue | undefined;
	} & DOMElement
>;

export type RangeCalendarPrevButtonPropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type RangeCalendarNextButtonPropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type RangeCalendarHeadingPropsWithoutHTML = DOMElement;

export type RangeCalendarHeaderPropsWithoutHTML = DOMElement<HTMLElement>;

export type RangeCalendarGridHeadPropsWithoutHTML = DOMElement<HTMLTableSectionElement>;

export type RangeCalendarHeadCellPropsWithoutHTML = DOMElement<HTMLTableCellElement>;

export type RangeCalendarGridPropsWithoutHTML = DOMElement<HTMLTableElement>;

export type RangeCalendarGridBodyPropsWithoutHTML = DOMElement<HTMLTableSectionElement>;

export type RangeCalendarGridRowPropsWithoutHTML = DOMElement<HTMLTableRowElement>;

type RangeCalendarBaseDayPropsWithoutHTML = Expand<{
	/**
	 * The date value of the cell.
	 */
	date: DateValue;

	/**
	 * The month value that the cell belongs to.
	 */
	month: DateValue;
}>;

export type RangeCalendarCellPropsWithoutHTML = Expand<
	Omit<RangeCalendarBaseDayPropsWithoutHTML, "month"> & DOMElement<HTMLTableCellElement>
>;

export type RangeCalendarDayPropsWithoutHTML = Expand<
	RangeCalendarBaseDayPropsWithoutHTML & DOMElement
>;

//

export type RangeCalendarProps = RangeCalendarPropsWithoutHTML &
	Omit<HTMLDivAttributes, "placeholder">;

export type RangeCalendarPrevButtonProps = RangeCalendarPrevButtonPropsWithoutHTML &
	HTMLButtonAttributes;

export type RangeCalendarNextButtonProps = RangeCalendarNextButtonPropsWithoutHTML &
	HTMLButtonAttributes;

export type RangeCalendarHeadingProps = RangeCalendarHeadingPropsWithoutHTML & HTMLDivAttributes;

export type RangeCalendarHeaderProps = RangeCalendarHeaderPropsWithoutHTML & HTMLDivAttributes;

export type RangeCalendarGridProps = RangeCalendarGridPropsWithoutHTML & HTMLTableAttributes;

export type RangeCalendarGridHeadProps = RangeCalendarGridHeadPropsWithoutHTML &
	HTMLAttributes<HTMLTableSectionElement>;

export type RangeCalendarHeadCellProps = RangeCalendarHeadCellPropsWithoutHTML & HTMLThAttributes;

export type RangeCalendarGridBodyProps = RangeCalendarGridBodyPropsWithoutHTML &
	HTMLAttributes<HTMLTableSectionElement>;

export type RangeCalendarGridRowProps = RangeCalendarGridRowPropsWithoutHTML &
	HTMLAttributes<HTMLTableRowElement>;

export type RangeCalendarCellProps = RangeCalendarCellPropsWithoutHTML & HTMLTdAttributes;

export type RangeCalendarDayProps = RangeCalendarDayPropsWithoutHTML & HTMLDivAttributes;

/**
 * Events
 */

type RangeCalendarButtonEvents = {
	click: CustomEventHandler<MouseEvent, HTMLButtonElement>;
};

export type RangeCalendarPrevButtonEvents = RangeCalendarButtonEvents;

export type RangeCalendarNextButtonEvents = RangeCalendarButtonEvents;

export type RangeCalendarDayEvents = {
	click: CustomEventHandler<MouseEvent, HTMLDivElement>;
	focusin: CustomEventHandler<FocusEvent, HTMLDivElement>;
	mouseenter: CustomEventHandler<MouseEvent, HTMLDivElement>;
};

export type RangeCalendarEvents = {
	keydown: CustomEventHandler<KeyboardEvent, HTMLDivElement>;
};
