import type { DateValue } from "@internationalized/date";
import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type { DateMatcher, DateRange } from "$lib/shared/index.js";
import type { BitsPrimitiveDivAttributes } from "$lib/shared/attributes.js";
import type { Year } from "$lib/shared/date/types.js";

export type RangeMonthCalendarRootSnippetProps = {
	years: Year<DateValue>[];
};

export type RangeMonthCalendarRootPropsWithoutHTML = WithChild<
	{
		/**
		 * The value of the selected date range.
		 * @bindable
		 */
		value?: DateRange;

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<DateRange>;

		/**
		 * The placeholder date, used to control the view of the
		 * calendar when no value is present.
		 *
		 * @default the current date
		 */
		placeholder?: DateValue;

		/**
		 * A callback function called when the placeholder value
		 * changes.
		 */
		onPlaceholderChange?: OnChangeFn<DateValue>;

		/**
		 * The minimum number of months that can be selected in a range.
		 *
		 * @default undefined
		 */
		minMonths?: number;

		/**
		 * The maximum number of months that can be selected in a range.
		 *
		 * @default undefined
		 */
		maxMonths?: number;

		/**
		 * Whether or not users can deselect a date once selected
		 * without selecting another date.
		 *
		 * @default false
		 */
		preventDeselect?: boolean;

		/**
		 * The minimum date that can be selected in the calendar.
		 */
		minValue?: DateValue;

		/**
		 * The maximum date that can be selected in the calendar.
		 */
		maxValue?: DateValue;

		/**
		 * Whether or not the calendar is disabled.
		 *
		 * @default false
		 */
		disabled?: boolean;

		/**
		 * Applicable only when `numberOfMonths` is greater than 1.
		 *
		 * Controls whether to use paged navigation for the next and previous buttons in the
		 * date picker. With paged navigation set to `true`, clicking the next/prev buttons
		 * changes all months in view. When set to `false`, it shifts the view by a single month.
		 *
		 * For example, with `pagedNavigation` set to `true` and 2 months displayed (January and
		 * February), clicking the next button changes the view to March and April. If `pagedNavigation`
		 * is `false`, the view shifts to February and March.
		 *
		 * @default false
		 */
		pagedNavigation?: boolean;

		/**
		 * A function that receives a date and returns `true` or `false` to indicate whether
		 * the date is disabled.
		 *
		 * @remarks
		 * Disabled dates cannot be focused or selected. Additionally, they are tagged
		 * with a data attribute to enable custom styling.
		 *
		 * `[data-disabled]` - applied to disabled dates
		 *
		 */
		isDateDisabled?: DateMatcher;

		/**
		 * Dates matching the provided matchers are marked as "unavailable." Unlike disabled dates,
		 * users can still focus and select unavailable dates. However, selecting an unavailable date
		 * renders the date picker as invalid.
		 *
		 * For example, in a calendar for booking appointments, you might mark already booked dates as
		 * unavailable. These dates could become available again before the appointment date, allowing
		 * users to select them to learn more about the appointment.
		 *
		 * `[data-unavailable]` - applied to unavailable dates
		 *
		 */
		isDateUnavailable?: DateMatcher;

		/**
		 * Determines the number of months to display on the calendar simultaneously.
		 * For navigation between months, refer to the `pagedNavigation` prop.
		 *
		 * @default 1
		 */
		numberOfYears?: number;

		/**
		 * This label is exclusively used for accessibility, remaining hidden from the page.
		 * It's read by screen readers when the calendar is opened. The current month and year
		 * are automatically appended to the label, so you only need to provide the base label.
		 *
		 * For instance:
		 * - 'Date of birth' will be read as 'Date of birth, January 2021' if the current month is January 2021.
		 * - 'Appointment date' will be read as 'Appointment date, January 2021' if the current month is January 2021.
		 * - 'Booking date' will be read as 'Booking date, January 2021' if the current month is January 2021.
		 */
		calendarLabel?: string;

		/**
		 * The default locale setting.
		 *
		 * @default 'en'
		 */
		locale?: string;

		/**
		 * Whether the calendar is readonly. When true, the user will be able
		 * to focus and navigate the calendar, but will not be able to select
		 * dates. @see disabled for a similar prop that prevents focusing
		 * and selecting dates.
		 *
		 * @default false
		 */
		readonly?: boolean;

		/**
		 * Whether to automatically reset the range if any date within the selected range
		 * becomes disabled. When true, the entire range will be cleared if a disabled
		 * date is found between the start and end dates.
		 *
		 * @default false
		 */
		excludeDisabled?: boolean;

		/**
		 * A callback function called when the start value changes. This doesn't necessarily mean
		 * the `value` has updated and should be used to apply cosmetic changes to the calendar when
		 * only part of the value is changed/completed.
		 */
		onStartValueChange?: OnChangeFn<DateValue | undefined>;

		/**
		 * A callback function called when the end value changes. This doesn't necessarily mean
		 * the `value` has updated and should be used to apply cosmetic changes to the calendar when
		 * only part of the value is changed/completed.
		 */
		onEndValueChange?: OnChangeFn<DateValue | undefined>;

		/**
		 * The format of the month names in the calendar.
		 *
		 * @default "long"
		 */
		monthFormat?: Intl.DateTimeFormatOptions["month"] | ((month: number) => string);

		/**
		 * The format of the year names in the calendar.
		 *
		 * @default "numeric"
		 */
		yearFormat?: Intl.DateTimeFormatOptions["year"] | ((year: number) => string);
	},
	RangeMonthCalendarRootSnippetProps
