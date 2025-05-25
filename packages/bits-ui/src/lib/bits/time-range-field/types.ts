import type { Time } from "@internationalized/date";
import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type {
	BitsPrimitiveDivAttributes,
	BitsPrimitiveSpanAttributes,
} from "$lib/shared/attributes.js";
import type { TimeSegmentPart } from "$lib/shared/index.js";
import type {
	TimeFieldSegmentProps,
	TimeFieldSegmentPropsWithoutHTML,
} from "$lib/bits/time-field/types.js";
import type {
	EditableTimeSegmentPart,
	TimeGranularity,
	TimeOnInvalid,
	TimeRange,
	TimeRangeValidator,
	TimeValue,
} from "$lib/shared/date/types.js";

export type TimeRangeFieldRootPropsWithoutHTML<T extends TimeValue = Time> = WithChild<{
	/**
	 * The value of the date range field.
	 *
	 * @bindable
	 */
	value?: TimeRange<T>;

	/**
	 * A callback that is called when the value of the date range field changes.
	 */
	onValueChange?: OnChangeFn<TimeRange<T> | undefined>;

	/**
	 * The placeholder value of the time field. This determines the format
	 * and what date the field starts at when it is empty.
	 *
	 * @bindable
	 */
	placeholder?: TimeValue;

	/**
	 * A callback that is called when the time field's placeholder value changes.
	 */
	onPlaceholderChange?: OnChangeFn<TimeValue | undefined>;

	/**
	 * A function that returns a string or array of strings as validation errors if the date is
	 * invalid, or nothing if the date is valid
	 */
	validate?: TimeRangeValidator<T>;

	/**
	 * A callback fired when the time field's value is invalid. Use this to display an error
	 * message to the user.
	 */
	onInvalid?: TimeOnInvalid;

	/**
	 * The minimum acceptable date. When provided, the time field
	 * will be marked as invalid if the user enters a date before this date.
	 */
	minValue?: TimeValue;

	/**
	 * The maximum acceptable date. When provided, the time field
	 * will be marked as invalid if the user enters a date after this date.
	 */
	maxValue?: TimeValue;

	/**
	 * If true, the time field will be disabled and users will not be able
	 * to interact with it. This also disables the hidden input element if
	 * the time field is used in a form.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * If true, the time field will be readonly, and users will not be able to
	 * edit the values of any of the individual segments.
	 *
	 * @default false
	 */
	readonly?: boolean;

	/**
	 * If true, the time field will be required, which is useful when used within
	 * a form. If the time field is empty when the form is submitted, the form
	 * will not be valid.
	 *
	 * @default false
	 */
	required?: boolean;

	/**
	 * An array of segment names that should be readonly. If provided, only the
	 * segments not in this array will be editable.
	 */
	readonlySegments?: EditableTimeSegmentPart[];

	/**
	 * The format to use for displaying the time in the input.
	 * If using a 12 hour clock, ensure you also include the `dayPeriod`
	 * segment in your input to ensure the user can select AM/PM.
	 *
	 * @default - the locale's default time format
	 */
	hourCycle?: 12 | 24;

	/**
	 * The locale to use for formatting the time field.
	 *
	 * @default 'en'
	 */
	locale?: string;

	/**
	 * The granularity of the time field. This determines which
	 * segments will be includes in the segments array used to
	 * build the time field.
	 *
	 * Granularity is only used for visual purposes, and does not impact
	 * the value of the time field. You can have the same value synced
	 * between multiple time fields with different granularities and they
	 * will all contain the same value.
	 *
	 * @default 'minute'
	 */
	granularity?: TimeGranularity;

	/**
	 * Whether or not to hide the timeZoneName segment from the time field.
	 *
	 * @defaultValue false;
	 */
	hideTimeZone?: boolean;

	/**
	 * A callback function called when the start value changes. This doesn't necessarily mean
	 * the `value` has updated and should be used to apply cosmetic changes to the field when
	 * only part of the value is changed/completed.
	 */
	onStartValueChange?: OnChangeFn<T | undefined>;

	/**
	 * A callback function called when the end value changes. This doesn't necessarily mean
	 * the `value` has updated and should be used to apply cosmetic changes to the field when
	 * only part of the value is changed/completed.
	 */
	onEndValueChange?: OnChangeFn<T | undefined>;

	/**
	 * The `id` of the element which contains the error messages for the time field when the
	 * time is invalid.
	 */
	errorMessageId?: string;
}>;

export type TimeRangeFieldRootProps<T extends TimeValue = Time> =
	TimeRangeFieldRootPropsWithoutHTML<T> &
		Without<BitsPrimitiveDivAttributes, TimeRangeFieldRootPropsWithoutHTML<T>>;

export type TimeRangeFieldLabelPropsWithoutHTML = WithChild;

export type TimeRangeFieldLabelProps = TimeRangeFieldLabelPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, TimeRangeFieldLabelPropsWithoutHTML>;

export type TimeRangeFieldInputSnippetProps = {
	segments: Array<{ part: TimeSegmentPart; value: string }>;
};

export type TimeRangeFieldInputPropsWithoutHTML = WithChild<
	{
		/**
		 * The name to use for the hidden input element associated with this input
		 * used for form submission.
		 */
		name?: string;

		/**
		 * Whether this input represents the start or end of the date range.
		 */
		type: "start" | "end";
	},
	TimeRangeFieldInputSnippetProps
>;

export type TimeRangeFieldInputProps = TimeRangeFieldInputPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, TimeRangeFieldInputPropsWithoutHTML>;

export type TimeRangeFieldSegmentPropsWithoutHTML = TimeFieldSegmentPropsWithoutHTML;

export type TimeRangeFieldSegmentProps = TimeFieldSegmentProps;
