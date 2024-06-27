import type { OnChangeFn, WithAsChild } from "$lib/internal/types.js";
import type { Granularity, Matcher } from "$lib/shared/date/types.js";
import type { DateRange, EditableSegmentPart } from "$lib/shared/index.js";
import type { DateValue } from "@internationalized/date";

export type DateRangeFieldRootPropsWithoutHTML = WithAsChild<{
	/**
	 * The value of the date range field.
	 *
	 * @bindable
	 */
	value?: DateRange;

	/**
	 * A callback that is called when the value of the date range field changes.
	 */
	onValueChange?: OnChangeFn<DateRange | undefined>;

	/**
	 * The placeholder value of the date field. This determines the format
	 * and what date the field starts at when it is empty.
	 *
	 * @bindable
	 */
	placeholder?: DateValue | undefined;

	/**
	 * A callback that is called when the date field's placeholder value changes.
	 */
	onPlaceholderChange?: OnChangeFn<DateValue | undefined>;

	/**
	 * A function that returns true if the given date is unavailable,
	 * where if selected, the date field will be marked as invalid.
	 */
	isDateUnavailable?: Matcher;

	/**
	 * The minimum acceptable date. When provided, the date field
	 * will be marked as invalid if the user enters a date before this date.
	 */
	minValue?: DateValue | undefined;

	/**
	 * The maximum acceptable date. When provided, the date field
	 * will be marked as invalid if the user enters a date after this date.
	 */
	maxValue?: DateValue | undefined;

	/**
	 * If true, the date field will be disabled and users will not be able
	 * to interact with it. This also disables the hidden input element if
	 * the date field is used in a form.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * If true, the date field will be readonly, and users will not be able to
	 * edit the values of any of the individual segments.
	 *
	 * @defaultValue false
	 */
	readonly?: boolean;

	/**
	 * An array of segment names that should be readonly. If provided, only the
	 * segments not in this array will be editable.
	 */
	readonlySegments?: EditableSegmentPart[];

	/**
	 * The format to use for displaying the time in the input.
	 * If using a 12 hour clock, ensure you also include the `dayPeriod`
	 * segment in your input to ensure the user can select AM/PM.
	 *
	 * @defaultValue the locale's default time format
	 */
	hourCycle?: 12 | 24;

	/**
	 * The locale to use for formatting the date field.
	 *
	 * @defaultValue 'en'
	 */
	locale?: string;

	/**
	 * The granularity of the date field. This determines which
	 * segments will be includes in the segments array used to
	 * build the date field.
	 *
	 * By default, when a `CalendarDate` value is used, the granularity
	 * will default to `'day'`, and when a `CalendarDateTime` or `ZonedDateTime`
	 * value is used, the granularity will default to `'minute'`.
	 *
	 * Granularity is only used for visual purposes, and does not impact
	 * the value of the date field. You can have the same value synced
	 * between multiple date fields with different granularities and they
	 * will all contain the same value.
	 *
	 * @defaultValue 'day'
	 */
	granularity?: Granularity;

	/**
	 * Whether or not to hide the timeZoneName segment from the date field.
	 *
	 * @defaultValue false;
	 */
	hideTimeZone?: boolean;
}>;