>;

export type RangeMonthCalendarRootProps = RangeMonthCalendarRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, RangeMonthCalendarRootPropsWithoutHTML>;

export type RangeMonthCalendarDaySnippetProps = {
	disabled: boolean;
	unavailable: boolean;
	selected: boolean;
	month: string;
};

export type RangeMonthCalendarDayPropsWithoutHTML = WithChild<
	{},
	RangeMonthCalendarDaySnippetProps
>;

export type RangeMonthCalendarDayProps = RangeMonthCalendarDayPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, RangeMonthCalendarDayPropsWithoutHTML>;

export type {
	CalendarPrevButtonProps as RangeMonthCalendarPrevButtonProps,
	CalendarPrevButtonPropsWithoutHTML as RangeMonthCalendarPrevButtonPropsWithoutHTML,
	CalendarNextButtonProps as RangeMonthCalendarNextButtonProps,
	CalendarNextButtonPropsWithoutHTML as RangeMonthCalendarNextButtonPropsWithoutHTML,
	CalendarHeadingProps as RangeMonthCalendarHeadingProps,
	CalendarHeadingPropsWithoutHTML as RangeMonthCalendarHeadingPropsWithoutHTML,
	CalendarGridProps as RangeMonthCalendarGridProps,
	CalendarGridPropsWithoutHTML as RangeMonthCalendarGridPropsWithoutHTML,
	CalendarCellProps as RangeMonthCalendarCellProps,
	CalendarCellPropsWithoutHTML as RangeMonthCalendarCellPropsWithoutHTML,
	// CalendarDayProps as RangeMonthCalendarDayProps,
	// CalendarDayPropsWithoutHTML as RangeMonthCalendarDayPropsWithoutHTML,
	CalendarGridBodyProps as RangeMonthCalendarGridBodyProps,
	CalendarGridBodyPropsWithoutHTML as RangeMonthCalendarGridBodyPropsWithoutHTML,
	CalendarGridRowProps as RangeMonthCalendarGridRowProps,
	CalendarGridRowPropsWithoutHTML as RangeMonthCalendarGridRowPropsWithoutHTML,
	CalendarHeaderProps as RangeMonthCalendarHeaderProps,
	CalendarHeaderPropsWithoutHTML as RangeMonthCalendarHeaderPropsWithoutHTML,
	CalendarYearSelectProps as RangeMonthCalendarYearSelectProps,
	CalendarYearSelectPropsWithoutHTML as RangeMonthCalendarYearSelectPropsWithoutHTML,
} from "../calendar/types.js";
